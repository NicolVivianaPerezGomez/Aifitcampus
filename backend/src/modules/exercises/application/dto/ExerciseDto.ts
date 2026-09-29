// Los ejercicios son por video: resource_type siempre es "video" y
// resource_url guarda el enlace del video (YouTube, Vimeo, Drive, etc.).
export interface CreateExerciseDto {
  name: string;
  description?: string;
  durationSeconds?: number;
  resourceUrl: string;
  categoryId: number;
}

export interface UpdateExerciseDto {
  name?: string;
  description?: string;
  durationSeconds?: number;
  resourceUrl?: string;
  categoryId?: number;
  isActive?: boolean;
}
