import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const authRouter = express.Router();

// Ruta para registro
authRouter.post('/register', registerUser);

// Ruta para inicio de sesión
authRouter.post('/login', loginUser);

// Ruta para cerrar la sesión
authRouter.post("/logout", logoutUser);

export default authRouter;