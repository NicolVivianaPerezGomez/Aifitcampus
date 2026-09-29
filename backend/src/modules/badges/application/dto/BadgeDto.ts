// condition: qué debe lograr el usuario (ej. "pausas_completadas")
// targetValue: la meta numérica de esa condición (ej. 10)
export interface CreateBadgeDto {
  name: string;
  description?: string;
  condition?: string;
  targetValue?: number;
}

export interface UpdateBadgeDto {
  name?: string;
  description?: string;
  condition?: string;
  targetValue?: number;
  isActive?: boolean;
}
