import express from 'express';
import cors from 'cors';
import CryptoJS from 'crypto-js';
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;


// Middleware para permitir JSON
app.use(express.json());
app.use(cors());

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
    const { name, email, password } = req.body;


    console.log("Datos antes de cifrar")
    console.log(req.body)
    // Cifrar la contraseña con SHA512
    const hashedPassword = CryptoJS.SHA512(password).toString();
    
    // Generar un ID único para el usuario
    const userId = uuidv4();

    // Leer el archivo JSON existente (o crearlo si no existe)
    const usersFilePath = './users.json'
    let users = [];
    

    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(data); // Cargar la información de los usuarios
    }

    // Buscar el email del usuario en los registros
    const userExists = users.find(user => user.email === email);

    // Verificar si se encontro el email
    if (userExists) {
        res.json({message: 'Correo electrónico registrado, por favor ingresa otro'})
        return;
    } else {
        // Crear un nuevo usuario
        const newUser = { id: userId, name, email, password: hashedPassword}
        console.log("Datos despues de cifrar")
        console.log(newUser)
        // Agregar el nuevo usuario a la lista
        users.push(newUser);

        // Guardar la lista de usuarios en el archivo JSON
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

        res.json({ message: 'Usuario registrado con éxito', newUser})
    }
    
})

// Ruta para el inicio de sesión y comparar el cifrado
app.post('/login', (req, res) => {
    const {email, password} = req.body

    // Cifrar la contraseña proporcionada para comparar
    const hashedPassword = CryptoJS.SHA512(password).toString();

    // Leer el archivo JSON para buscar usuarios
    const usersFilePath = './users.json';
    let users = [];

    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(data); // Cargar la información de los usuarios
    }

    // Buscar al usuario por su correo electronico
    const user = users.find(u => u.email === email);

    if(!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if ( user.password !== hashedPassword ) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
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

