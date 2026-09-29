import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { MicrosoftAuthController } from "../controllers/MicrosoftAuthController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import { adminMiddleware } from "../../../../shared/middleware/admin.middleware";
import {
  validateRegister,
  validateUpdateProfile,
  validateAssignDepartment,
  validateUpdatePermissions,
  validateResetPassword,
} from "../validations/user-validation";

const router = Router();

// Autenticación HU-01: único mecanismo, Microsoft 365 (OAuth Authorization Code)
router.get("/auth/microsoft", MicrosoftAuthController.redirect);
router.get("/auth/microsoft/callback", MicrosoftAuthController.callback);
router.post("/auth/register", validateRegister, UserController.registerPublic); // Registro público de usuarios
router.get("/auth/me", authMiddleware, UserController.me); // usuario de la sesión actual

// Usuarios (requieren sesión)
router.post("/users", authMiddleware, adminMiddleware, validateRegister, UserController.register); // HU-02 (Admin)
router.patch("/users/:id/profile", authMiddleware, validateUpdateProfile, UserController.updateProfile); // HU-03
router.get("/users", authMiddleware, adminMiddleware, UserController.search); // HU-05 CA-01 (Admin)
router.patch("/users/:id/deactivate", authMiddleware, adminMiddleware, UserController.deactivate); // HU-05 CA-02 (Admin)
router.patch("/users/:id/activate", authMiddleware, adminMiddleware, UserController.activate); // (Admin)
router.patch("/users/:id/department", authMiddleware, adminMiddleware, validateAssignDepartment, UserController.assignDepartment); // HU-13 (Admin)
router.patch("/users/:id/permissions", authMiddleware, adminMiddleware, validateUpdatePermissions, UserController.updatePermissions); // apoyo HU-07 (Admin)
router.patch("/users/:id/reset-password", authMiddleware, adminMiddleware, validateResetPassword, UserController.resetPassword); // (Admin)

export default router;
