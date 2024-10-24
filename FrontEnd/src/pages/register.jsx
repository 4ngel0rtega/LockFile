import { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [errors, setErrors] = useState({ name: "", email: "", password: "", repeatPassword: "" });

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
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (name.length <= 0 || email.length <= 0 || password.length <= 0 || repeatPassword.length <= 0) {
            alert("No puede dejar campos vacios")
            return
        }

        try {
            // Realizar la solicitud POST al backend
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password})
            });

            const data = await response.json();

            if (response.ok) {
                alert("Usuario registardo con éxito");
            } else {
                alert(data.message || 'Error al registrar al usuario')
            }
        } catch (error) {
            console.error('Error', error);
            alert("Error al registrar el usuario");
        }
    };

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

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                </div>
            </div>
        </div>
    )
}

export default Register;