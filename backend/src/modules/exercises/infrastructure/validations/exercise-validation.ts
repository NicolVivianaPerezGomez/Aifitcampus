import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// resourceUrl: enlace del video (http/https)
const videoUrl = Joi.string().uri({ scheme: ["http", "https"] }).max(2000).messages({
  "string.uri": "resourceUrl debe ser un enlace válido (http o https) al video",
  "string.uriCustomScheme": "resourceUrl debe ser un enlace válido (http o https) al video",
});

const createExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(150).required(),
  description: Joi.string().max(2000).allow("").optional(),
  durationSeconds: Joi.number().integer().positive().optional(),
  resourceUrl: videoUrl.required(),
  categoryId: Joi.number().integer().positive().required(),
});

const updateExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(150).optional(),
  description: Joi.string().max(2000).allow("").optional(),
  durationSeconds: Joi.number().integer().positive().optional(),
  resourceUrl: videoUrl.optional(),
  categoryId: Joi.number().integer().positive().optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(2000).allow("").optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(2000).allow("").optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0]?.message });
  }
  next();
};

export const validateCreateExercise = validate(createExerciseSchema);
export const validateUpdateExercise = validate(updateExerciseSchema);
export const validateCreateExerciseCategory = validate(createCategorySchema);
export const validateUpdateExerciseCategory = validate(updateCategorySchema);
