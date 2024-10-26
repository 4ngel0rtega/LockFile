import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3001;

// Configurar CORS para aceptar credenciales
app.use(cors({
    origin: 'http://localhost:5173', // Cambia esto por el origen de tu frontend
    credentials: true // Permitir envío de cookies y credenciales
}));

app.use(cookieParser());

// Middleware para permitir JSON
app.use(express.json());

app.use('/auth', authRouter);

app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
