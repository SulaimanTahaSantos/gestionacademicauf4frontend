"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    Pencil,
    Upload,
    Search,
    Filter,
    Trash2,
    Plus,
    Edit,
} from "lucide-react";
import { TailwindToast } from "@/misComponents/tailwind-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfileDropdown } from "@/misComponents/user-profile-dropdown";

const entregas = [
    {
        id: 1,
        studentName: "Carlos Rodríguez",
        practice: "Práctica de Programación 1",
        submissionDate: "2023-04-15",
        rubric: "Rúbrica de Programación Básica",
        grade: 85,
        evaluator: "Prof. Martínez",
        file: "practica1_carlos.pdf",
    },
    {
        id: 2,
        studentName: "Ana López",
        practice: "Proyecto Final",
        submissionDate: "2023-05-20",
        rubric: "Rúbrica de Proyectos",
        grade: 92,
        evaluator: "Prof. García",
        file: "proyecto_final_ana.pdf",
    },
    {
        id: 3,
        studentName: "Miguel Sánchez",
        practice: "Práctica de Bases de Datos",
        submissionDate: "2023-04-10",
        rubric: "Rúbrica de SQL",
        grade: 78,
        evaluator: "Prof. Hernández",
        file: "practica_bd_miguel.pdf",
    },
    {
        id: 4,
        studentName: "Laura Fernández",
        practice: "Ejercicio de Algoritmos",
        submissionDate: "2023-03-25",
        rubric: "Rúbrica de Algoritmos",
        grade: 88,
        evaluator: "Prof. Martínez",
        file: "algoritmos_laura.pdf",
    },
    {
        id: 5,
        studentName: "Javier Moreno",
        practice: "Práctica de Redes",
        submissionDate: "2023-05-05",
        rubric: "Rúbrica de Redes",
        grade: 90,
        evaluator: "Prof. López",
        file: "redes_javier.pdf",
    },
];

