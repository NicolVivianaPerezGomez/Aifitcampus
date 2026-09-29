import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(150).required(),
  lastName: Joi.string().min(2).max(150).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  roleId: Joi.number().integer().positive().required(),
  programId: Joi.number().integer().positive().required(),
  department: Joi.string().max(150).optional(),
  officeLocation: Joi.string().max(150).optional(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(150).optional(),
  lastName: Joi.string().min(2).max(150).optional(),
  mobilePhone: Joi.string().max(50).optional(),
  jobTitle: Joi.string().max(150).optional(),
  officeLocation: Joi.string().max(150).optional(),
  email: Joi.forbidden().messages({ "any.unknown": "El correo institucional no se puede modificar" }),
}).min(1);

const assignDepartmentSchema = Joi.object({
  department: Joi.string().min(2).max(150).required(), // CA-02 Área obligatoria
  officeLocation: Joi.string().max(150).optional(),
});

const updatePermissionsSchema = Joi.object({
  permissions: Joi.object().required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).max(100).required(),
});

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0]?.message });
  }
  next();
};

export const validateRegister = validate(registerSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
export const validateAssignDepartment = validate(assignDepartmentSchema);
export const validateUpdatePermissions = validate(updatePermissionsSchema);
export const validateResetPassword = validate(resetPasswordSchema);
