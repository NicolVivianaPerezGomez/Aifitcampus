import { Badge } from "../entities/Badge";

export interface BadgePort {
  create(badge: Partial<Badge>): Promise<Badge>;
  update(id: number, badge: Partial<Badge>): Promise<Badge | null>;
  findById(id: number): Promise<Badge | null>;
  findByName(name: string): Promise<Badge | null>;
  findAll(onlyActive: boolean): Promise<Badge[]>;
}
