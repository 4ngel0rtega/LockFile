import CryptoJS from 'crypto-js';
import fs from "fs";
import forge from "node-forge";


// Método para desencriptar con 3DES
function decrypt3DES(encryptedText, key) {
    const decrypted = CryptoJS.TripleDES.decrypt(encryptedText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// Función para cifrar con 3DES
function encrypt3DES(text, key) {
    const encrypted = CryptoJS.TripleDES.encrypt(text, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

// Ruta para obtener los datos del usuario
export const getUser = (req, res) => {

    console.log("Cookies recibidas:", req.cookies); // Verificar cookies aquí
    const sessionToken = req.cookies.sessionToken;

    if (!sessionToken) {
        return res.status(401).json({ message: "Usuario no autenticado" });
    }

    try {

        const encryptedToken = req.cookies.sessionToken;

        // Cargar la clave privada del servidor para descifrar el token de sesión
        const privateKey = fs.readFileSync('./data/privateKey.json', 'utf-8');
        const { userId, privateKey: pemPrivateKey } = JSON.parse(privateKey);
        
        // Desencriptar el token
        const privateKeyObject = forge.pki.privateKeyFromPem(pemPrivateKey);
        const decodedToken = forge.util.decode64(encryptedToken);

        // Descifrar el token de sesion para obtener el userId
        const decryptedToken = privateKeyObject.decrypt(decodedToken);
        const { userId: decryptedUserId } = JSON.parse(decryptedToken);

        console.log("Token desencriptado correctamente:", decryptedToken);

        // Leer el archivo JSON de usuarios
        const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
        const user = users.find(user => user.id === decryptedUserId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Desencriptar solo si el campo tiene un valor; si no, asignar una cadena vacía o valor por defecto
        const desKey = CryptoJS.enc.Utf8.parse("miClaveSecretaPara3DES");
        const decryptedName = user.name ? decrypt3DES(user.name, desKey) : "Nombre no disponible";
        const decryptedEmail = user.email ? decrypt3DES(user.email, desKey) : "Correo no disponible";
        const decryptedCurp = user.curp ? decrypt3DES(user.curp, desKey) : "";
        const decryptedPhone = user.phone ? decrypt3DES(user.phone, desKey) : "";
        const decryptedAdres = user.addres ? decrypt3DES(user.addres, desKey) : "";
        const decryptedBalance = user.balance ? decrypt3DES(user.balance, desKey) : "";
        const decryptedAccountType = user.accountType ? decrypt3DES(user.accountType, desKey) : "";

        // Devolver los datos desencriptados al frontend
        res.status(200).json({
            userData: {
                imageProfile: user.imageProfile || "https://images.freeimages.com/365/images/previews/85b/psd-universal-blue-web-user-icon-53242.jpg",
                name: decryptedName,
                email: decryptedEmail,
                curp: decryptedCurp,
                phone: decryptedPhone,
                addres: decryptedAdres,
                lastConnection: user.lastConnection || "",
                balance: decryptedBalance,
                accountType: decryptedAccountType,
            },
        });
    } catch (error) {
        console.error("Error en obtener datos", error);
        res.status(500).json({ message: "Error interno del servidor "});
    }
}

export const updateUser = (req, res) => {
    const { name, curp, email, phone, address } = req.body;


    console.log("Cookies recibidas:", req.cookies); // Verificar cookies aquí
    const sessionToken = req.cookies.sessionToken;

    if (!sessionToken) {
        return res.status(401).json({ message: "Usuario no autenticado" });
    }

    try {
        const encryptedToken = req.cookies.sessionToken;

        // Cargar la clave privada del servidor para descifrar el token de sesión
        const privateKey = fs.readFileSync('./data/privateKey.json', 'utf-8');
        const { userId, privateKey: pemPrivateKey } = JSON.parse(privateKey);
        
        // Desencriptar el token
        const privateKeyObject = forge.pki.privateKeyFromPem(pemPrivateKey);
        const decodedToken = forge.util.decode64(encryptedToken);

        // Descifrar el token de sesion para obtener el userId
        const decryptedToken = privateKeyObject.decrypt(decodedToken);
        const { userId: decryptedUserId } = JSON.parse(decryptedToken);

        console.log("Token desencriptado correctamente:", decryptedToken);

         // Leer el archivo JSON de usuarios
         const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
         const user = users.find(user => user.id === decryptedUserId);
 
         if (!user) {
             return res.status(404).json({ message: "Usuario no encontrado" });
         }

        // Clave de encriptación 3DES
        const desKey = CryptoJS.enc.Utf8.parse("miClaveSecretaPara3DES");

        // Encriptar los datos opcionales si se proporcionan
        if (name) user.name = encrypt3DES(name, desKey);
        if (email) user.email = encrypt3DES(email,desKey);
        if (curp) user.curp = encrypt3DES(curp, desKey);
        if (phone) user.phone = encrypt3DES(phone, desKey);
        if (address) user.addres = encrypt3DES(address, desKey);
        
        // Guardar los cambios en users.json
        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
        res.status(200).json({ message: "Perfil de usuario actualizado exitosamente." });
    } catch (error) {
        console.error("Error en guardar datos", error);
        res.status(500).json({ message: "Error interno del servidor "});
    }
}