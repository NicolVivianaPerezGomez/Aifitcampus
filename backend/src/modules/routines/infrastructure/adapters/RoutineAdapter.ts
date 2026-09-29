import { DeepPartial, EntityManager, MoreThanOrEqual, Repository } from "typeorm";
import { withoutUndefined, isEmpty } from "../../../../shared/utils/persistence.util";
import { AppDataSource } from "../../../../shared/config/data-base";
import { RoutineModel } from "../persistence/RoutineModel";
import { RoutineLogModel } from "../persistence/RoutineLogModel";
import { ExerciseRoutineModel } from "../../../exercises/infrastructure/persistence/ExerciseRoutineModel";
import { ExerciseModel } from "../../../exercises/infrastructure/persistence/ExerciseModel";
import { Routine, RoutineExerciseItem } from "../../domain/entities/Routine";
import { Exercise } from "../../../exercises/domain/entities/Exercise";
import { RoutineExerciseInput, RoutineFilter, RoutinePort } from "../../domain/ports/RoutinePort";

// Relaciones que se cargan para devolver la rutina completa
const FULL_RELATIONS = {
  routineType: true,
  exerciseRoutines: { exercise: { category: true } },
} as const;

// Adaptador: conecta el dominio (Routine) con la base de datos (RoutineModel + ExerciseRoutineModel).
export class RoutineAdapter implements RoutinePort {
  private repo: Repository<RoutineModel>;
  private logRepo: Repository<RoutineLogModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(RoutineModel);
    this.logRepo = AppDataSource.getRepository(RoutineLogModel);
  }

  // ExerciseModel (BD) -> Exercise (dominio)
  private exerciseToDomain(model: ExerciseModel): Exercise {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      durationSeconds: model.durationSeconds,
      resourceType: model.resourceType,
      resourceUrl: model.resourceUrl,
      isActive: model.isActive !== false,
      categoryId: model.category?.id ?? null,
      category: model.category
        ? {
            id: model.category.id,
            name: model.category.name,
            description: model.category.description,
            isActive: model.category.isActive !== false,
          }
        : null,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  // RoutineModel (BD) -> Routine (dominio)
  private toDomain(model: RoutineModel): Routine {
    const exercises: RoutineExerciseItem[] = (model.exerciseRoutines ?? [])
      .map((er) => ({
        exerciseId: er.exercise?.id,
        orderIndex: er.orderIndex,
        sets: er.sets,
        reps: er.reps,
        restSeconds: er.restSeconds,
        exercise: er.exercise ? this.exerciseToDomain(er.exercise) : null,
      }))
      .sort((a, b) => a.orderIndex - b.orderIndex);

    return {
      id: model.id,
      name: model.name,
      description: model.description,
      totalDurationSeconds: model.totalDurationSeconds,
      isActive: model.isActive !== false,
      routineTypeId: model.routineType?.id ?? null,
      routineType: model.routineType
        ? {
            id: model.routineType.id,
            name: model.routineType.name,
            description: model.routineType.description,
            isActive: model.routineType.isActive !== false,
          }
        : null,
      userId: model.user?.id ?? null,
      exercises,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  // Routine (dominio) -> RoutineModel (BD): los ids se guardan a través de las relaciones
  private toModel(routine: Partial<Routine>): DeepPartial<RoutineModel> {
    const { routineTypeId, routineType: _t, userId, exercises: _e, ...rest } = routine;
    return {
      ...rest,
      ...(routineTypeId !== undefined && routineTypeId !== null ? { routineType: { id: routineTypeId } } : {}),
      ...(userId !== undefined && userId !== null ? { user: { id: userId } } : {}),
    } as DeepPartial<RoutineModel>;
  }

  // Guarda la lista de ejercicios de la rutina (tabla exercise_routines)
  private async saveExercises(manager: EntityManager, routineId: number, exercises: RoutineExerciseInput[]) {
    const repo = manager.getRepository(ExerciseRoutineModel);
    await repo.delete({ routine: { id: routineId } });
    if (exercises.length === 0) return;
    await repo.insert(
      exercises.map((item) => ({
        routineId,
        exercise: { id: item.exerciseId },
        orderIndex: item.orderIndex,
        sets: item.sets,
        reps: item.reps,
        restSeconds: item.restSeconds,
      }))
    );
  }

  async create(routine: Partial<Routine>, exercises: RoutineExerciseInput[]): Promise<Routine> {
    // Transacción: si falla guardar un ejercicio, no queda la rutina a medias
    const id = await AppDataSource.transaction(async (manager) => {
      const result = await manager
        .getRepository(RoutineModel)
        .insert(withoutUndefined(this.toModel(routine)) as never);
      const routineId = result.identifiers[0]!.id as number;
      await this.saveExercises(manager, routineId, exercises);
      return routineId;
    });
    return (await this.findById(id)) as Routine;
  }

  async update(id: number, routine: Partial<Routine>, exercises?: RoutineExerciseInput[]): Promise<Routine | null> {
    await AppDataSource.transaction(async (manager) => {
      const changes = withoutUndefined(this.toModel(routine));
      if (!isEmpty(changes)) await manager.getRepository(RoutineModel).update(id, changes as never);
      if (exercises) {
        await this.saveExercises(manager, id, exercises);
      }
    });
    return this.findById(id);
  }

  async findById(id: number): Promise<Routine | null> {
    const found = await this.repo.findOne({
      where: { id },
      relations: { ...FULL_RELATIONS, user: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findAll(filter: RoutineFilter): Promise<Routine[]> {
    const qb = this.repo
      .createQueryBuilder("r")
      .leftJoinAndSelect("r.routineType", "t")
      .leftJoinAndSelect("r.user", "u")
      .leftJoinAndSelect("r.exerciseRoutines", "er")
      .leftJoinAndSelect("er.exercise", "e")
      .leftJoinAndSelect("e.category", "c")
      .orderBy("r.name", "ASC")
      .addOrderBy("er.orderIndex", "ASC");

    if (filter.search) {
      qb.andWhere("(r.name ILIKE :s OR r.description ILIKE :s)", { s: `%${filter.search}%` });
    }
    if (filter.routineTypeId) {
      qb.andWhere("t.id = :typeId", { typeId: filter.routineTypeId });
    }
    if (filter.onlyActive) {
      qb.andWhere("r.is_active = true");
    }

    const found = await qb.getMany();
    return found.map((m) => this.toDomain(m));
  }

  async countLogsSince(routineId: number, since: Date): Promise<number> {
    return this.logRepo.count({ where: { routine: { id: routineId }, startedAt: MoreThanOrEqual(since) } });
  }
}
