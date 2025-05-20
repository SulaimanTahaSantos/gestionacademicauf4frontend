"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfileDropdown } from "@/misComponents/user-profile-dropdown";

export default function Home() {
    const router = useRouter();

    const [userEmail, setUserEmail] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const email = sessionStorage.getItem("userEmail");
        const image = sessionStorage.getItem("userImage");
        const name = sessionStorage.getItem("userName");

        setUserEmail(email || "usuario@ejemplo.com");
        setUserImage(image || "");
        setUserName(name || "Usuario");
    }, []);

    const handleClassClick = () => {
        router.push("/clase");
    };

    const handleSettingsClick = () => {
        router.push("/configuracion");
    };

    const handleHomeClick = () => {
        router.push("/home");
    }
    const handleModulesClick = () => {
        router.push("/modulos");
    }

    const handleDeliveriesClick = () => {
        router.push("/entregas");
    }

    const handleGroupsClick = () => {
        router.push("/grupos");
    }
    const handleGradesClick = () => {
        router.push("/notas");
    }
    const handleRubricsClick = () => {
        router.push("/rubricas");
    }
    const handleStatementsClick = () => {
        router.push("/enunciados");
    }


    return (
        <main className="min-h-screen bg-gray-50">
            <section className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end items-center h-16">
                        <UserProfileDropdown
                            userEmail={userEmail}
                            userImage={userImage}
                            userName={userName}
                            handleSettingsClick={handleSettingsClick}
                            handleHomeClick={handleHomeClick}
                        />
                    </div>
                </div>
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 text-center">
                        Sistema de Gestión Académica
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 text-center">
                        Gestiona tus clases, módulos, entregas y más
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        onClick={handleClassClick}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Clases
                        </h2>
                        <p className="text-gray-600">
                            Gestiona tus clases y horarios
                        </p>
                    </div>

                    <div
                        onClick={handleModulesClick}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Módulos
                        </h2>
                        <p className="text-gray-600">
                            Accede a los contenidos de los módulos
                        </p>
                    </div>

                    <div
                        onClick={handleDeliveriesClick}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Entregas
                        </h2>
                        <p className="text-gray-600">
                            Gestiona tus entregas de proyectos
                        </p>
                    </div>

                    <div
                        onClick={handleGroupsClick}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Grupos
                        </h2>
                        <p className="text-gray-600">
                            Visualiza y gestiona tus grupos
                        </p>
                    </div>

                    <div
                        onClick={handleGradesClick}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Notas
                        </h2>
                        <p className="text-gray-600">
                            Consulta tus calificaciones
                        </p>
                    </div>

                    <div
                        onClick={handleRubricsClick}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Rúbricas
                        </h2>
                        <p className="text-gray-600">
                            Revisa los criterios de evaluación
                        </p>
                    </div>
                </div>

                <div
                    onClick={handleStatementsClick}
                    className="mt-12 bg-white rounded-lg shadow-md p-6"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Enunciados
                    </h2>
                    <p className="text-gray-600">
                        Accede a los enunciados de tus proyectos y actividades
                    </p>
                </div>
            </div>
        </main>
    );
}
