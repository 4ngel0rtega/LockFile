import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { FaLock, FaUserPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function Home() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    console.log("Sin documentos");
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);
    
    return (
        <>
            <Navbar/>

            <main>
                <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden">
                    <div className="absolute inset-0 bg-opacity-50 bg-black z-0">
                        <img src="https://www.itdo.com/blog/content/images/size/w1200/2022/03/itdo-blog-que-es-la-criptografia.jpg" alt="Fondo de criptografia" className="w-full h-full object-cover opacity-30"/>
                    </div>
                    <div className="relative z-10 text-center p-8 max-w-4xl">
                            { userData ? (
                                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-down">
                                    <span className="text-green-400">{userData.name}</span> descubre los secretos de la criptografía
                                </h1>
                            ) : (
                                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-down">
                                    Descubra los secretos de la criptografía
                                </h1>
                            )}

                        <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up">
                            Embárcate en un viaje para descubrir el fascinante mundo del cifrado y la comunicación segura en nuestro proyecto escolar.
                        </p>
                        { !user && (
                            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <Link to={"/login"} className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <FaLock className="mr-2"/>
                                    Iniciar Sesión
                                </Link>
                                <Link to={"/register"} className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    <FaUserPlus className="mr-2"/>
                                    Registro
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home;