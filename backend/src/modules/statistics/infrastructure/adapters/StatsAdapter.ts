import { Repository } from "typeorm";
import { AppDataSource } from "../../../../shared/config/data-base";
import { RoutineLogModel } from "../../../routines/infrastructure/persistence/RoutineLogModel";
import { UserModel } from "../../../users/infrastructure/persistence/UserModel";
import { ExerciseRoutineModel } from "../../../exercises/infrastructure/persistence/ExerciseRoutineModel";
import { ExerciseModel } from "../../../exercises/infrastructure/persistence/ExerciseModel";
import { StatsPort } from "../../domain/ports/StatsPort";
import {
  AdvancedStats,
  WeeklyStats,
  FranjaStats,
  DistribucionAnimo,
  UsuarioDestacado,
  EjercicioPopular,
} from "../../domain/entities/Stats";

export class StatsAdapter implements StatsPort {
  private readonly logRepo: Repository<RoutineLogModel>;
  private readonly userRepo: Repository<UserModel>;
  private readonly exerciseRoutineRepo: Repository<ExerciseRoutineModel>;
  private readonly exerciseRepo: Repository<ExerciseModel>;

  constructor() {
    this.logRepo = AppDataSource.getRepository(RoutineLogModel);
    this.userRepo = AppDataSource.getRepository(UserModel);
    this.exerciseRoutineRepo = AppDataSource.getRepository(ExerciseRoutineModel);
    this.exerciseRepo = AppDataSource.getRepository(ExerciseModel);
  }

  async getAdvancedStats(): Promise<AdvancedStats> {
    const [pausasSemana, cumplimiento, animoPromedio, minutosInvertidos, pausasOmitidas, tasaRespuesta, cumplimientoSemanal, animoSemanal, minutosSemanales, participacionFranja, distribucionAnimo, usuariosDestacados, ejerciciosPopulares] =
      await Promise.all([
        this.getPausasSemana(),
        this.getCumplimiento(),
        this.getAnimoPromedio(),
        this.getMinutosInvertidos(),
        this.getPausasOmitidas(),
        this.getTasaRespuesta(),
        this.getWeeklyStats(),
        this.getAnimoSemanal(),
        this.getMinutosSemanales(),
        this.getFranjaStats(),
        this.getDistribucionAnimo(),
        this.getUsuariosDestacados(5),
        this.getEjerciciosPopulares(5),
      ]);

    return {
      pausasSemana,
      cumplimiento,
      animoPromedio,
      minutosInvertidos,
      pausasOmitidas,
      tasaRespuesta,
      cumplimientoSemanal,
      animoSemanal,
      minutosSemanales,
      participacionFranja,
      distribucionAnimo,
      usuariosDestacados,
      ejerciciosPopulares,
    };
  }

  async getWeeklyStats(): Promise<WeeklyStats[]> {
    const logs = await this.logRepo.find();
    const weeks = this.groupByWeek(logs);

    return weeks.map((week) => {
      const completed = week.logs.filter((l) => l.status === "completada");
      const totalSeconds = completed.reduce((acc, l) => acc + (l.durationSeconds ?? 0), 0);
      const cumplimiento = week.logs.length > 0 ? Math.round((completed.length / week.logs.length) * 100) : 0;

      return {
        weekStart: week.weekStart,
        pausas: week.logs.length,
        cumplimiento,
        animoPromedio: this.calcAnimoPromedio(completed.length, week.logs.length),
        minutos: Math.round(totalSeconds / 60),
      };
    });
  }

  async getFranjaStats(): Promise<FranjaStats[]> {
    const logs = await this.logRepo.find();
    let manana = 0, tarde = 0, noche = 0, madrugada = 0;

    for (const log of logs) {
      if (!log.startedAt) continue;
      const hour = new Date(log.startedAt).getHours();
      if (hour >= 6 && hour < 12) manana++;
      else if (hour >= 12 && hour < 18) tarde++;
      else if (hour >= 18 && hour < 24) noche++;
      else madrugada++;
    }

    return [
      { franja: "Mañana (6-12)", cantidad: manana },
      { franja: "Tarde (12-18)", cantidad: tarde },
      { franja: "Noche (18-24)", cantidad: noche },
      { franja: "Madrugada (0-6)", cantidad: madrugada },
    ];
  }

