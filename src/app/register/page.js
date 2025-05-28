"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    LucideEye,
    LucideEyeOff,
    LucideUserPlus,
    LucideUser,
    LucideLock,
    LucideMail,
    LucideUsers,
    CreditCardIcon as LucideIdCard,
} from "lucide-react";

export default function Registro() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        rol: "user",
        dni: "",
        url: "", 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleRolChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            rol: value,
        }));
        setError(null);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSuccess(false);

      try {
        // Mostrar los datos que se van a enviar
        console.log('Datos del formulario:', formData);
        console.log('JSON a enviar:', JSON.stringify(formData, null, 2));

        const response = await fetch(
          "https://gestionacademicauf4backend-production.up.railway.app/api/registro",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al registrar");
        }

        setSuccess(true);
        console.log("Usuario registrado exitosamente");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (err) {
        setError(err.message);
      }
    };
    const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.includes("image/")) {
          setError("Por favor, sube solo archivos de imagen");
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          setError("La imagen no debe superar los 2MB");
          return;
        }

        try {
          setError(null);
          setFormData(prev => ({...prev, url: "uploading"}));
          
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "gestionacademica");
          formData.append("api_key", "196387385376185"); 
          
          const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dygty77hz/image/upload";          
          const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
          });
          
          const data = await response.json();
          
          if (!response.ok || !data || data.error) {
            console.error("Error de Cloudinary:", data);
            throw new Error(data?.error?.message || "Error al subir la imagen");
          }
          const imageUrl = data.secure_url;
          
          console.log("URL de la imagen:", imageUrl);
          
          setFormData(prev => ({
            ...prev,
            url: imageUrl
          }));
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          setError("Error al subir la imagen. Intenta de nuevo.");
          
          setFormData(prev => ({...prev, url: ""}));
        }
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
              <h1 className="text-4xl font-bold mb-4">Únete a nosotros</h1>
              <p className="text-xl opacity-90">
                Crea tu cuenta y comienza a disfrutar de todos nuestros
                servicios.
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
                  <p className="font-medium">Perfil personalizado</p>
                  <p className="opacity-80 text-sm">
                    Adapta la plataforma a tus necesidades
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <LucideLock className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Datos protegidos</p>
                  <p className="opacity-80 text-sm">
                    Seguridad y privacidad garantizadas
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
                <LucideUserPlus className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Crear cuenta</h2>
              <p className="text-gray-600 mt-2">
                Completa tus datos para registrarte
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Usuario registrado exitosamente. Redirigiendo...
              </div>
            )}

            <form onSubmit={handleSubmit} method="post" className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Nombre
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <LucideUser className="w-5 h-5" />
                  </div>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="pl-10 py-5 bg-white border-gray-200"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="surname" className="text-gray-700 font-medium">
                  Apellidos
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <LucideUser className="w-5 h-5" />
                  </div>
                  <Input
                    type="text"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Tus apellidos"
                    className="pl-10 py-5 bg-white border-gray-200"
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
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <LucideMail className="w-5 h-5" />
                  </div>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nombre@ejemplo.com"
                    className="pl-10 py-5 bg-white border-gray-200"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <LucideLock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 py-5 bg-white border-gray-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                className="space-y-2"
              >
                <Label htmlFor="rol" className="text-gray-700 font-medium ">
                  Rol
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                    <LucideUsers className="w-5 h-5" />
                  </div>
                  <Input
                    type="text"
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    placeholder="user"
                    className="pl-10 py-5 bg-white border-gray-200"
                    required
                    readOnly
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="dni" className="text-gray-700 font-medium">
                  DNI
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <LucideIdCard className="w-5 h-5" />
                  </div>
                  <Input
                    type="text"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="12345678X"
                    className="pl-10 py-5 bg-white border-gray-200"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="image" className="text-gray-700 font-medium">
                  Foto de perfil
                </Label>
                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {formData.url ? (
                      formData.url === "uploading" ? (
                        // Estado de carga
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-300 shadow-md flex items-center justify-center bg-blue-50">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        // Imagen subida con éxito
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 shadow-md group">
                          <img
                            src={formData.url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, url: "" }))
                              }
                              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300"
                              aria-label="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      // Sin imagen
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center shadow-inner border border-blue-200">
                        <LucideUser className="w-12 h-12 text-blue-400" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col items-center sm:items-start mt-3 sm:mt-0">
                      <label
                        htmlFor="imageUpload"
                        className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-full inline-flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-upload"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                        Subir imagen
                      </label>
                      <input
                        type="file"
                        id="imageUpload"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
                        Formatos: JPG, PNG. Tamaño máximo: 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-gray-600 text-sm">
                  Acepto los{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    términos y condiciones
                  </a>{" "}
                  y la{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    política de privacidad
                  </a>
                </Label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-all duration-200 hover:shadow-lg"
                >
                  Crear cuenta
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
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Iniciar sesión
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
}
