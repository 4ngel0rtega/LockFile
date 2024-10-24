import express from 'express';
import CryptoJS from 'crypto-js';
import fs from "fs";
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware para permitir JSON
app.use(express.json());

// Ruta inicial para probar el servidor
app.get('/', (req, res) => {
    res.send('Servidor Funcionando');
})

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

// SHA512

// Ruta para cifrar contraseña e información sensible
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Cifrar la contraseña con SHA512
    const hashedPassword = CryptoJS.SHA512(password).toString();

    // Aqui guardamos el usuario y la contraseña cifrada en el JSON
})


// 3DES

// Ruta para cifrar un archivo usando 3DES
app.post('/encrypt-file', (req, res) => {
    const { fileContent, secretKey } = req.body;

    // Cifrar el contenido del archivo con 3DES
    const encryptedFile = CryptoJS.TripleDES.encrypt(fileContent, secretKey).toString();

    res.json({ encryptedFile });
})

// Ruta para descifrar un archivo usando 3DES
app.post('/decrypt-file', (req, res) => {
    const { encryptedFile, secretKey } = req.body;

    // Descifrar el archivo usando 3DES
    const decryptedFile = CryptoJS.TripleDES.decrypt(encryptedFile, secretKey).toString(CryptoJS.enc.Utf8);

    res.json({ decryptedFile })
})

