// Entidad de dominio: TypeScript puro, no depende de frameworks.
// Insignia ganada por un usuario. Mapeo en infrastructure/persistence/UserBadgeModel.ts
export interface UserBadge {
  id: number;
  userId: number;
  badgeId: number;
  earnedAt: Date | null;
  progress: number | null;
}
