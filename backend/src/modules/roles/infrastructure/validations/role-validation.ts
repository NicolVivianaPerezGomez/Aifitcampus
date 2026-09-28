import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const createRoleSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
});

const renameRoleSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
});

const assignRoleSchema = Joi.object({
  roleId: Joi.number().integer().positive().required(),
});

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0]?.message });
  }
  next();
};

export const validateCreateRole = validate(createRoleSchema);
export const validateRenameRole = validate(renameRoleSchema);
export const validateAssignRole = validate(assignRoleSchema);
