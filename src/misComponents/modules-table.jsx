"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Pencil, Trash2, Plus, BookOpen } from "lucide-react";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { useRouter } from "next/navigation";

export default function ModulesTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [modules, setModules] = useState([
        {
            id: "M1",
            name: "Introducción a la Programación",
            description: "Fundamentos básicos de programación",
            course: "Informática Básica",
            professor: "Juan Pérez",
        },
        {
            id: "M2",
            name: "Estructuras de Datos",
            description: "Estudio de estructuras de datos fundamentales",
            course: "Algoritmos",
            professor: "María López",
        },
        {
            id: "M3",
            name: "Programación Orientada a Objetos",
            description: "Paradigma de programación basado en objetos",
            course: "Desarrollo de Software",
            professor: "Carlos Rodríguez",
        },
        {
            id: "M4",
            name: "Bases de Datos",
            description: "Diseño y gestión de bases de datos",
            course: "Sistemas de Información",
            professor: "Ana Martínez",
        },
        {
            id: "M5",
            name: "Desarrollo Web Frontend",
            description: "Tecnologías para el desarrollo de interfaces web",
            course: "Desarrollo Web",
            professor: "Pedro Sánchez",
        },
        {
            id: "M6",
            name: "Desarrollo Web Backend",
            description: "Tecnologías para el desarrollo de servidores web",
            course: "Desarrollo Web",
            professor: "Laura González",
        },
        {
            id: "M7",
            name: "Inteligencia Artificial",
            description: "Fundamentos de IA y aprendizaje automático",
            course: "Computación Avanzada",
            professor: "Roberto Fernández",
        },
        {
            id: "M8",
            name: "Seguridad Informática",
            description: "Principios de seguridad en sistemas informáticos",
            course: "Ciberseguridad",
            professor: "Elena Torres",
        },
        {
            id: "M9",
            name: "Redes de Computadoras",
            description: "Diseño y gestión de redes informáticas",
            course: "Telecomunicaciones",
            professor: "Miguel Álvarez",
        },
        {
            id: "M10",
            name: "Sistemas Operativos",
            description: "Gestión y administración de sistemas operativos",
            course: "Infraestructura",
            professor: "Sofía Ramírez",
        },
        {
            id: "M11",
            name: "Desarrollo Móvil",
            description: "Creación de aplicaciones para dispositivos móviles",
            course: "Aplicaciones Móviles",
            professor: "David Jiménez",
        },
        {
            id: "M12",
            name: "Proyecto Final",
            description: "Desarrollo de un proyecto integrador",
            course: "Proyecto de Grado",
            professor: "Carmen Vázquez",
        },
    ]);

    const [newModule, setNewModule] = useState({
        id: "",
        name: "",
        description: "",
        course: "",
        professor: "",
    });
    const [editingModule, setEditingModule] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);

    const [userEmail, setUserEmail] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userName, setUserName] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const email = sessionStorage.getItem("userEmail");
        const image = sessionStorage.getItem("userImage");
        const name = sessionStorage.getItem("userName");

        setUserEmail(email || "usuario@ejemplo.com");
        setUserImage(image || "");
        setUserName(name || "Usuario");
    }, []);

    const filteredModules = modules.filter(
        (module) =>
            module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            module.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNewModuleChange = (e) => {
        const { name, value } = e.target;
        setNewModule({
            ...newModule,
            [name]: value,
        });
    };

    const handleEditModuleChange = (e) => {
        const { name, value } = e.target;
        setEditingModule({
            ...editingModule,
            [name]: value,
        });
    };

    const handleAddModule = () => {
        setModules([...modules, newModule]);
        setNewModule({
            id: "",
            name: "",
            description: "",
            course: "",
            professor: "",
        });
        setIsAddDialogOpen(false);
    };

    const handleEditModule = () => {
        setModules(
            modules.map((module) =>
                module.id === editingModule.id ? editingModule : module
            )
        );
        setEditingModule(null);
        setIsEditDialogOpen(false);
    };

    const handleDeleteModule = () => {
        setModules(modules.filter((module) => module.id !== moduleToDelete.id));
        setModuleToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const openEditDialog = (module) => {
        setEditingModule({ ...module });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (module) => {
        setModuleToDelete(module);
        setIsDeleteDialogOpen(true);
    };

    const handleSettingsClick = () => {
        router.push("/configuracion");
    };

    const handleHomeClick = () => {
        router.push("/home");
    };

    return (
        <div className="p-4 space-y-4">
            <div className="bg-white pb-4 mb-6">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="h-6 w-6 text-emerald-600" />
                            <h1 className="text-2xl font-bold">
                                Módulos Académicos
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={setIsAddDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                                        <Plus className="h-4 w-4" /> Agregar
                                        Módulo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Agregar Nuevo Módulo
                                        </DialogTitle>
                                        <DialogDescription>
                                            Complete el formulario para agregar
                                            un nuevo módulo académico.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="id"
                                                className="text-right"
                                            >
                                                Código
                                            </Label>
                                            <Input
                                                id="id"
                                                name="id"
                                                value={newModule.id}
                                                onChange={handleNewModuleChange}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="name"
                                                className="text-right"
                                            >
                                                Nombre
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={newModule.name}
                                                onChange={handleNewModuleChange}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="description"
                                                className="text-right"
                                            >
                                                Descripción
                                            </Label>
                                            <Input
                                                id="description"
                                                name="description"
                                                value={newModule.description}
                                                onChange={handleNewModuleChange}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="course"
                                                className="text-right"
                                            >
                                                Curso
                                            </Label>
                                            <Input
                                                id="course"
                                                name="course"
                                                value={newModule.course}
                                                onChange={handleNewModuleChange}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="professor"
                                                className="text-right"
                                            >
                                                Profesor
                                            </Label>
                                            <Input
                                                id="professor"
                                                name="professor"
                                                value={newModule.professor}
                                                onChange={handleNewModuleChange}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            onClick={handleAddModule}
                                        >
                                            Guardar
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <UserProfileDropdown
                                userEmail={userEmail}
                                userImage={userImage}
                                userName={userName}
                                handleSettingsClick={handleSettingsClick}
                                handleHomeClick={handleHomeClick}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Buscar módulos..."
                            className="pl-8 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableCaption>Lista de módulos académicos</TableCaption>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[100px] font-semibold">
                                    Código
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Nombre del Módulo
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Descripción del Módulo
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Curso
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Profesor
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredModules.length > 0 ? (
                                filteredModules.map((module, index) => (
                                    <TableRow
                                        key={module.id}
                                        className={
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-50"
                                        }
                                    >
                                        <TableCell className="font-medium text-emerald-700">
                                            {module.id}
                                        </TableCell>
                                        <TableCell>{module.name}</TableCell>
                                        <TableCell className="text-slate-600 text-sm">
                                            {module.description}
                                        </TableCell>
                                        <TableCell>{module.course}</TableCell>
                                        <TableCell>
                                            {module.professor}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        openEditDialog(module)
                                                    }
                                                    className="hover:bg-slate-100"
                                                >
                                                    <Pencil className="h-4 w-4 text-slate-600" />
                                                    <span className="sr-only">
                                                        Editar
                                                    </span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        openDeleteDialog(module)
                                                    }
                                                    className="hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                    <span className="sr-only">
                                                        Eliminar
                                                    </span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center text-slate-500"
                                    >
                                        No se encontraron resultados para su
                                        búsqueda.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Module Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Editar Módulo</DialogTitle>
                        <DialogDescription>
                            Actualice la información del módulo académico.
                        </DialogDescription>
                    </DialogHeader>
                    {editingModule && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-id" className="text-right">
                                    Código
                                </Label>
                                <Input
                                    id="edit-id"
                                    name="id"
                                    value={editingModule.id}
                                    onChange={handleEditModuleChange}
                                    className="col-span-3"
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit-name"
                                    className="text-right"
                                >
                                    Nombre
                                </Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    value={editingModule.name}
                                    onChange={handleEditModuleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit-description"
                                    className="text-right"
                                >
                                    Descripción
                                </Label>
                                <Input
                                    id="edit-description"
                                    name="description"
                                    value={editingModule.description}
                                    onChange={handleEditModuleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit-course"
                                    className="text-right"
                                >
                                    Curso
                                </Label>
                                <Input
                                    id="edit-course"
                                    name="course"
                                    value={editingModule.course}
                                    onChange={handleEditModuleChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit-professor"
                                    className="text-right"
                                >
                                    Profesor
                                </Label>
                                <Input
                                    id="edit-professor"
                                    name="professor"
                                    value={editingModule.professor}
                                    onChange={handleEditModuleChange}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            type="submit"
                            onClick={handleEditModule}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará
                            permanentemente el módulo {moduleToDelete?.id} -{" "}
                            {moduleToDelete?.name}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteModule}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
