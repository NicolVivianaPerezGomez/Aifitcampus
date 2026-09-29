// Mapeo de la tabla generado con typeorm-model-generator desde la base de datos.
// Capa de infraestructura (persistencia): aquí sí se usa TypeORM.
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserModel } from "../../../users/infrastructure/persistence/UserModel";

@Index("roles_pkey", ["id"], { unique: true })
@Index("roles_name_key", ["name"], { unique: true })
@Entity("roles", { schema: "public" })
export class RoleModel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 100 })
  name: string;

  @OneToMany(() => UserModel, (users) => users.role)
  users: UserModel[];
}
