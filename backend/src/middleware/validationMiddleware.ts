import { Request, Response, NextFunction } from "express";
import { Schema } from "yup";

export const validateRequest = (schema: Schema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = error.inner.map((err: any) => ({
          field: err.path,
          message: err.message,
        }));

        res.status(400).json({
          error: "Validation failed",
          details: errors,
        });
        return;
      }

      res.status(500).json({
        error: "Internal server error during validation",
      });
      return;
    }
  };
};
