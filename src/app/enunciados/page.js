"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    InfoIcon as Id,
    FileText,
    BookOpen,
    TestTube,
    User,
    Calendar,
    Paperclip,
    Users,
    Eye,
    Pencil,
    Trash,
    Plus,
    Link,
} from "lucide-react";

import ViewDialog from "@/misComponents/ViewDialog";
import EditDialog from "@/misComponents/EditDialog";
import DeleteDialog from "@/misComponents/DeleteDialog";
import CreateDialog from "@/misComponents/CreateDialog";
import AssignDialog from "@/misComponents/AssignDialog";
import { UserProfileDropdown } from "@/misComponents/user-profile-dropdown";

export default function EnunciadosPage() {
    const [enunciados, setEnunciados] = useState([
        {
            id: "ENS001",
            titulo: "Desarrollo de API REST",
            descripcion:
                "Crear una API REST utilizando Express.js con autenticación JWT",
            modulo: "Desarrollo Backend",
            practica: "Práctica 3",
            profesor: "María García",
            fechaEntrega: "2023-12-15",
            rubrica: "Rúbrica API REST",
            grupo: "DAW2",
        },
        {
            id: "ENS002",
            titulo: "Diseño de interfaces responsive",
            descripcion:
                "Crear una interfaz adaptable a diferentes dispositivos usando Flexbox y Grid",
            modulo: "Desarrollo Frontend",
            practica: "Práctica 2",
            profesor: "Juan Pérez",
            fechaEntrega: "2023-11-30",
            rubrica: "Rúbrica Diseño Web",
            grupo: "DAW1",
        },
        {
            id: "ENS003",
            titulo: "Modelado de base de datos",
            descripcion:
                "Diseñar e implementar una base de datos relacional para un sistema de gestión escolar",
            modulo: "Bases de Datos",
            practica: "Práctica 4",
            profesor: "Ana Martínez",
            fechaEntrega: "2023-12-20",
            rubrica: "Rúbrica BBDD",
            grupo: "DAW2, ASIR1",
        },
    ]);

    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [selectedEnunciado, setSelectedEnunciado] = useState(null);
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

    const handleView = (enunciado) => {
        setSelectedEnunciado(enunciado);
        setViewOpen(true);
    };

    const handleEdit = (enunciado) => {
        setSelectedEnunciado(enunciado);
        setEditOpen(true);
    };

    const handleDelete = (enunciado) => {
        setSelectedEnunciado(enunciado);
        setDeleteOpen(true);
    };

    const handleCreate = () => {
        setCreateOpen(true);
    };

    const handleAssign = (enunciado) => {
        setSelectedEnunciado(enunciado);
        setAssignOpen(true);
    };

    const confirmDelete = () => {
        setEnunciados(enunciados.filter((e) => e.id !== selectedEnunciado.id));
        setDeleteOpen(false);
    };

    const saveEnunciado = (updatedEnunciado) => {
        if (updatedEnunciado.id) {
            setEnunciados(
                enunciados.map((e) =>
                    e.id === updatedEnunciado.id ? updatedEnunciado : e
                )
            );
        } else {
            const newId = `id${String(enunciados.length + 1).padStart(
                3,
                "0"
            )}`;
            setEnunciados([...enunciados, { ...updatedEnunciado, id: newId }]);
        }
    };

    const router = useRouter();

    const handleSettingsClick = () => {
        router.push("/configuracion");
    };

    const handleHomeClick = () => {
        router.push("/home");
    };

    const handleDownloadPractica = (enunciado) => {
        if (!enunciado) return;

        const link = document.createElement("a");
        link.setAttribute(
            "download",
            `Practica_${enunciado.practica.replace(/\s+/g, "_")}.pdf`
        );
        const blob = new Blob(
            [
                `Contenido de la práctica: ${enunciado.titulo} - ${enunciado.descripcion}`,
            ],
            {
                type: "application/pdf",
            }
        );
        const url = URL.createObjectURL(blob);
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        Gestión de Enunciados
                    </h1>
                    <UserProfileDropdown
                        userEmail={userEmail}
                        userImage={userImage}
                        userName={userName}
                        handleSettingsClick={handleSettingsClick}
                        handleHomeClick={handleHomeClick}
                    />
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Crear nuevo enunciado
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">
                                <div className="flex items-center">
                                    <Id className="mr-2 h-4 w-4" /> ID
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4" /> Título
                                </div>
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                <div className="flex items-center">
                                    <BookOpen className="mr-2 h-4 w-4" /> Módulo
                                </div>
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                <div className="flex items-center">
                                    <TestTube className="mr-2 h-4 w-4" />{" "}
                                    Práctica
                                </div>
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                <div className="flex items-center">
                                    <User className="mr-2 h-4 w-4" /> Profesor
                                </div>
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4" /> Fecha
                                    de entrega
                                </div>
                            </TableHead>
                            <TableHead className="hidden xl:table-cell">
                                <div className="flex items-center">
                                    <Paperclip className="mr-2 h-4 w-4" />{" "}
                                    Rúbrica
                                </div>
                            </TableHead>
                            <TableHead className="hidden xl:table-cell">
                                <div className="flex items-center">
                                    <Users className="mr-2 h-4 w-4" /> Grupo
                                </div>
                            </TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {enunciados.map((enunciado) => (
                            <TableRow key={enunciado.id}>
                                <TableCell className="font-medium">
                                    {enunciado.id}
                                </TableCell>
                                <TableCell>{enunciado.titulo}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {enunciado.modulo}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {enunciado.practica}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    {enunciado.profesor}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    {new Date(
                                        enunciado.fechaEntrega
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                    {enunciado.rubrica}
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                    {enunciado.grupo}
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleView(enunciado)
                                            }
                                            title="Ver detalles"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleEdit(enunciado)
                                            }
                                            title="Editar"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleDelete(enunciado)
                                            }
                                            title="Eliminar"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleAssign(enunciado)
                                            }
                                            title="Asignar"
                                        >
                                            <Link className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ViewDialog
                open={viewOpen}
                onOpenChange={setViewOpen}
                enunciado={selectedEnunciado}
                onDownload={handleDownloadPractica}
            />

            <EditDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                enunciado={selectedEnunciado}
                onSave={(updated) => {
                    saveEnunciado(updated);
                    setEditOpen(false);
                }}
            />

            <DeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                enunciado={selectedEnunciado}
                onConfirm={confirmDelete}
            />

            <CreateDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSave={(newEnunciado) => {
                    saveEnunciado(newEnunciado);
                    setCreateOpen(false);
                }}
            />

            <AssignDialog
                open={assignOpen}
                onOpenChange={setAssignOpen}
                enunciado={selectedEnunciado}
                onSave={(updated) => {
                    saveEnunciado(updated);
                    setAssignOpen(false);
                }}
                onDownload={handleDownloadPractica}
            />
        </div>
    );
}
