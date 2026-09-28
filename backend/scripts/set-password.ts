/**
 * Script para asignar una contraseña a un usuario existente.
 * Uso: npx tsx scripts/set-password.ts <email> <nueva-contraseña>
 */
import bcrypt from "bcrypt";
import { AppDataSource } from "../src/shared/config/data-base";
import { UserModel } from "../src/modules/users/infrastructure/persistence/UserModel";

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("Uso: npx tsx scripts/set-password.ts <email> <nueva-contraseña>");
    process.exit(1);
  }

  await AppDataSource.initialize();
  console.log("Conectado a la base de datos");

  const user = await AppDataSource.getRepository(UserModel).findOne({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    console.error(`No se encontró el usuario con email: ${email}`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await AppDataSource.getRepository(UserModel).update(user.id, {
    password: hashedPassword,
  });

  console.log(`✅ Contraseña asignada correctamente para: ${user.email}`);
  await AppDataSource.destroy();
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
