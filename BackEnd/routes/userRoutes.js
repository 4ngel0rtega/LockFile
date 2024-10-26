import express from 'express';
import { getUser } from '../controllers/userController.js';

const userRouter = express.Router();

// Ruta para obtener datos
userRouter.get("/getUser", getUser);

export default userRouter;