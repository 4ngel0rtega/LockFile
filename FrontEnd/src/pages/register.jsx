import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaDoorOpen, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [errors, setErrors] = useState({ name: "", email: "", phone: "", password: "", repeatPassword: "" });

    const [ showModal, setShowModal ] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);
    

    const validateName = (name) => {
        if (name.length <= 0) {
            setErrors((prev) => ({
                ...prev,
                name: "El nombre no puede estar vacio"
            }));
            return false;
        }
        setErrors((prev) => ({ ...prev, name: "" }));
        return true;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors((prev) => ({
                ...prev,
                email: "El formato de la clave de cifrado (correo electrónico) no es válido"
            }));
            return false;
        }
        setErrors((prev) => ({ ...prev, email: "" }));
        return true;
    };

    const validatePhone = (phone) => {
        if (phone.length < 10) {
            setErrors((prev) => ({
                ...prev,
                phone: "El formato del teléfono debe tener 10 dígitos"
            }))
            return false;
        }
        setErrors((prev) => ({...prev, phone: ""}))
        return true;
    }

    const validatePassword = (password) => {
        let errors = [];
    
        if (password.length <= 0) {
            setErrors((prev) => ({
                ...prev,
                password: "La contraseña no puede estar vacía"
            }));
            return false;
        }
    
        if (password.length < 8) {
            errors.push("Debe tener al menos 8 caracteres");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Debe contener al menos una letra mayúscula");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Debe contener al menos una letra minúscula");
        }
        if (!/\d/.test(password)) {
            errors.push("Debe contener al menos un número");
        }
        if (!/[@$!%*?&#_]/.test(password)) {
            errors.push("Debe contener al menos un carácter especial (@$!%*?&#)");
        }
    
        if (errors.length > 0) {
            setErrors((prev) => ({
                ...prev,
                password: `La contraseña no cumple con los siguientes requisitos: ${errors.join(", ")}`
            }));
            return false;
        }
    
        setErrors((prev) => ({ ...prev, password: "" }));
        return true;
    };  

    const validateRepeatPassword = (repeatPassword) => {
        if (repeatPassword.length <= 0) {
            setErrors((prev) => ({
                ...prev,
                repeatPassword: "La conformación del contraseña no puede estar vacia"
            }));
            return false;
        }
        
        if (repeatPassword !== password) {
            setErrors((prev) => ({
                ...prev,
                repeatPassword: "La confirmación no coincide con la contraseña"
            }))
            return false;
        }
        setErrors((prev) => ({ ...prev, repeatPassword: "" }));
        return true;
    };
    
    const handleRegister = async (event) => {
        event.preventDefault();

        if (!validateEmail(email) || !validateName(name) || !validatePassword(password) || !validatePhone(phone) || !validateRepeatPassword(repeatPassword)) {
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                phone: phone,
                email: email,
                curp: "",
                address: "",
            })

            navigate("/");
        } catch (error) {
            console.error("Error al registrar al usuario: ", error);
        }
    }
    
    const handleGoogleSingIn = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName || user.email,
                    phone: "",
                    email: user.email,
                    curp: "",
                    address: "",
                });
            }
        } catch (error) {
            console.error("Error al iniciar sesión con Google: ", error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl transform hover:scale-[1.0] transition-transform duration-300">
                <div>
                    <Link to={"/"} className="flex items-center">
                        <FaArrowLeft size={20} color="white"/>
                        <span className="ml-2 text-white">Regresar</span>
                    </Link>
                </div>
                
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <FaLock className="h-8 w-8 text-white"/>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-green-400">Portal de encriptación seguro</h2>
                    <p className="mt-2 text-sm text-gray-400">Ingrese sus credenciales para encriptarlas</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                    <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300" aria-label="Nombre de Usuario">
                                Nombre de Usuario
                            </label>
                            <div className="mt-1">
                                <input type="text" name="name" id="name" required 
                                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-500"} bg-gray-700 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                                    placeholder="Ingrese su nombre"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        validateName(e.target.value);
                                    }}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300" aria-label="Correo Electrónico">
                                Clave de cifrado (correo electrónico)
                            </label>
                            <div className="mt-1">
                                <input type="email" name="email" id="email" autoComplete="email" required 
                                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-500"} bg-gray-700 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                                    placeholder="Ingrese su correo electrónico"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        validateEmail(e.target.value);
                                    }}
                                    list="Sugerencias de Correo Electrónico"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300" aria-label="Teléfono">
                                Teléfono
                            </label>
                            <div className="mt-1">
                                <input type="tel" name="phone" id="phone" autoComplete="phone" required 
                                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.phone ? "border-red-500" : "border-gray-500"} bg-gray-700 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                                    placeholder="Ingrese su correo electrónico"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        validatePhone(e.target.value);
                                    }}
                                   
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <input type={showPassword ? "text" : "password"} name="password" id="password" autoComplete="current-password" required 
                                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-600"} bg-gray-700 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
                                >   
                                    {showPassword ? <FaEyeSlash /> : <FaEye/>}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-300">
                                Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <input type={showRepeatPassword ? "text" : "password"} name="repeatPassword" id="repetPassword" autoComplete="current-password" required 
                                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.repeatPassword ? "border-red-500" : "border-gray-600"} bg-gray-700 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                                    placeholder="Confirma tu contraseña"
                                    value={repeatPassword}
                                    onChange={(e) => {
                                        setRepeatPassword(e.target.value);
                                        validateRepeatPassword(e.target.value);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                    aria-label={showRepeatPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
                                >   
                                    {showRepeatPassword ? <FaEyeSlash /> : <FaEye/>}
                                </button>
                            </div>
                            {errors.repeatPassword && (
                                <p className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.repeatPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-[1.02]">
                            Iniciar protocolo de encriptación
                        </button>
                    </div>
                </form>

                <div className="text-center text-white">
                    <p>Ya tienes cuenta? <Link to={"/login"} className="font-medium text-blue-400">Inicia Sesión</Link> </p>
                
                    <p>o</p>

                    <div className="mt-2">
                        <button onClick={() => handleGoogleSingIn()} className="bg-white p-1 rounded-sm">
                            <FcGoogle size={28}/>
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="bg-black bg-opacity-50 w-full h-screen absolute flex justify-center items-center z-50">
                    <div className="md:w-1/4 w-3/4 p-4 flex flex-col gap-5 bg-white rounded-lg z-50">
                        <div>
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-blue-700">Usuario Encriptado con Éxito</h1>
                                <IoCloseOutline size={28} onClick={() => setShowModal(!showModal)}/>
                            </div>
                            <p className="mt-5 text-lg"><span className="font-bold">¡Felicidades🥳!</span> Tu cuenta ha sido registrada y encriptada con éxito. Ahora puedes iniciar sesión de forma segura.</p>
                        </div>

                        <div>
                            <Link to={"/login"} className="bg-blue-600 p-2 flex items-center justify-center gap-2 text-white rounded-lg text-lg">
                                <FaDoorOpen/>Iniciar sesión
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Register;