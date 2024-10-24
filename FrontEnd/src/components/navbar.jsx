import { useState } from "react";
import { Link } from "react-router-dom"
import { FiUser } from "react-icons/fi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className="sticky top-0 z-50 bg-slate-950 shadow-lg transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-white cursor-pointer hover:text-gray-300 transition-colors duration-300">
                            LockFile
                        </h1>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded={isMenuOpen}
                            aria-label="Boton del menu"
                        >
                            {isMenuOpen ? <FaTimes size={24}/> : <FaBars size={24}/>}
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <div className="flex space-x-8">
                            <a  href="/" 
                                className="text-white hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none foucs:ring-2 focus:ring-indigo-500"
                                aria-label="Inicio"
                            >
                                Inicio
                            </a>
                            <a href="/Upload"
                                className="text-white hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none foucs:ring-2 focus:ring-indigo-500"
                                aria-label="Subir archivo"
                            >
                                Subir Archivo
                            </a>
                            <a href="/Download"
                                className="text-white hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none foucs:ring-2 focus:ring-indigo-500"
                                aria-label="Descargar archivo"
                            >
                                Descargar Archivo
                            </a>
                        </div>

                        <div className="flex items-center">
                            {isLoggedIn ? (
                                <button
                                    // onClick={}
                                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    aria-label="Cerrar Sesión"
                                >
                                    <RiLogoutBoxLine size={20}/>
                                    <span>Cerrar Sesión</span>
                                </button>
                            ) : (
                                <Link
                                    to={"/login"}
                                    className="flex items-center space-x-2 bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    aria-label="Iniciar Sesión"
                                >
                                    <FiUser size={20}/>
                                    <span>Iniciar Sesión</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a  href="/" 
                                className="text-white hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none foucs:ring-2 focus:ring-indigo-500"
                                aria-label="Inicio"
                            >
                                Inicio
                            </a>
                            <a href="/Upload"
                                className="text-white hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none foucs:ring-2 focus:ring-indigo-500"
                                aria-label="Subir archivo"
                            >
                                Subir Archivo
                            </a>
                            <a href="/Download"
                                className="text-white hover:text-gray-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none foucs:ring-2 focus:ring-indigo-500"
                                aria-label="Descargar archivo"
                            >
                                Descargar Archivo
                            </a>

                            <div className="mt-4">
                                {isLoggedIn ? (
                                    <button
                                        // onClick={}
                                        className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        aria-label="Cerrar Sesión"
                                    >
                                        <RiLogoutBoxLine size={20}/>
                                    </button>
                                ) : (
                                    <Link
                                        to={"/"}
                                        className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        aria-label="Iniciar Sesión"
                                    >
                                        <FiUser size={20}/>
                                        <span>Iniciar Sesión</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;