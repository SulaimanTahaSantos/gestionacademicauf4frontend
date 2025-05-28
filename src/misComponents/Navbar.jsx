"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  BookOpen,
  FileText,
  Users,
  GraduationCap,
  ClipboardList,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserProfileDropdown } from "@/misComponents/user-profile-dropdown";

const navigationItems = [
  {
    name: "Inicio",
    href: "/home",
    icon: Home,
  },
  {
    name: "Clases",
    href: "/clase",
    icon: BookOpen,
  },
  {
    name: "Módulos",
    href: "/modulos",
    icon: FileText,
  },
  {
    name: "Entregas",
    href: "/entregas",
    icon: ClipboardList,
  },
  {
    name: "Grupos",
    href: "/grupos",
    icon: Users,
  },
  {
    name: "Notas",
    href: "/notas",
    icon: GraduationCap,
  },
  {
    name: "Rúbricas",
    href: "/rubricas",
    icon: FileCheck,
  },
  {
    name: "Enunciados",
    href: "/enunciados",
    icon: FileText,
  },
];

export function Navbar({
  userEmail,
  userImage,
  userName,
  handleSettingsClick,
  handleHomeClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                SGA
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <UserProfileDropdown
              userEmail={userEmail}
              userImage={userImage}
              userName={userName}
              handleSettingsClick={handleSettingsClick}
              handleHomeClick={handleHomeClick}
            />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      Sistema de Gestión Académica
                    </span>
                  </div>

                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
