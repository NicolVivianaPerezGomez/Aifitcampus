import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Un ejercicio dentro de la rutina
const routineExerciseSchema = Joi.object({
  exerciseId: Joi.number().integer().positive().required(),
  orderIndex: Joi.number().integer().min(1).required(),
  sets: Joi.number().integer().min(1).optional(),
  reps: Joi.number().integer().min(1).optional(),
  restSeconds: Joi.number().integer().min(0).optional(),
});

const createRoutineSchema = Joi.object({
  name: Joi.string().trim().min(3).max(150).required(),
  description: Joi.string().max(2000).allow("").optional(),
  routineTypeId: Joi.number().integer().positive().required().messages({
    "any.required": "El tipo de rutina es obligatorio",
  }),
  exercises: Joi.array().items(routineExerciseSchema).min(1).required().messages({
    "array.min": "La rutina debe tener al menos un ejercicio",
    "any.required": "La rutina debe tener al menos un ejercicio",
  }),
});

const updateRoutineSchema = Joi.object({
  name: Joi.string().trim().min(3).max(150).optional(),
  description: Joi.string().max(2000).allow("").optional(),
  routineTypeId: Joi.number().integer().positive().optional(),
  exercises: Joi.array().items(routineExerciseSchema).min(1).optional().messages({
    "array.min": "La rutina debe tener al menos un ejercicio",
  }),
  isActive: Joi.boolean().optional(),
}).min(1);

const logExecutionSchema = Joi.object({
  durationSeconds: Joi.number().integer().min(0).required(),
});

const createRoutineTypeSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().max(2000).allow("").optional(),
});

const updateRoutineTypeSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).optional(),
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

export const validateCreateRoutine = validate(createRoutineSchema);
export const validateUpdateRoutine = validate(updateRoutineSchema);
export const validateLogExecution = validate(logExecutionSchema);
export const validateCreateRoutineType = validate(createRoutineTypeSchema);
export const validateUpdateRoutineType = validate(updateRoutineTypeSchema);
