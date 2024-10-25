import CryptoJS from 'crypto-js';
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

// Ruta para registrar un nuevo usuario
export const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    console.log("Datos antes de cifrar");
    console.log(req.body);
    
    // Cifrar la contraseña con SHA512
    const hashedPassword = CryptoJS.SHA512(password).toString();
    
    // Generar un ID único para el usuario
    const userId = uuidv4();

    // Leer el archivo JSON existente (o crearlo si no existe)
    const usersFilePath = './data/users.json';
    let users = [];
    
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(data); // Cargar la información de los usuarios
    }

    // Buscar el email del usuario en los registros
    const userExists = users.find(user => user.email === email);

    // Verificar si se encontró el email
    if (userExists) {
        // Enviar respuesta con código de conflicto
        return res.status(409).json({ message: 'Correo electrónico ya registrado, por favor ingresa otro.' });
    }

    // Crear un nuevo usuario
    const newUser = { id: userId, name, email, password: hashedPassword, lastConnection: null, token: null };
    console.log("Datos después de cifrar");
    console.log(newUser);

    // Agregar el nuevo usuario a la lista
    users.push(newUser);

    // Guardar la lista de usuarios en el archivo JSON
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

    res.status(201).json({ message: 'Usuario registrado con éxito', newUser });
};

// Ruta para iniciar sesión
export const loginUser = (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Processing login for email:', email);

        const hashedPassword = CryptoJS.SHA512(password).toString();
        const usersFilePath = './data/users.json';
        let users = [];

        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(data);
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.password !== hashedPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Actualizar la última conexión del usuario
        user.lastConnection = new Date().toISOString();

        // Escribir los datos actualizados en el archivo JSON
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

        // Login exitoso
        res.status(200).json({ message: 'Inicio de sesión exitoso', userId: user.id });
    } catch (error) {
        console.error('Error en /login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


