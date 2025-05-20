"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, Loader2 } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileDropdown } from "@/misComponents/user-profile-dropdown";
import { TailwindToast } from "@/misComponents/tailwind-toast";



const profileFormSchema = z.object({
    nombre: z
        .string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    apellido: z
        .string()
        .min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
    email: z
        .string()
        .email({ message: "Ingrese un correo electrónico válido" }),
});

const passwordFormSchema = z
    .object({
        currentPassword: z
            .string()
            .min(8, {
                message: "La contraseña debe tener al menos 8 caracteres",
            }),
        newPassword: z
            .string()
            .min(8, {
                message: "La contraseña debe tener al menos 8 caracteres",
            }),
        confirmPassword: z
            .string()
            .min(8, {
                message: "La contraseña debe tener al menos 8 caracteres",
            }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "La nueva contraseña debe ser diferente a la actual",
        path: ["newPassword"],
    });

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(
        "/placeholder.svg?height=100&width=100"
    );
    const [userEmail, setUserEmail] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userName, setUserName] = useState(null);
    const [toast, setToast] = useState({ show: false, title: "", description: "" });

    const defaultValues = {
        nombre: "Usuario",
        apellido: "Ejemplo",
        email: "usuario@ejemplo.com",
    };

    const profileForm = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    

    useEffect(() => {
        const email = sessionStorage.getItem("userEmail");
        const image = sessionStorage.getItem("userImage");
        const name = sessionStorage.getItem("userName");

        setUserEmail(email || "usuario@ejemplo.com");
        setUserImage(image || "");
        setUserName(name || "Usuario");
    }, []);

    function onProfileSubmit(data) {
        setIsLoading(true);

        setTimeout(() => {
            console.log("Profile data:", data);
            setIsLoading(false);
            setToast({
                show: true,
                title: "Perfil actualizado",
                description: "Tu información de perfil ha sido actualizada correctamente."
            });
        }, 1000);
    }

    function onPasswordSubmit(data) {
        setIsLoading(true);

        setTimeout(() => {
            console.log("Password data:", data);
            setIsLoading(false);
            passwordForm.reset({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setToast({
                show: true,
                title: "Contraseña actualizada",
                description: "Tu contraseña ha sido actualizada correctamente."
            });
        }, 1000);
    }

    function handleImageUpload(e) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setProfileImage(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/home")}
                        >
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
                                    Actualiza tu información personal y foto de
                                    perfil
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...profileForm}>
                                    <form
                                        onSubmit={profileForm.handleSubmit(
                                            onProfileSubmit
                                        )}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
                                            <div className="relative">
                                                <Avatar className="h-24 w-24">
                                                    <AvatarImage
                                                        src={profileImage}
                                                        alt="Profile"
                                                    />
                                                    <AvatarFallback className="text-lg">
                                                        {`${profileForm
                                                            .watch("nombre")
                                                            .charAt(
                                                                0
                                                            )}${profileForm
                                                            .watch("apellido")
                                                            .charAt(0)}`}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <label
                                                    htmlFor="profile-image"
                                                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer"
                                                >
                                                    <Camera className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Cambiar imagen
                                                    </span>
                                                </label>
                                                <input
                                                    id="profile-image"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <h3 className="text-lg font-medium">
                                                    Foto de perfil
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Esta imagen será mostrada en
                                                    tu perfil y en tus
                                                    comentarios. Formatos
                                                    recomendados: JPG, PNG.
                                                    Tamaño máximo: 2MB.
                                                </p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid gap-6 pt-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormField
                                                    control={
                                                        profileForm.control
                                                    }
                                                    name="nombre"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Nombre
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Tu nombre"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={
                                                        profileForm.control
                                                    }
                                                    name="apellido"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Apellido
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Tu apellido"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={profileForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Correo electrónico
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="tu@ejemplo.com"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Este correo se
                                                            utilizará para
                                                            iniciar sesión y
                                                            recibir
                                                            notificaciones.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Guardar cambios
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Cambiar contraseña</CardTitle>
                                <CardDescription>
                                    Actualiza tu contraseña para mantener tu
                                    cuenta segura
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...passwordForm}>
                                    <form
                                        onSubmit={passwordForm.handleSubmit(
                                            onPasswordSubmit
                                        )}
                                        className="space-y-6"
                                    >
                                        <FormField
                                            control={passwordForm.control}
                                            name="currentPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Contraseña actual
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nueva contraseña
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        La contraseña debe tener
                                                        al menos 8 caracteres.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Confirmar nueva
                                                        contraseña
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Actualizar contraseña
                                        </Button>
                                    </form>
                                </Form>
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
