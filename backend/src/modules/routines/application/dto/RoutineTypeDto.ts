export interface CreateRoutineTypeDto {
  name: string;
  description?: string;
}

export interface UpdateRoutineTypeDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}
