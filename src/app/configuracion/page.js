"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileDropdown } from "@/misComponents/user-profile-dropdown";
import { TailwindToast } from "@/misComponents/tailwind-toast";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
    const [userSurname, setUserSurname] = useState("");
  const [toast, setToast] = useState({
    show: false,
    title: "",
    description: "",
  });

  // Estados para formulario de perfil
  const [nombre, setNombre] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  // Estados para formulario de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.data) {
        const name = userData.data.name || "Usuario";
        const surname = userData.data.surname || "Apellido";
        const email = userData.data.email || "usuario@ejemplo.com";
        const image = userData.data.url || "";

        console.log("name:", name);
        console.log("surname:", surname);
        console.log("email:", email);
        console.log("image url:", image);

        setUserEmail(email);
        setUserImage(image);
        setProfileImage(image); // Inicializar también profileImage
        setUserName(name);
        setUserSurname(surname);

        // Establecer los valores en los campos del formulario directamente
        setNombre(name);
        setSurname(surname); // Usar directamente el surname del userData
        setEmail(email);
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  }, []);
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      
      // Preparar los datos para enviar
      const userData = {
        name: nombre,
        surname,
        email,
        url: profileImage || userImage, // Usar la imagen existente si no se ha cambiado
      };
      
      console.log("Enviando datos de perfil:", userData);
      
      const response = await fetch(
        "https://gestionacademicauf4backend-production.up.railway.app/api/updateUserSettings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Error al actualizar el perfil");
      }
      
      // Actualizar los datos en localStorage
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.data) {
          userData.data.name = nombre;
          userData.data.surname = surname;
          userData.data.email = email;
          userData.data.url = profileImage || userImage;
          localStorage.setItem("userData", JSON.stringify(userData));
        }
      } catch (e) {
        console.error("Error actualizando datos locales:", e);
      }
      
      setToast({
        show: true,
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada correctamente.",
      });
      
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setToast({
        show: true,
        title: "Error",
        description: error.message || "Error al actualizar el perfil. Intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("La nueva contraseña y la confirmación no coinciden");
      }

      if (newPassword.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      
      const passwordData = {
        password: newPassword,
        current_password: currentPassword,
      };
      
      console.log("Enviando datos de contraseña");
      
      const response = await fetch(
        "https://gestionacademicauf4backend-production.up.railway.app/api/updateUserSettingsPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(passwordData),
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Error al actualizar la contraseña");
      }
      
      // Limpiar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setToast({
        show: true,
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
      
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      setToast({
        show: true,
        title: "Error",
        description: error.message || "Error al actualizar la contraseña. Intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar que sea una imagen y no exceda cierto tamaño (por ejemplo 2MB)
      if (!file.type.includes("image/")) {
        setToast({
          show: true,
          title: "Error",
          description: "Por favor, sube solo archivos de imagen",
        });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB en bytes
        setToast({
          show: true,
          title: "Error",
          description: "La imagen no debe superar los 2MB",
        });
        return;
      }

      try {
        // Mostrar un estado de carga temporal
        setIsLoading(true);
        
        // Preparar formData para Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "gestionacademica"); // Tu upload preset
        formData.append("api_key", "196387385376185"); // API key correcta
        
        // La URL de la API de Cloudinary
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
        
        // Usamos la URL segura que es corta y cabe en 255 caracteres
        const imageUrl = data.secure_url;
        
        console.log("URL de la imagen:", imageUrl);
        
        setProfileImage(imageUrl);
        // Actualizar también la vista previa
        setUserImage(imageUrl);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        setToast({
          show: true,
          title: "Error",
          description: "Error al subir la imagen. Intenta de nuevo.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }



  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/home")}>
              Sistema de Gestión Académica
            </Button>
            <UserProfileDropdown
              userName={userName}
              userEmail={userEmail}
              userImage={userImage}
              handleSettingsClick={() => router.push("/configuracion")}
              handleHomeClick={() => router.push("/home")}
            />
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Configuración de cuenta
          </h1>
          <p className="mt-2 text-gray-600">
            Administra tu información personal y contraseña
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="password">Contraseña</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Información de perfil</CardTitle>
                <CardDescription>
                  Actualiza tu información personal y foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileImage || userImage} alt="Profile" />
                        <AvatarFallback className="text-lg">
                          {nombre.charAt(0)}
                          {surname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer"
                        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                        <span className="sr-only">Cambiar imagen</span>
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-lg font-medium">Foto de perfil</h3>
                      <p className="text-sm text-muted-foreground">
                        Esta imagen será mostrada en tu perfil y en tus
                        comentarios. Formatos recomendados: JPG, PNG. Tamaño
                        máximo: 2MB.
                      </p>
                      {profileImage && (
                        <p className="text-xs text-green-600">Imagen cargada correctamente</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-6 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nombre
                        </label>
                        <Input
                          placeholder="Tu nombre"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Apellido
                        </label>
                        <Input
                          placeholder="Tu apellido"
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Correo electrónico
                      </label>
                      <Input
                        placeholder="tu@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Este correo se utilizará para iniciar sesión y recibir
                        notificaciones.
                      </p>
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Guardar cambios
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar contraseña</CardTitle>
                <CardDescription>
                  Actualiza tu contraseña para mantener tu cuenta segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Contraseña actual
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nueva contraseña
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      La contraseña debe tener al menos 8 caracteres.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirmar nueva contraseña
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Actualizar contraseña
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {toast.show && (
        <TailwindToast
          title={toast.title}
          description={toast.description}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </main>
  );
}
