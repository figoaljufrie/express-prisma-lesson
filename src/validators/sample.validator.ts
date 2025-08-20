import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/api-error";

export const validateCreateSample = [
  body("name").notEmpty().withMessage("Name is Required").isString(),
  // body("email").notEmpty().withMessage("Email is Required").isString,
  // body("Password").notEmpty().withMessage("Password is Required").isString,

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      throw new ApiError(errors.array()[0].msg, 400)
    }
    next();
  }
]

export const validateSendEmail = [
  body("email").notEmpty().withMessage("Email is Required").isEmail(),
  // body("email").notEmpty().withMessage("Email is Required").isString,
  // body("Password").notEmpty().withMessage("Password is Required").isString,

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      throw new ApiError(errors.array()[0].msg, 400)
    }
    next();
  }
]