export default function PaginaEntregas() {
    const router = useRouter();
    const [terminoBusqueda, setTerminoBusqueda] = useState("");
    const [mostrarToast, setMostrarToast] = useState(false);
    const [mensajeToast, setMensajeToast] = useState({
        title: "",
        description: "",
    });
    const [verDocumento, setVerDocumento] = useState(null);
    const [editarEntrega, setEditarEntrega] = useState(null);
    const [subirArchivo, setSubirArchivo] = useState(null);
    const [insertarEntrega, setInsertarEntrega] = useState(false);
    const [editarFilaEntrega, setEditarFilaEntrega] = useState(null);

    const [correoUsuario, setCorreoUsuario] = useState(null);
    const [imagenUsuario, setImagenUsuario] = useState(null);
    const [nombreUsuario, setNombreUsuario] = useState(null);

    useEffect(() => {
        const email = sessionStorage.getItem("userEmail");
        const image = sessionStorage.getItem("userImage");
        const name = sessionStorage.getItem("userName");

        setCorreoUsuario(email || "usuario@ejemplo.com");
        setImagenUsuario(image || "");
        setNombreUsuario(name || "Usuario");
    }, []);

    const manejarClicConfiguracion = () => {
        router.push("/configuracion");
    };

    const manejarClicInicio = () => {
        router.push("/home");
    };

    const entregasFiltradas = entregas.filter(
        (entrega) =>
            entrega.studentName
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
            entrega.practice
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase()) ||
            entrega.evaluator
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase())
    );

    const manejarVerDocumento = (entrega) => {
        setVerDocumento(entrega);
    };

    const manejarEditarEntrega = (entrega) => {
        setEditarEntrega(entrega);
    };

    const manejarSubirArchivo = (entrega) => {
        setSubirArchivo(entrega);
    };

    const manejarEliminarEntrega = (entrega) => {
        if (
            confirm(
                `¿Estás seguro de que deseas eliminar la entrega de ${entrega.studentName}?`
            )
        ) {
            mostrarMensajeToast(
                "Entrega eliminada",
                `La entrega de ${entrega.studentName} ha sido eliminada correctamente`
            );
        }
    };

    const manejarEditarFilaEntrega = (entrega) => {
        setEditarFilaEntrega(entrega);
    };

    const mostrarMensajeToast = (titulo, descripcion) => {
        setMensajeToast({ title: titulo, description: descripcion });
        setMostrarToast(true);
    };

    const formatearFecha = (fechaString) => {
        const opciones = { year: "numeric", month: "long", day: "numeric" };
        return new Date(fechaString).toLocaleDateString("es-ES", opciones);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Prácticas y Entregas de Alumnos
                </h1>
                <UserProfileDropdown
                    userEmail={correoUsuario}
                    userImage={imagenUsuario}
                    userName={nombreUsuario}
                    handleSettingsClick={manejarClicConfiguracion}
                    handleHomeClick={manejarClicInicio}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <Input
                        placeholder="Buscar por alumno, práctica o evaluador..."
                        value={terminoBusqueda}
                        onChange={(e) => setTerminoBusqueda(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Filter size={18} />
                            <span>Filtros</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => setTerminoBusqueda("")}
                        >
                            Todos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setTerminoBusqueda("Programación")}
                        >
                            Programación
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setTerminoBusqueda("Proyecto")}
                        >
                            Proyectos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setTerminoBusqueda("Martínez")}
                        >
                            Prof. Martínez
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    onClick={() => setInsertarEntrega(true)}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    <span>Insertar Nueva Entrega</span>
                </Button>
            </div>
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Alumno</TableHead>
                            <TableHead>Práctica</TableHead>
                            <TableHead>Fecha de Entrega</TableHead>
                            <TableHead>Rúbrica</TableHead>
                            <TableHead>Nota</TableHead>
                            <TableHead>Evaluador</TableHead>
                            <TableHead>Archivo</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entregasFiltradas.map((entrega) => (
                            <TableRow key={entrega.id}>
                                <TableCell className="font-medium">
                                    {entrega.studentName}
                                </TableCell>
                                <TableCell>{entrega.practice}</TableCell>
                                <TableCell>
                                    {formatearFecha(entrega.submissionDate)}
                                </TableCell>
                                <TableCell>{entrega.rubric}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            entrega.grade >= 90
                                                ? "bg-green-100 text-green-800"
                                                : entrega.grade >= 80
                                                ? "bg-blue-100 text-blue-800"
                                                : entrega.grade >= 70
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {entrega.grade}
                                    </span>
                                </TableCell>
                                <TableCell>{entrega.evaluator}</TableCell>
                                <TableCell>{entrega.file}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                manejarVerDocumento(entrega)
                                            }
                                            title="Ver documento"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                manejarEditarEntrega(entrega)
                                            }
                                            title="Editar/Reevaluar"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                manejarSubirArchivo(entrega)
                                            }
                                            title="Subir archivo"
                                        >
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                manejarEditarFilaEntrega(
                                                    entrega
                                                )
                                            }
                                            title="Editar fila completa"
                                        >
                                            <Edit className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                manejarEliminarEntrega(entrega)
                                            }
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog
                open={verDocumento !== null}
                onOpenChange={() => setVerDocumento(null)}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            Documento: {verDocumento?.file}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="bg-gray-100 p-4 rounded-md min-h-[400px] flex items-center justify-center">
                        <p className="text-gray-500">
                            Vista previa del documento {verDocumento?.file}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={editarEntrega !== null}
                onOpenChange={() => setEditarEntrega(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar/Reevaluar Entrega</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Alumno:</label>
                            <div className="col-span-3">
                                {editarEntrega?.studentName}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Práctica:</label>
                            <div className="col-span-3">
                                {editarEntrega?.practice}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Nota:</label>
                            <Input
                                className="col-span-3"
                                type="number"
                                defaultValue={editarEntrega?.grade}
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Comentarios:</label>
                            <textarea
                                className="col-span-3 border rounded-md p-2"
                                rows="3"
                                placeholder="Añadir comentarios sobre la evaluación..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setEditarEntrega(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                mostrarMensajeToast(
                                    "Evaluación actualizada",
                                    "La evaluación ha sido actualizada correctamente"
                                );
                                setEditarEntrega(null);
                            }}
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={subirArchivo !== null}
                onOpenChange={() => setSubirArchivo(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Subir Archivo</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Alumno:</label>
                            <div className="col-span-3">
                                {subirArchivo?.studentName}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Práctica:</label>
                            <div className="col-span-3">
                                {subirArchivo?.practice}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">
                                Archivo actual:
                            </label>
                            <div className="col-span-3">
                                {subirArchivo?.file}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Nuevo archivo:</label>
                            <Input className="col-span-3" type="file" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setSubirArchivo(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                mostrarMensajeToast(
                                    "Archivo subido",
                                    "El archivo ha sido subido correctamente"
                                );
                                setSubirArchivo(null);
                            }}
                        >
                            Subir archivo
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={editarFilaEntrega !== null}
                onOpenChange={() => setEditarFilaEntrega(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Fila Completa</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Alumno:</label>
                            <Input
                                className="col-span-3"
                                defaultValue={editarFilaEntrega?.studentName}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Práctica:</label>
                            <Input
                                className="col-span-3"
                                defaultValue={editarFilaEntrega?.practice}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">
                                Fecha de Entrega:
                            </label>
                            <Input
                                className="col-span-3"
                                type="date"
                                defaultValue={editarFilaEntrega?.submissionDate}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Rúbrica:</label>
                            <Input
                                className="col-span-3"
                                defaultValue={editarFilaEntrega?.rubric}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Nota:</label>
                            <Input
                                className="col-span-3"
                                type="number"
                                defaultValue={editarFilaEntrega?.grade}
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Evaluador:</label>
                            <Input
                                className="col-span-3"
                                defaultValue={editarFilaEntrega?.evaluator}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">
                                Archivo actual:
                            </label>
                            <div className="col-span-3">
                                {editarFilaEntrega?.file}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Nuevo archivo:</label>
                            <Input className="col-span-3" type="file" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setEditarFilaEntrega(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                mostrarMensajeToast(
                                    "Fila actualizada",
                                    "La fila ha sido actualizada correctamente"
                                );
                                setEditarFilaEntrega(null);
                            }}
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={insertarEntrega}
                onOpenChange={() => setInsertarEntrega(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insertar Nueva Entrega</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Alumno:</label>
                            <Input
                                className="col-span-3"
                                placeholder="Nombre del alumno"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Práctica:</label>
                            <Input
                                className="col-span-3"
                                placeholder="Nombre de la práctica"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">
                                Fecha de Entrega:
                            </label>
                            <Input className="col-span-3" type="date" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Rúbrica:</label>
                            <Input
                                className="col-span-3"
                                placeholder="Rúbrica aplicable"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Nota:</label>
                            <Input
                                className="col-span-3"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Calificación"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Evaluador:</label>
                            <Input
                                className="col-span-3"
                                placeholder="Nombre del evaluador"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right">Archivo:</label>
                            <Input className="col-span-3" type="file" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setInsertarEntrega(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                mostrarMensajeToast(
                                    "Entrega creada",
                                    "La nueva entrega ha sido creada correctamente"
                                );
                                setInsertarEntrega(false);
                            }}
                        >
                            Guardar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {mostrarToast && (
                <TailwindToast
                    title={mensajeToast.title}
                    description={mensajeToast.description}
                    onClose={() => setMostrarToast(false)}
                />
            )}
        </div>
    );
}
