import express from "express";
import { register, login } from "../controller/auth.controller.js"
import { body } from "express-validator";

const router = express.Router();

router.post("/register", [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().isLength({ min: 2 })
], register);
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], login);

export default router;