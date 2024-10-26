import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const authRouter = express.Router();

// Ruta para registro
authRouter.post('/register', registerUser);

// Ruta para inicio de sesión
authRouter.post('/login', loginUser);

export default authRouter;