import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { MicrosoftAuthController } from "../controllers/MicrosoftAuthController";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
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
router.post("/users", authMiddleware, validateRegister, UserController.register); // HU-02 (Admin)
router.patch("/users/:id/profile", authMiddleware, validateUpdateProfile, UserController.updateProfile); // HU-03
router.get("/users", authMiddleware, UserController.search); // HU-05 CA-01
router.patch("/users/:id/deactivate", authMiddleware, UserController.deactivate); // HU-05 CA-02
router.patch("/users/:id/activate", authMiddleware, UserController.activate);
router.patch("/users/:id/department", authMiddleware, validateAssignDepartment, UserController.assignDepartment); // HU-13
router.patch("/users/:id/permissions", authMiddleware, validateUpdatePermissions, UserController.updatePermissions); // apoyo HU-07
router.patch("/users/:id/reset-password", authMiddleware, validateResetPassword, UserController.resetPassword);

export default router;
