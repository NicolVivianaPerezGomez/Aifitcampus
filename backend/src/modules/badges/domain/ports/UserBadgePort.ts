import { UserBadge } from "../entities/UserBadge";

export interface UserBadgePort {
  findByUser(userId: number): Promise<UserBadge[]>;
  findByBadge(badgeId: number): Promise<UserBadge[]>;
  findById(id: number): Promise<UserBadge | null>;
  assign(userId: number, badgeId: number, progress?: number): Promise<UserBadge>;
  updateProgress(id: number, progress: number): Promise<UserBadge | null>;
  remove(id: number): Promise<void>;
}
