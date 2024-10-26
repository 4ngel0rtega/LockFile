import { FiEdit2, FiEye, FiEyeOff, FiMail, FiMapPin, FiPhone, FiUpload } from "react-icons/fi";
import Navbar from "../components/navbar";
import { BiHistory } from "react-icons/bi";
import { useEffect, useState } from "react";


function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [ userData, setUserData ] = useState([]);
    const [profileImage, setProfileImage] = useState("https://www.mundodeportivo.com/alfabeta/hero/2024/10/batman-bruce-wayne-robin-dc.jpg?width=768&aspect_ratio=16:9&format=nowebp");

    useEffect(() => {
        // Funcion para obtener los datos del usuario
        async function fetchUserData() {
            try {
                const response = await fetch('http://localhost:3001/user/getUser', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }

                const data = await response.json();
                setUserData(data.userData);
            } catch (error) {
                console.error("Error al obtener los datos del usuario.", error);
                alert("No se pudieron cargar los datos del usario")
            }
        }

        fetchUserData();
    }, []) 

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Navbar/>

            <main>
                <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Profile Header */}
                        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                            <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <img
                                // src={profileImage}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white object-cover"
                                />
                                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer">
                                <FiUpload className="w-5 h-5 text-gray-600" />
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>
                            </div>
                        </div>

                        <div className="mt-20 px-8 py-6">
                            {/* Profile Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                                <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <div className="mt-1 flex items-center">
                                    <input
                                        type="text"
                                        value={userData.name}
                                        disabled={!isEditing}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="ml-2 p-2 text-gray-600 hover:text-blue-500"
                                    >
                                        <FiEdit2 className="w-5 h-5" />
                                    </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                    <div className="mt-1">
                                    <input
                                        type="text"
                                        // value={dummyData.accountNumber}
                                        disabled
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                                    />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="mt-1 flex items-center">
                                        <FiMail className="absolute ml-3 text-gray-400" />
                                        <input
                                        type="email"
                                        value={userData.email}
                                        disabled={!isEditing}
                                        className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                    </div>

                                    <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <div className="mt-1 flex items-center">
                                        <FiPhone className="absolute ml-3 text-gray-400" />
                                        <input
                                        type="tel"
                                        // value={dummyData.phone}
                                        disabled={!isEditing}
                                        className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <div className="mt-1 flex items-center">
                                    <FiMapPin className="absolute ml-3 text-gray-400" />
                                    <input
                                        type="text"
                                        // value={dummyData.address}
                                        disabled={!isEditing}
                                        className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                    </div>
                                </div>
                                </div>
                            </div>

                            {/* Account Summary */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Summary</h2>
                                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Current Balance</span>
                                    {/* <span className="text-2xl font-bold text-green-600">{dummyData.balance}</span> */}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Account Type</span>
                                    {/* <span className="text-gray-900 font-medium">{dummyData.accountType}</span> */}
                                </div>
                                </div>

                            </div>
                            </div>

                            {/* Security Section */}
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Change Password</label>
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
                                            <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Login Activity</h3>
                                            <div className="space-y-4">
                                                {/* {dummyData.recentLogins.map((login, index) => (
                                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                                    <BiHistory className="w-6 h-6 text-gray-400" />
                                                    <div>
                                                    <p className="text-sm font-medium text-gray-900">{login.device}</p>
                                                    <p className="text-sm text-gray-500">{login.date} - {login.location}</p>
                                                    </div>
                                                </div>
                                                ))} */}
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
    )
}

export default Profile;