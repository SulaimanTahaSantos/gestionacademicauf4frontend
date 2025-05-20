"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, FileText, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TailwindToast } from "@/misComponents/tailwind-toast";
import { UserProfileDropdown } from "@/misComponents/user-profile-dropdown";

export default function NotasPage() {
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({
        title: "",
        description: "",
    });

    const [notas, setNotas] = useState([
        {
            id: 1,
            alumno: "Juan Pérez",
            evaluador: "Ana Ruiz",
            entrega: "Práctica 1",
            rubrica: "Trabajo en equipo",
            nota: 8.5,
            archivo: {
                nombre: "practica1_juanperez.pdf",
                tipo: "application/pdf",
                url: "/placeholder.svg?height=400&width=300",
            },
            comentarios:
                "Buen trabajo en equipo, pero podría mejorar la comunicación.",
        },
        {
            id: 2,
            alumno: "Ana Ruiz",
            evaluador: "Juan Pérez",
            entrega: "Práctica 1",
            rubrica: "Comunicación",
            nota: 9.0,
            archivo: {
                nombre: "practica1_anaruiz.pdf",
                tipo: "application/pdf",
                url: "/placeholder.svg?height=400&width=300",
            },
            comentarios: "Excelente comunicación y claridad en la exposición.",
        },
    ]);

    const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
    const [editandoNota, setEditandoNota] = useState(null);
    const [mostrarFormularioInsertar, setMostrarFormularioInsertar] =
        useState(false);
    const [nuevaNota, setNuevaNota] = useState({
        alumno: "",
        evaluador: "",
        entrega: "",
        rubrica: "",
        nota: "",
        comentarios: "",
        archivo: null,
    });
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

    const toast = ({ title, description }) => {
        setToastMessage({ title, description });
        setShowToast(true);
    };

    const handleFileUpload = (e, isEditing = false) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileObj = {
            nombre: file.name,
            tipo: file.type,
            url: URL.createObjectURL(file),
        };

        if (isEditing) {
            setEditandoNota({
                ...editandoNota,
                archivo: fileObj,
            });
        } else {
            setNuevaNota({
                ...nuevaNota,
                archivo: fileObj,
            });
        }

        toast({
            title: "Archivo subido",
            description: `${file.name} se ha subido correctamente.`,
        });
    };

    const handleChangeNuevaNota = (e) => {
        const { name, value } = e.target;
        setNuevaNota({
            ...nuevaNota,
            [name]: value,
        });
    };

    const handleInsertarNota = () => {
        if (
            !nuevaNota.alumno ||
            !nuevaNota.evaluador ||
            !nuevaNota.entrega ||
            !nuevaNota.nota
        ) {
            toast({
                title: "Error",
                description:
                    "Por favor, completa todos los campos obligatorios.",
            });
            return;
        }

        const nuevaNotaCompleta = {
            ...nuevaNota,
            id: notas.length > 0 ? Math.max(...notas.map((n) => n.id)) + 1 : 1,
            nota: Number.parseFloat(nuevaNota.nota),
        };

        setNotas([...notas, nuevaNotaCompleta]);
        setNuevaNota({
            alumno: "",
            evaluador: "",
            entrega: "",
            rubrica: "",
            nota: "",
            comentarios: "",
            archivo: null,
        });
        setMostrarFormularioInsertar(false);

        toast({
            title: "Nota insertada",
            description: "La evaluación se ha añadido correctamente.",
        });
    };

    const handleIniciarEdicion = (nota) => {
        if (editandoNota && editandoNota.id === nota.id) {
            setEditandoNota(null);
        } else {
            setEditandoNota({ ...nota });
        }
    };

    const handleChangeEditarNota = (e) => {
        const { name, value } = e.target;
        setEditandoNota({
            ...editandoNota,
            [name]: value,
        });
    };

    const handleGuardarEdicion = () => {
        if (
            !editandoNota.alumno ||
            !editandoNota.evaluador ||
            !editandoNota.entrega ||
            !editandoNota.nota
        ) {
            toast({
                title: "Error",
                description:
                    "Por favor, completa todos los campos obligatorios.",
            });
            return;
        }

        const notasActualizadas = notas.map((nota) =>
            nota.id === editandoNota.id
                ? {
                      ...editandoNota,
                      nota: Number.parseFloat(editandoNota.nota),
                  }
                : nota
        );

        setNotas(notasActualizadas);
        setEditandoNota(null);

        toast({
            title: "Nota actualizada",
            description: "La evaluación se ha actualizado correctamente.",
        });
    };

    const handleEliminar = (id) => {
        setNotas(notas.filter((nota) => nota.id !== id));
        toast({
            title: "Nota eliminada",
            description: "La evaluación se ha eliminado correctamente.",
        });
    };

    const handleVerDetalle = (nota) => {
        setDetalleSeleccionado(nota);
    };

    return (
        <div className="container mx-auto py-6">
            {showToast && (
                <TailwindToast
                    title={toastMessage.title}
                    description={toastMessage.description}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="mb-6">
                <UserProfileDropdown
                    userEmail={userEmail}
                    userImage={userImage}
                    userName={userName}
                    handleSettingsClick={handleSettingsClick}
                    handleHomeClick={handleHomeClick}
                />
            </div>

            <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Notas de Evaluación
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Gestión de evaluaciones de alumnos
                        </CardDescription>
                    </div>
                    <Dialog
                        open={mostrarFormularioInsertar}
                        onOpenChange={setMostrarFormularioInsertar}
                    >
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                                <Plus className="h-4 w-4" />
                                Insertar
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Insertar Nueva Evaluación
                                </DialogTitle>
                                <DialogDescription>
                                    Completa el formulario para añadir una nueva
                                    evaluación.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="alumno"
                                        className="text-right"
                                    >
                                        Alumno*
                                    </Label>
                                    <Input
                                        id="alumno"
                                        name="alumno"
                                        value={nuevaNota.alumno}
                                        onChange={handleChangeNuevaNota}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="evaluador"
                                        className="text-right"
                                    >
                                        Evaluador*
                                    </Label>
                                    <Input
                                        id="evaluador"
                                        name="evaluador"
                                        value={nuevaNota.evaluador}
                                        onChange={handleChangeNuevaNota}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="entrega"
                                        className="text-right"
                                    >
                                        Entrega*
                                    </Label>
                                    <Input
                                        id="entrega"
                                        name="entrega"
                                        value={nuevaNota.entrega}
                                        onChange={handleChangeNuevaNota}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="rubrica"
                                        className="text-right"
                                    >
                                        Rúbrica
                                    </Label>
                                    <Input
                                        id="rubrica"
                                        name="rubrica"
                                        value={nuevaNota.rubrica}
                                        onChange={handleChangeNuevaNota}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="nota"
                                        className="text-right"
                                    >
                                        Nota*
                                    </Label>
                                    <Input
                                        id="nota"
                                        name="nota"
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={nuevaNota.nota}
                                        onChange={handleChangeNuevaNota}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="comentarios"
                                        className="text-right"
                                    >
                                        Comentarios
                                    </Label>
                                    <Input
                                        id="comentarios"
                                        name="comentarios"
                                        value={nuevaNota.comentarios}
                                        onChange={handleChangeNuevaNota}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="archivo"
                                        className="text-right"
                                    >
                                        Archivo
                                    </Label>
                                    <Input
                                        id="archivo"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e)}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setMostrarFormularioInsertar(false)
                                    }
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleInsertarNota}>
                                    Guardar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="font-semibold">
                                        Alumno Evaluado
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        Evaluador
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        Entrega
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        Rúbrica
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        Nota
                                    </TableHead>
                                    <TableHead className="text-right font-semibold">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notas.map((nota) => (
                                    <TableRow
                                        key={nota.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <TableCell className="font-medium">
                                            {nota.alumno}
                                        </TableCell>
                                        <TableCell>{nota.evaluador}</TableCell>
                                        <TableCell>{nota.entrega}</TableCell>
                                        <TableCell>{nota.rubrica}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-md ${
                                                    nota.nota >= 9
                                                        ? "bg-green-100 text-green-800"
                                                        : nota.nota >= 7
                                                        ? "bg-blue-100 text-blue-800"
                                                        : nota.nota >= 5
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {nota.nota}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleVerDetalle(
                                                                    nota
                                                                )
                                                            }
                                                            className="text-primary hover:text-primary hover:bg-primary/10"
                                                        >
                                                            Ver detalle
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[600px]">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Detalle de
                                                                Evaluación
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Información
                                                                completa de la
                                                                evaluación
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {detalleSeleccionado && (
                                                            <Tabs defaultValue="info">
                                                                <TabsList className="grid w-full grid-cols-2">
                                                                    <TabsTrigger value="info">
                                                                        Información
                                                                    </TabsTrigger>
                                                                    <TabsTrigger value="archivo">
                                                                        Archivo
                                                                    </TabsTrigger>
                                                                </TabsList>
                                                                <TabsContent
                                                                    value="info"
                                                                    className="space-y-4"
                                                                >
                                                                    <div className="grid gap-4 py-4">
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="font-medium">
                                                                                Alumno:
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    detalleSeleccionado.alumno
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="font-medium">
                                                                                Evaluador:
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    detalleSeleccionado.evaluador
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="font-medium">
                                                                                Entrega:
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    detalleSeleccionado.entrega
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="font-medium">
                                                                                Rúbrica:
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    detalleSeleccionado.rubrica
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="font-medium">
                                                                                Nota:
                                                                            </div>
                                                                            <div>
                                                                                <span
                                                                                    className={`px-2 py-1 rounded-md ${
                                                                                        detalleSeleccionado.nota >=
                                                                                        9
                                                                                            ? "bg-green-100 text-green-800"
                                                                                            : detalleSeleccionado.nota >=
                                                                                              7
                                                                                            ? "bg-blue-100 text-blue-800"
                                                                                            : detalleSeleccionado.nota >=
                                                                                              5
                                                                                            ? "bg-yellow-100 text-yellow-800"
                                                                                            : "bg-red-100 text-red-800"
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        detalleSeleccionado.nota
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="font-medium">
                                                                                Comentarios:
                                                                            </div>
                                                                            <div>
                                                                                {detalleSeleccionado.comentarios ||
                                                                                    "Sin comentarios"}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TabsContent>
                                                                <TabsContent value="archivo">
                                                                    <div className="flex flex-col items-center gap-4 py-4">
                                                                        {detalleSeleccionado.archivo ? (
                                                                            <>
                                                                                <div className="flex items-center gap-2">
                                                                                    <FileText className="h-5 w-5" />
                                                                                    <span>
                                                                                        {
                                                                                            detalleSeleccionado
                                                                                                .archivo
                                                                                                .nombre
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                <div className="border rounded-md p-2 w-full">
                                                                                    {detalleSeleccionado.archivo.tipo.startsWith(
                                                                                        "image/"
                                                                                    ) ? (
                                                                                        <img
                                                                                            src={
                                                                                                detalleSeleccionado
                                                                                                    .archivo
                                                                                                    .url ||
                                                                                                "/placeholder.svg"
                                                                                            }
                                                                                            alt="Práctica subida"
                                                                                            className="max-w-full h-auto mx-auto"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="flex flex-col items-center gap-4 p-8">
                                                                                            <FileText className="h-16 w-16 text-gray-400" />
                                                                                            <p className="text-center text-sm text-gray-500">
                                                                                                Vista
                                                                                                previa
                                                                                                no
                                                                                                disponible
                                                                                                para
                                                                                                este
                                                                                                tipo
                                                                                                de
                                                                                                archivo
                                                                                            </p>
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                className="gap-2"
                                                                                            >
                                                                                                <Download className="h-4 w-4" />
                                                                                                Descargar
                                                                                                archivo
                                                                                            </Button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <p className="text-center text-sm text-gray-500">
                                                                                No
                                                                                hay
                                                                                archivo
                                                                                adjunto
                                                                                para
                                                                                esta
                                                                                evaluación
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </TabsContent>
                                                            </Tabs>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog
                                                    open={
                                                        editandoNota &&
                                                        editandoNota.id ===
                                                            nota.id
                                                    }
                                                    onOpenChange={(open) => {
                                                        if (!open)
                                                            setEditandoNota(
                                                                null
                                                            );
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleIniciarEdicion(
                                                                    nota
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[500px]">
                                                        {editandoNota && (
                                                            <>
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Editar
                                                                        Evaluación
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Modifica
                                                                        los
                                                                        datos de
                                                                        la
                                                                        evaluación.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label
                                                                            htmlFor="edit-alumno"
                                                                            className="text-right"
                                                                        >
                                                                            Alumno*
                                                                        </Label>
                                                                        <Input
                                                                            id="edit-alumno"
                                                                            name="alumno"
                                                                            value={
                                                                                editandoNota.alumno
                                                                            }
                                                                            onChange={
                                                                                handleChangeEditarNota
                                                                            }
                                                                            className="col-span-3"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label
                                                                            htmlFor="edit-evaluador"
                                                                            className="text-right"
                                                                        >
                                                                            Evaluador*
                                                                        </Label>
                                                                        <Input
                                                                            id="edit-evaluador"
                                                                            name="evaluador"
                                                                            value={
                                                                                editandoNota.evaluador
                                                                            }
                                                                            onChange={
                                                                                handleChangeEditarNota
                                                                            }
                                                                            className="col-span-3"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label
                                                                            htmlFor="edit-entrega"
                                                                            className="text-right"
                                                                        >
                                                                            Entrega*
                                                                        </Label>
                                                                        <Input
                                                                            id="edit-entrega"
                                                                            name="entrega"
                                                                            value={
                                                                                editandoNota.entrega
                                                                            }
                                                                            onChange={
                                                                                handleChangeEditarNota
                                                                            }
                                                                            className="col-span-3"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label
                                                                            htmlFor="edit-rubrica"
                                                                            className="text-right"
                                                                        >
                                                                            Rúbrica
                                                                        </Label>
                                                                        <Input
                                                                            id="edit-rubrica"
                                                                            name="rubrica"
                                                                            value={
                                                                                editandoNota.rubrica
                                                                            }
                                                                            onChange={
                                                                                handleChangeEditarNota
                                                                            }
                                                                            className="col-span-3"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label
                                                                            htmlFor="edit-nota"
                                                                            className="text-right"
                                                                        >
                                                                            Nota*
                                                                        </Label>
                                                                        <Input
                                                                            id="edit-nota"
                                                                            name="nota"
                                                                            type="number"
                                                                            min="0"
                                                                            max="10"
                                                                            step="0.1"
                                                                            value={
                                                                                editandoNota.nota
                                                                            }
                                                                            onChange={
                                                                                handleChangeEditarNota
                                                                            }
                                                                            className="col-span-3"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label
                                                                            htmlFor="edit-comentarios"
                                                                            className="text-right"
                                                                        >
                                                                            Comentarios
                                                                        </Label>
                                                                        <Input
                                                                            id="edit-comentarios"
                                                                            name="comentarios"
                                                                            value={
                                                                                editandoNota.comentarios ||
                                                                                ""
                                                                            }
                                                                            onChange={
                                                                                handleChangeEditarNota
                                                                            }
                                                                            className="col-span-3"
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label
                                                                            htmlFor="edit-archivo"
                                                                            className="text-right"
                                                                        >
                                                                            Archivo
                                                                        </Label>
                                                                        <div className="col-span-3">
                                                                            {editandoNota.archivo && (
                                                                                <div className="flex items-center gap-2 mb-2 text-sm">
                                                                                    <FileText className="h-4 w-4" />
                                                                                    <span>
                                                                                        {
                                                                                            editandoNota
                                                                                                .archivo
                                                                                                .nombre
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            <Input
                                                                                id="edit-archivo"
                                                                                type="file"
                                                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleFileUpload(
                                                                                        e,
                                                                                        true
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            setEditandoNota(
                                                                                null
                                                                            )
                                                                        }
                                                                    >
                                                                        Cancelar
                                                                    </Button>
                                                                    <Button
                                                                        onClick={
                                                                            handleGuardarEdicion
                                                                        }
                                                                    >
                                                                        Guardar
                                                                        cambios
                                                                    </Button>
                                                                </DialogFooter>
                                                            </>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Confirmar
                                                                eliminación
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                ¿Estás seguro de
                                                                que deseas
                                                                eliminar esta
                                                                evaluación? Esta
                                                                acción no se
                                                                puede deshacer.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="mt-4">
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {}}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    handleEliminar(
                                                                        nota.id
                                                                    );
                                                                    document
                                                                        .querySelector(
                                                                            '[role="dialog"]'
                                                                        )
                                                                        .close();
                                                                }}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
