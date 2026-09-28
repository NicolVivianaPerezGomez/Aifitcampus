export interface CreateExerciseCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateExerciseCategoryDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}
