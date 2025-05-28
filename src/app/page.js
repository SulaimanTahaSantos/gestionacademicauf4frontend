"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    LucideEye,
    LucideEyeOff,
    LucideLogIn,
    LucideUser,
    LucideLock,
    LucideMail,
} from "lucide-react";
import { usuarios } from "@/users/arrayUsers"; 

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const response = await fetch(
          "https://gestionacademicauf4backend-production.up.railway.app/api/inicioSesion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();
        console.log("datos", data);
        console.log(response);
        console.log(data.token);

        if (!response.ok) {
          throw new Error(data.message || "Email o contraseña incorrectos");
        }

        localStorage.setItem("token", data.token);

        try {
          const userResponse = await fetch(
            "https://gestionacademicauf4backend-production.up.railway.app/api/me",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },
            }
          );

          if (!userResponse.ok) {
            throw new Error("Error al obtener datos del usuario");
          }

          const userData = await userResponse.json();
          console.log("dataUser", userData);

          localStorage.setItem("userData", JSON.stringify(userData));

          router.push("/home");
        } catch (userError) {
          console.error("Error al obtener datos del usuario:", userError);
          router.push("/home");
        }
      } catch (err) {
        alert(err.message);
      }
    };
    


    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white opacity-20"></div>
                    <div className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-white opacity-10"></div>
                    <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-white opacity-10"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold mb-4">
                            Bienvenido de nuevo
                        </h1>
                        <p className="text-xl opacity-90">
                            Accede a tu cuenta para continuar con tu experiencia
                            personalizada.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="mt-12"
                    >
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <LucideUser className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    Interfaz intuitiva
                                </p>
                                <p className="opacity-80 text-sm">
                                    Diseñada para una experiencia fluida
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <LucideLock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    Seguridad avanzada
                                </p>
                                <p className="opacity-80 text-sm">
                                    Tus datos siempre protegidos
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                            <LucideLogIn className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Iniciar sesión
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Ingresa tus credenciales para acceder
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <Label
                                htmlFor="email"
                                className="text-gray-700 font-medium"
                            >
                                Correo electrónico
                            </Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <LucideMail className="w-5 h-5" />
                                </div>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nombre@ejemplo.com"
                                    className="pl-10 py-6 bg-white border-gray-200"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-gray-700 font-medium"
                                >
                                    Contraseña
                                </Label>
                                <a
                                    href="#"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <LucideLock className="w-5 h-5" />
                                </div>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="pl-10 py-6 bg-white border-gray-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <LucideEyeOff className="w-5 h-5" />
                                    ) : (
                                        <LucideEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox id="remember" />
                            <Label
                                htmlFor="remember"
                                className="text-gray-600 text-sm"
                            >
                                Recordar mi sesión en este dispositivo
                            </Label>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <Button
                                type="submit"
                                className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-all duration-200 hover:shadow-lg"
                            >
                                Iniciar sesión
                            </Button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-gray-600">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                href="/register"
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Regístrate ahora
                            </Link>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mt-8"
                    >
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-600">
                                o continúa con
                            </span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="py-6 bg-white hover:bg-gray-50"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="py-6 bg-white hover:bg-gray-50"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                                Facebook
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
