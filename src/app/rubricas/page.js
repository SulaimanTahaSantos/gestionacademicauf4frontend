"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, FileText } from "lucide-react";
import RubricTable from "@/misComponents/RubricTable";
import RubricForm from "@/misComponents/RubricForm";
import RubricPreview from "@/misComponents/RubricPreview";
import { UserProfileDropdown } from "@/misComponents/user-profile-dropdown";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { date } from "zod";

export default function Rubricas() {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [editingRubric, setEditingRubric] = useState(null);
    const [previewRubric, setPreviewRubric] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [rubrics, setRubrics] = useState([
        {
            id: 1,
            nombre: "Evaluación de Proyecto Final",
            practica: "Desarrollo Web Avanzado",
            evaluadores: ["Juan Pérez", "María García"],
            evaluacionesRealizadas: 12,
            documento: {
                nombre: "proyecto_final_instrucciones.pdf",
                tipo: "application/pdf",
                tamaño: 2457600, 
                url: "#", 
                fechaSubida: new Date().toLocaleDateString("es-ES"),
            },
            criterios: [
                {
                    nombre: "Diseño UI/UX",
                    descripcion: "Calidad de la interfaz de usuario",
                    puntuacion: 20,
                },
                {
                    nombre: "Funcionalidad",
                    descripcion: "Implementación correcta de las funciones",
                    puntuacion: 30,
                },
                {
                    nombre: "Código limpio",
                    descripcion: "Organización y legibilidad del código",
                    puntuacion: 25,
                },
                {
                    nombre: "Documentación",
                    descripcion: "Calidad de la documentación",
                    puntuacion: 25,
                },
            ],
        },
        {
            id: 2,
            nombre: "Rúbrica de Presentación Oral",
            practica: "Comunicación Efectiva",
            evaluadores: ["Ana Rodríguez"],
            evaluacionesRealizadas: 8,
            documento: null,
            criterios: [
                {
                    nombre: "Claridad",
                    descripcion: "Claridad en la exposición",
                    puntuacion: 30,
                },
                {
                    nombre: "Material visual",
                    descripcion: "Calidad del material de apoyo",
                    puntuacion: 20,
                },
                {
                    nombre: "Dominio del tema",
                    descripcion: "Conocimiento demostrado",
                    puntuacion: 30,
                },
                {
                    nombre: "Respuestas",
                    descripcion: "Calidad de respuestas a preguntas",
                    puntuacion: 20,
                },
            ],
        },
    ]);

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

    const handleSettingsClick = () => {
        router.push("/configuracion");
    };

    const handleHomeClick = () => {
        router.push("/home");
    };

    const handleAddRubric = () => {
        setEditingRubric(null);
        setShowForm(true);
    };

    const handleEditRubric = (rubric) => {
        setEditingRubric(rubric);
        setShowForm(true);
    };

    const handlePreviewRubric = (rubric) => {
        setPreviewRubric(rubric);
        setShowPreview(true);
    };

    const handleDeleteRubric = (id) => {
        setRubrics(rubrics.filter((rubric) => rubric.id !== id));
    };

    const handleSaveRubric = (rubric) => {
        if (editingRubric) {
            setRubrics(
                rubrics.map((r) =>
                    r.id === editingRubric.id
                        ? { ...rubric, id: editingRubric.id }
                        : r
                )
            );
        } else {
            const newId = Math.max(0, ...rubrics.map((r) => r.id)) + 1;
            setRubrics([...rubrics, { ...rubric, id: newId }]);
        }
        setShowForm(false);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingRubric(null);
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setPreviewRubric(null);
    };

    const filteredRubrics = rubrics.filter(
        (rubric) =>
            rubric.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rubric.practica.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-semibold">
                            Sistema de Rúbricas
                        </h1>
                    </div>
                    <UserProfileDropdown
                        userEmail={userEmail}
                        userImage={userImage}
                        userName={userName}
                        handleSettingsClick={handleSettingsClick}
                        handleHomeClick={handleHomeClick}
                    />
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Gestión de Rúbricas
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                Administra y organiza tus rúbricas de evaluación
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar rúbricas..."
                                    className="pl-8 w-full sm:w-[250px]"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <Button
                                onClick={handleAddRubric}
                                className="whitespace-nowrap"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nueva Rúbrica
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <RubricTable
                        rubrics={filteredRubrics}
                        onEdit={handleEditRubric}
                        onDelete={handleDeleteRubric}
                        onPreview={handlePreviewRubric}
                    />
                </div>

                {filteredRubrics.length === 0 && searchTerm && (
                    <div className="text-center py-8 text-muted-foreground">
                        No se encontraron rúbricas que coincidan con 
                        {searchTerm}
                    </div>
                )}
            </main>

            <RubricForm
                open={showForm}
                onClose={handleCloseForm}
                onSave={handleSaveRubric}
                rubric={editingRubric}
            />

            <RubricPreview
                open={showPreview}
                onClose={handleClosePreview}
                rubric={previewRubric}
            />
        </div>
    );
}