  async getDistribucionAnimo(): Promise<DistribucionAnimo[]> {
    const logs = await this.logRepo.find();
    let bien = 0, normal = 0, cansado = 0;

    for (const log of logs) {
      if (log.status === "completada") bien++;
      else if (log.status === "abandonada") normal++;
      else cansado++;
    }

    return [
      { animo: "Bien", cantidad: bien },
      { animo: "Normal", cantidad: normal },
      { animo: "Cansado", cantidad: cansado },
    ];
  }

  async getUsuariosDestacados(limit = 5): Promise<UsuarioDestacado[]> {
    const users = await this.userRepo.find({ where: { statusId: 1 } });
    const result: UsuarioDestacado[] = [];

    for (const user of users) {
      const logs = await this.logRepo.find({ where: { user: { id: user.id } } });
      const completed = logs.filter((l) => l.status === "completada");
      const racha = this.calcRacha(logs);

      result.push({
        userId: user.id,
        nombre: `${user.firstName} ${user.lastName}`,
        pausasCompletadas: completed.length,
        racha,
      });
    }

    return result.toSorted((a, b) => b.pausasCompletadas - a.pausasCompletadas).slice(0, limit);
  }

  async getEjerciciosPopulares(limit = 5): Promise<EjercicioPopular[]> {
    const exerciseRoutines = await this.exerciseRoutineRepo.find({ relations: ["exercise"] });
    const countMap: Record<number, number> = {};

    for (const er of exerciseRoutines) {
      if (er.exercise) {
        countMap[er.exercise.id] = (countMap[er.exercise.id] ?? 0) + 1;
      }
    }

    const sorted = Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);

    const result: EjercicioPopular[] = [];
    for (const [exerciseId, veces] of sorted) {
      const exercise = await this.exerciseRepo.findOneBy({ id: Number(exerciseId) });
      if (exercise) {
        result.push({
          exerciseId: exercise.id,
          nombre: exercise.name,
          vecesUsado: veces,
        });
      }
    }

    return result;
  }

  private async getPausasSemana(): Promise<number> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return await this.logRepo
      .createQueryBuilder("log")
      .where("log.startedAt >= :date", { date: oneWeekAgo.toISOString() })
      .getCount();
  }

  private async getCumplimiento(): Promise<number> {
    const logs = await this.logRepo.find();
    if (logs.length === 0) return 0;
    const completed = logs.filter((l) => l.status === "completada").length;
    return Math.round((completed / logs.length) * 100);
  }

  private async getAnimoPromedio(): Promise<number> {
    const logs = await this.logRepo.find();
    if (logs.length === 0) return 0;
    const completed = logs.filter((l) => l.status === "completada").length;
    return this.calcAnimoPromedio(completed, logs.length);
  }

  private async getMinutosInvertidos(): Promise<number> {
    const logs = await this.logRepo.find();
    const totalSeconds = logs
      .filter((l) => l.status === "completada")
      .reduce((acc, l) => acc + (l.durationSeconds ?? 0), 0);
    return Math.round(totalSeconds / 60);
  }

  private async getPausasOmitidas(): Promise<number> {
    const logs = await this.logRepo.find();
    return logs.filter((l) => l.status !== "completada").length;
  }

  private async getTasaRespuesta(): Promise<number> {
    const logs = await this.logRepo.find();
    if (logs.length === 0) return 0;
    const responded = logs.filter((l) => l.status !== null).length;
    return Math.round((responded / logs.length) * 100);
  }

  private async getAnimoSemanal(): Promise<WeeklyStats[]> {
    return this.getWeeklyStats();
  }

  private async getMinutosSemanales(): Promise<WeeklyStats[]> {
    return this.getWeeklyStats();
  }

  private groupByWeek(logs: RoutineLogModel[]): { weekStart: string; logs: RoutineLogModel[] }[] {
    const weeks: Record<string, RoutineLogModel[]> = {};

    for (const log of logs) {
      if (!log.startedAt) continue;
      const date = new Date(log.startedAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().slice(0, 10);

      (weeks[key] ??= []).push(log);
    }

    return Object.entries(weeks)
      .map(([weekStart, weekLogs]) => ({ weekStart, logs: weekLogs }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  }

  private calcAnimoPromedio(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  private calcRacha(logs: RoutineLogModel[]): number {
    if (logs.length === 0) return 0;
    const days = new Set(
      logs
        .map((l) => l.startedAt)
        .filter((d): d is Date => d !== null)
        .map((d) => d.toISOString().slice(0, 10))
    );
    let racha = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      if (days.has(key)) {
        racha++;
      } else if (i > 0) {
        break;
      }
    }

    return racha;
  }
}
