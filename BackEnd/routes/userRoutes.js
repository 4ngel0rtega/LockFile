import express from 'express';
import { getUser, updateUser } from '../controllers/userController.js';

const userRouter = express.Router();

// Ruta para obtener datos
userRouter.get("/getUser", getUser);

// Ruta para actualizar datos
userRouter.post("/updateUser", updateUser);

export default userRouter;