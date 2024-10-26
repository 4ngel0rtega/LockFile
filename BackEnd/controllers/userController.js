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

        // Desencriptar los datos del usuario cifrados con 3DES
        const desKey = CryptoJS.enc.Utf8.parse("miClaveSecretaPara3DES");
        const decryptedName = decrypt3DES(user.name, desKey);
        const decryptedEmail = decrypt3DES(user.email, desKey);


        // Devolver los datos desencriptados al frontend
        res.status(200).json({
            userData: {
                name: decryptedName,
                email: decryptedEmail,
                lastConnection: user.lastConnection,
            },
        });
    } catch (error) {
        console.error("Error en obtener datos", error);
        res.status(500).json({ message: "Error interno del servidor "});
    }
}