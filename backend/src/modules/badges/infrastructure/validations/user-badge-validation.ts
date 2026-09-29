import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const assignSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  badgeId: Joi.number().integer().positive().required(),
  progress: Joi.number().min(0).max(100).optional(),
});

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0]?.message });
  }
  next();
};

export const validateAssignBadge = validate(assignSchema);
