import CryptoJS from 'crypto-js';
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import forge from "node-forge";
import cookie from "cookie"

// Generar Claves RSA
function generateKeyPair() {
    const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    return {
        privateKey: forge.pki.privateKeyToPem(privateKey),
        publicKey: forge.pki.publicKeyToPem(publicKey),
    };
}

// Función para cifrar con 3DES
function encrypt3DES(text, key) {
    const encrypted = CryptoJS.TripleDES.encrypt(text, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

// Función para descifrar con 3DES
function decrypt3DES(encryptedText, key) {
    const decrypted = CryptoJS.TripleDES.decrypt(encryptedText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}


// Ruta para registrar un nuevo usuario
export const registerUser = (req, res) => {
    const { name, email, phone, password } = req.body;

    console.log("Datos antes de cifrar");
    console.log(req.body);
    
    // Cifrar la contraseña con SHA512
    const hashedPassword = CryptoJS.SHA512(password).toString();
    
    // Generar un ID único para el usuario
    const userId = uuidv4();

    // Generar par de claves RSA (pública y privada)
    const { privateKey, publicKey } = generateKeyPair();

    // Generar clave secreta para 3DES
    const desKey = CryptoJS.enc.Utf8.parse("miClaveSecretaPara3DES");

    // Cifrar datos sensibles con 3DES
    const encryptedName = encrypt3DES(name, desKey);
    const encryptedEmail = encrypt3DES(email, desKey);
    const encryptedPhone = encrypt3DES(phone, desKey);
    const encryptedBalance = encrypt3DES("51,324.58", desKey);
    const encryptedAccountType = encrypt3DES("Usuario Normal", desKey);

    // Leer el archivo JSON existente (o crearlo si no existe)
    const usersFilePath = './data/users.json';
    let users = [];
    
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(data); // Cargar la información de los usuarios
    }

    // Buscar el email del usuario en los registros
    const userExists = users.find(user => decrypt3DES(user.email, desKey) === email);

    // Verificar si se encontró el email
    if (userExists) {
        // Enviar respuesta con código de conflicto
        return res.status(409).json({ message: 'Correo electrónico ya registrado, por favor ingresa otro.' });
    }

    // Crear un nuevo usuario
    const newUser = {
        id: userId,
        imageProfile: "https://images.freeimages.com/365/images/previews/85b/psd-universal-blue-web-user-icon-53242.jpg",
        name: encryptedName,
        email: encryptedEmail,
        password: hashedPassword,
        curp: null,
        phone: encryptedPhone,
        addres: null,
        lastConnection: null,
        balance: encryptedBalance,
        accountType: encryptedAccountType,
        publicKey,
    };
    
    // Guardar la clave privada en un archivo separado para propósitos de prueba
    fs.writeFileSync(`./data/privateKey.json`, JSON.stringify({ userId, privateKey }), 'utf-8');


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

        
        const desKey = CryptoJS.enc.Utf8.parse("miClaveSecretaPara3DES")
        
        const user = users.find(u => decrypt3DES(u.email, desKey) === email);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.password !== hashedPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Actualizar la última conexión del usuario
        user.lastConnection = new Date().toISOString();

        // Crear el token de sesión
        const sessionToken = JSON.stringify({ userId: user.id, timestamp: Date.now() });

        // Cargar la clave pública del usuario para cifrar el token de sesión
        const publicKey = forge.pki.publicKeyFromPem(user.publicKey);
        const encryptedToken = forge.util.encode64(publicKey.encrypt(sessionToken));

        // Establecer cookie segura con el token
        res.setHeader('Set-Cookie', cookie.serialize('sessionToken', encryptedToken, {
            httpOnly: false, // Cambia a false si necesitas acceder a la cookie desde JavaScript
            secure: false, // Asegúrate de usar 'true' solo en producción
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // Expiración de 1 día
            path: '/', // Hacer que la cookie esté disponible en toda la aplicación
        }));
        // Escribir los datos actualizados en el archivo JSON
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
        
        // Login exitoso
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: encryptedToken });
    } catch (error) {
        console.error('Error en /login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


export const logoutUser = (req, res) => {
    res.setHeader('Set-Cookie', cookie.serialize('sessionToken', '', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    }));
    res.status(200).json({ message: 'Sesión cerrada correctamente'})
}

