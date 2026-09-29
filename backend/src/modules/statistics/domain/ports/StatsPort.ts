import { AdvancedStats } from "../entities/Stats";

export interface StatsPort {
  getAdvancedStats(): Promise<AdvancedStats>;
  getWeeklyStats(): Promise<AdvancedStats["cumplimientoSemanal"]>;
  getFranjaStats(): Promise<AdvancedStats["participacionFranja"]>;
  getDistribucionAnimo(): Promise<AdvancedStats["distribucionAnimo"]>;
  getUsuariosDestacados(limit?: number): Promise<AdvancedStats["usuariosDestacados"]>;
  getEjerciciosPopulares(limit?: number): Promise<AdvancedStats["ejerciciosPopulares"]>;
}
