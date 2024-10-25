import { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaUnlock } from "react-icons/fa";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "", loginError: "" });

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
        if (password.length <= 0) {
            setErrors((prev) => ({
                ...prev,
                password: "La contraseña no puede estar vacia"
            }));
            return false;
        }
        setErrors((prev) => ({ ...prev, password: "" }));
        return true;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Permitir cookies en la solicitud
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
            console.log('Response received:', data);
    
            if (response.ok) {
                alert('Inicio de sesión exitoso');
                setErrors((prev) => ({ ...prev, loginError: "" }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    loginError: "Contraseña o correo electrónico incorrectos"
                }));
            }
        } catch (error) {
            console.error('Error en el login:', error);
            alert('Error al iniciar sesión');
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
                    <div className="mx-auto h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <FaUnlock className="h-8 w-8 text-white"/>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-blue-400">Portal de acceso seguro</h2>
                    <p className="mt-2 text-sm text-gray-400">Ingrese sus credenciales para descifrar</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
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
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02]">
                            Iniciar protocolo de descifrado
                        </button>
                        {errors.loginError && (
                                <p className="mt-1 text-sm text-red-500" role="alert">
                                    {errors.loginError}
                                </p>
                        )}
                    </div>
                </form>

                <div className="text-center text-white">
                    <p>¿No tienes cuenta? <Link to={"/register"} className="font-medium text-green-400">Regístrate</Link> </p>
                </div>
            </div>
        </div>
    )
}

export default Login;