import express from "express";
import { signup, login } from "../controllers/AuthController";
import { validateRequest } from "../middleware/validationMiddleware";
import { signupSchema } from "../validations/authValidations";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", login);

export default router;
