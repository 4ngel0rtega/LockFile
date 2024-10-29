import {
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUpload,
} from "react-icons/fi";
import { BiHistory } from "react-icons/bi";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { PiIdentificationBadge } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    curp: "",
    email: "",
    phone: "",
    address: "",
  });

  const [name, setName] = useState("");
  const [curp, setCurp] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  useEffect(() => {
    // Funcion para obtener los datos del usuario
    async function fetchUserData() {
      try {
        const response = await fetch("http://localhost:3001/user/getUser", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const data = await response.json();
        setUserData(data.userData);
        setName(data.userData.name);
        setCurp(data.userData.curp);
        setEmail(data.userData.email);
        setPhone(data.userData.phone);
        setAddress(data.userData.addres);
      } catch (error) {
        console.error("Error al obtener los datos del usuario.", error);
        alert("No se pudieron cargar los datos del usario");
      }
    }

      const hasSessionCookie = document.cookie.includes('sessionToken');

      if (hasSessionCookie) {
          fetchUserData();
      } else {
          navigate("/")
      }
  }, [navigate]);

  const validateName = (name) => {
    if (name.length <= 0) {
      setErrors((prev) => ({
        ...prev,
        name: "No puedes dejar el nombre vacío",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: "" }));
    return true;
  };

  const validateCurp = (curp) => {
    if (curp.length <= 0) {
      setErrors((prev) => ({
        ...prev,
        curp: "No puedes dejar el nombre vacío",
      }));
      return false;
    } else if (curp.length < 18) {
      setErrors((prev) => ({
        ...prev,
        curp: "La CURP tiene que tener 18 caracteres",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, curp: "" }));
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email:
          "El formato de la clave de cifrado (correo electrónico) no es válido",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePhone = (phone) => {
    if (phone.length <= 0) {
      setErrors((prev) => ({
        ...prev,
        phone: "No puedes dejar el teléfono vacío",
      }));
      return false;
    } else if (phone.length > 10) {
      setErrors((prev) => ({
        ...prev,
        phone: "El teléfono debe tener 10 dígitos",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: "" }));
    return true;
  };

  const validateAddress = (addres) => {
    if (addres.length <= 0) {
      setErrors((prev) => ({
        ...prev,
        address: "No puedes dejar la ubicación vacía",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, address: "" }));
    return true;
  };

  const handleSaveProfile = async () => {
    try {
      // Crear objeto con los datos del perfil
      const profileData = {
        name,
        curp,
        email,
        phone,
        address,
      };

      // Realizar la solicitud de actualización al backend
      const response = await fetch("http://localhost:3001/user/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // Mensaje de éxito
        window.location.reload(false);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error en la actualización del perfil:", error);
    }
  };

  // Function to format the last login time into a readable format.
  const formatDate = (ISOdate) => {
    // Create a Date object from the ISO string
    const date = new Date(ISOdate);

    // Extract date components
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so we add 1
    const day = String(date.getUTCDate()).padStart(2, "0");
    const year = date.getUTCFullYear();

    // Extract time components
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    // Format as MM/DD/YYYY HH:MM:SS
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:3001/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        const result = await response.json();
        if (response.ok) {
            console.log(result.message);

            navigate("/");
        } else {
            console.error('Error en el cierre de sesión: ', result.message)
        }
    } catch (error) {
        console.error('Error en el cierre de sesión', error);
         
        alert("Error al cerrar la sesión, intentalo de nuevo");
    }
}


  return (
    <>
      <Navbar />

      <main>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="absolute -bottom-16 left-8">
                  <div className="relative">
                    <img
                      src={userData.imageProfile}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white object-cover"
                    />
                    <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer">
                      <FiUpload className="w-5 h-5 text-gray-600" />
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-20 px-8 py-6">
                {/* Profile Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Información de perfil
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nombre
                        </label>
                        <div className="mt-1 flex items-center">
                          <input
                            type="text"
                            value={name}
                            disabled={!isEditing}
                            onChange={(e) => {
                              setName(e.target.value);
                              validateName(e.target.value);
                            }}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />

                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`ml-2 p-2 ${
                              !isEditing ? "text-gray-600" : "text-blue-500"
                            } ${
                              !isEditing
                                ? "hover:text-blue-500"
                                : "hover:text-blue-800"
                            } transition-colors duration-300`}
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                        </div>
                        {errors.name && isEditing && (
                          <p className="mt-1 text-sm text-red-500" role="alert">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CURP
                        </label>
                        <div className="mt-1 flex items-center">
                          <PiIdentificationBadge className="absolute ml-3 text-gray-400" />
                          <input
                            type="text"
                            value={curp}
                            maxLength={18}
                            onChange={(e) => {
                              setCurp(e.target.value);
                              validateCurp(e.target.value);
                            }}
                            disabled={!isEditing}
                            required
                            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        {errors.curp && isEditing && (
                          <p className="mt-1 text-sm text-red-500" role="alert">
                            {errors.curp}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Correo Electrónico
                          </label>
                          <div className="mt-1 flex items-center">
                            <FiMail className="absolute ml-3 text-gray-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                validateEmail(e.target.value);
                              }}
                              disabled={!isEditing}
                              required
                              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                          </div>
                          {errors.email && isEditing && (
                            <p
                              className="mt-1 text-sm text-red-500"
                              role="alert"
                            >
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Teléfono
                          </label>
                          <div className="mt-1 flex items-center">
                            <FiPhone className="absolute ml-3 text-gray-400" />
                            <input
                              type="tel"
                              maxLength={10}
                              value={phone}
                              onChange={(e) => {
                                setPhone(e.target.value);
                                validatePhone(e.target.value);
                              }}
                              disabled={!isEditing}
                              required
                              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                          </div>
                          {errors.phone && isEditing && (
                            <p
                              className="mt-1 text-sm text-red-500"
                              role="alert"
                            >
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Dirección
                        </label>
                        <div className="mt-1 flex items-center">
                          <FiMapPin className="absolute ml-3 text-gray-400" />
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              validateAddress(e.target.value);
                            }}
                            disabled={!isEditing}
                            required
                            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        {errors.address && isEditing && (
                          <p className="mt-1 text-sm text-red-500" role="alert">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {isEditing && (
                        <div>
                          <div className="mt-1">
                            <button
                              onClick={handleSaveProfile}
                              className="bg-blue-600 hover:bg-blue-800 p-2 text-white rounded-md font-medium flex item-center justify-center gap-2"
                            >
                              <FaRegEdit />
                              Guardar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Summary */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Resumen de cuenta
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Saldo actual</span>
                        <span className="text-2xl font-bold text-green-600">
                          {userData.balance}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tipo de cuenta</span>
                        <span className="text-gray-900 font-medium">
                          {userData.accountType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Configuración de seguridad
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Cambiar la contraseña
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FiEyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <FiEye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Autenticación de dos factores
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Actividad de inicio de sesión reciente
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between space-x-4 p-4 bg-gray-50 rounded-lg">
                           <div className="flex items-center space-x-4">
                              <BiHistory className="w-6 h-6 text-gray-400" />
                              <div>
                                  <p className="text-sm font-medium text-gray-900">Edge</p>
                                  <p className="text-sm text-gray-500">{formatDate(userData.lastConnection)}</p>
                              </div>
                          </div>
                          <button onClick={handleLogout} className="bg-red-500 p-2 rounded-md text-white font-medium hover:bg-red-600 transition-colors duration-300">
                              Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;
