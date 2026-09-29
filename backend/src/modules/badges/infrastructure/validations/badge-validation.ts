import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const createBadgeSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(2000).allow("").optional(),
  condition: Joi.string().max(255).optional(),
  targetValue: Joi.number().integer().positive().optional(),
});

const updateBadgeSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(2000).allow("").optional(),
  condition: Joi.string().max(255).optional(),
  targetValue: Joi.number().integer().positive().optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0]?.message });
  }
  next();
};

export const validateCreateBadge = validate(createBadgeSchema);
export const validateUpdateBadge = validate(updateBadgeSchema);
