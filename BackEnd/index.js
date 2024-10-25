import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

const app = express();
const PORT = 3001;


// Middleware para permitir JSON
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto 3001`)
})



