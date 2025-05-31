"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Home } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UserProfileDropdown({
    userEmail = "usuario@ejemplo.com",
    userImage = "",
    userName = "Usuario",
    handleSettingsClick,
    handleHomeClick,
}) {    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(
                "https://gestionacademicauf4backend-production.up.railway.app/api/logout",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`, 
                    },
                }
            );

            if (!response.ok) {
                console.warn("Error en logout:", response.status);
            }

            localStorage.clear(); 

            console.log("Sesión cerrada exitosamente");
           
            router.push("/");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={userImage || "/placeholder.svg"}
                            alt={userName}
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                            {(userName || "Usuario")
                                .substring(0, 2)
                                .toUpperCase()}{" "}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {userName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userEmail}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleHomeClick}>
                        <Home className="mr-2 h-4 w-4" />
                        <span>Home</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configuración</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
