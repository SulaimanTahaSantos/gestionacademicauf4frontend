"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { UserProfileDropdown } from "./user-profile-dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TablaGrupos() {
    const router = useRouter();

    const [grupos, setGrupos] = useState([
        { id: 1, nombre: "2ºDAW1", modulo: "DAW", alumnos: 18 },
        { id: 2, nombre: "2ºASIR2", modulo: "ASIR", alumnos: 20 },
        { id: 3, nombre: "1ºDAM1", modulo: "DAM", alumnos: 22 },
        { id: 4, nombre: "1ºSMR2", modulo: "SMR", alumnos: 25 },
    ]);

    const [users, setUsers] = useState([]);

    const [userEmail, setUserEmail] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [userName, setUserName] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const email = sessionStorage.getItem("userEmail");
        const image = sessionStorage.getItem("userImage");
        const name = sessionStorage.getItem("userName");

        setUserEmail(email || "usuario@ejemplo.com");
        setUserImage(image || "");
        setUserName(name || "Usuario");
    }, []);

    const [verDialogOpen, setVerDialogOpen] = useState(false);
    const [insertarDialogOpen, setInsertarDialogOpen] = useState(false);
    const [editarDialogOpen, setEditarDialogOpen] = useState(false);
    const [eliminarDialogOpen, setEliminarDialogOpen] = useState(false);

    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

    const [nuevoGrupo, setNuevoGrupo] = useState({
        nombre: "",
        modulo: "",
        alumnos: "",
    });

    const handleVer = (grupo) => {
        setGrupoSeleccionado(grupo);
        setVerDialogOpen(true);
    };

    const handleEditar = (grupo) => {
        setGrupoSeleccionado({ ...grupo });
        setEditarDialogOpen(true);
    };

    const handleEliminar = (grupo) => {
        setGrupoSeleccionado(grupo);
        setEliminarDialogOpen(true);
    };

    const confirmarEliminar = () => {
        setGrupos(grupos.filter((grupo) => grupo.id !== grupoSeleccionado.id));
        setEliminarDialogOpen(false);
    };

    const handleInsertar = () => {
        setNuevoGrupo({
            nombre: "",
            modulo: "",
            alumnos: "",
        });
        setInsertarDialogOpen(true);
    };

    const handleGuardarNuevo = () => {
        if (!nuevoGrupo.nombre || !nuevoGrupo.modulo || !nuevoGrupo.alumnos) {
            alert("Por favor, complete todos los campos");
            return;
        }

        const nuevoId = Math.max(...grupos.map((g) => g.id), 0) + 1;
        const grupoCompleto = {
            ...nuevoGrupo,
            id: nuevoId,
            alumnos: Number.parseInt(nuevoGrupo.alumnos),
        };

        setGrupos([...grupos, grupoCompleto]);
        setInsertarDialogOpen(false);
    };

    const handleGuardarEdicion = () => {
        if (
            !grupoSeleccionado.nombre ||
            !grupoSeleccionado.modulo ||
            !grupoSeleccionado.alumnos
        ) {
            alert("Por favor, complete todos los campos");
            return;
        }

        setGrupos(
            grupos.map((grupo) =>
                grupo.id === grupoSeleccionado.id
                    ? {
                          ...grupoSeleccionado,
                          alumnos: Number.parseInt(grupoSeleccionado.alumnos),
                      }
                    : grupo
            )
        );
        setEditarDialogOpen(false);
    };

    const handleNuevoGrupoChange = (e) => {
        const { name, value } = e.target;
        setNuevoGrupo({
            ...nuevoGrupo,
            [name]: value,
        });
    };

    const handleGrupoSeleccionadoChange = (e) => {
        const { name, value } = e.target;
        setGrupoSeleccionado({
            ...grupoSeleccionado,
            [name]: value,
        });
    };

    const handleSettingsClick = () => {
        router.push("/configuracion");
    };

    const handleHomeClick = () => {
        router.push("/home");
    };

    const gruposFiltrados = grupos.filter(
        (grupo) =>
            grupo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grupo.modulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalGrupos = grupos.length;
    const totalAlumnos = grupos.reduce((sum, grupo) => sum + grupo.alumnos, 0);
    const modulosUnicos = [...new Set(grupos.map((grupo) => grupo.modulo))];


  const fetchUsers = async () => {
      try {
          const response = await fetch(
              "https://proyectouf4sulaiman-production-c1ba.up.railway.app/api/users"
          );

         console.log("Response status:", response); 
          let data = await response.json();
          console.log("Fetched users:", data); 
          setUsers(data);
      } catch (error) {
          console.error("Error fetching users:", error.message);
      }
  };

  useEffect(() => {
      fetchUsers(); 
  }, []);


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b shadow-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold">
                        Sistema de Gestión Académica
                    </h1>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Grupos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalGrupos}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Alumnos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalAlumnos}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Módulos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {modulosUnicos.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="mb-6">
                    <CardHeader className="pb-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle>Gestión de Grupos</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Buscar grupos..."
                                        className="pl-8 w-full sm:w-[250px]"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    onClick={handleInsertar}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Insertar
                                    Grupo
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold">
                                            Nombre
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Apellido
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Correo
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            dni
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Rol
                                        </TableHead>
                                        <TableHead className="font-bold text-right">
                                            Creacion
                                        </TableHead>
                                        <TableHead className="font-bold text-right">
                                            Actualizacion
                                        </TableHead>
                                        </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>
                                                {user.surname}
                                            </TableCell>
                                            <TableCell>
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                {user.dni}
                                            </TableCell>
                                            <TableCell>
                                                {user.rol}
                                            </TableCell>
                                            <TableCell>
                                                {user.created_at}
                                            </TableCell>
                                            <TableCell>
                                                {user.updated_at}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold">
                                            Nombre del Grupo
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Módulo
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Alumnos
                                        </TableHead>
                                        <TableHead className="font-bold text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gruposFiltrados.length > 0 ? (
                                        gruposFiltrados.map((grupo) => (
                                            <TableRow key={grupo.id}>
                                                <TableCell className="font-medium">
                                                    {grupo.nombre}
                                                </TableCell>
                                                <TableCell>
                                                    {grupo.modulo}
                                                </TableCell>
                                                <TableCell>
                                                    {grupo.alumnos}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleVer(grupo)
                                                            }
                                                            title="Ver"
                                                        >
                                                            <Eye className="h-4 w-4 text-blue-500" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleEditar(
                                                                    grupo
                                                                )
                                                            }
                                                            title="Editar"
                                                        >
                                                            <Pencil className="h-4 w-4 text-amber-500" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleEliminar(
                                                                    grupo
                                                                )
                                                            }
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-24 text-center"
                                            >
                                                No se encontraron resultados.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <Dialog open={verDialogOpen} onOpenChange={setVerDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalles del Grupo</DialogTitle>
                        <DialogDescription>
                            Información completa del grupo seleccionado.
                        </DialogDescription>
                    </DialogHeader>
                    {grupoSeleccionado && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">ID:</Label>
                                <div className="col-span-3">
                                    {grupoSeleccionado.id}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Nombre:</Label>
                                <div className="col-span-3">
                                    {grupoSeleccionado.nombre}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Módulo:</Label>
                                <div className="col-span-3">
                                    {grupoSeleccionado.modulo}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Alumnos:</Label>
                                <div className="col-span-3">
                                    {grupoSeleccionado.alumnos}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setVerDialogOpen(false)}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={insertarDialogOpen}
                onOpenChange={setInsertarDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insertar Nuevo Grupo</DialogTitle>
                        <DialogDescription>
                            Complete la información para crear un nuevo grupo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                                Nombre:
                            </Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                value={nuevoGrupo.nombre}
                                onChange={handleNuevoGrupoChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modulo" className="text-right">
                                Módulo:
                            </Label>
                            <Input
                                id="modulo"
                                name="modulo"
                                value={nuevoGrupo.modulo}
                                onChange={handleNuevoGrupoChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alumnos" className="text-right">
                                Alumnos:
                            </Label>
                            <Input
                                id="alumnos"
                                name="alumnos"
                                type="number"
                                value={nuevoGrupo.alumnos}
                                onChange={handleNuevoGrupoChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setInsertarDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleGuardarNuevo}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={editarDialogOpen} onOpenChange={setEditarDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Grupo</DialogTitle>
                        <DialogDescription>
                            Modifique la información del grupo.
                        </DialogDescription>
                    </DialogHeader>
                    {grupoSeleccionado && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit-nombre"
                                    className="text-right"
                                >
                                    Nombre:
                                </Label>
                                <Input
                                    id="edit-nombre"
                                    name="nombre"
                                    value={grupoSeleccionado.nombre}
                                    onChange={handleGrupoSeleccionadoChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit-modulo"
                                    className="text-right"
                                >
                                    Módulo:
                                </Label>
                                <Input
                                    id="edit-modulo"
                                    name="modulo"
                                    value={grupoSeleccionado.modulo}
                                    onChange={handleGrupoSeleccionadoChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="edit-alumnos"
                                    className="text-right"
                                >
                                    Alumnos:
                                </Label>
                                <Input
                                    id="edit-alumnos"
                                    name="alumnos"
                                    type="number"
                                    value={grupoSeleccionado.alumnos}
                                    onChange={handleGrupoSeleccionadoChange}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditarDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleGuardarEdicion}>
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={eliminarDialogOpen}
                onOpenChange={setEliminarDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Está seguro de eliminar este grupo?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará
                            permanentemente el grupo
                            {grupoSeleccionado &&
                                ` "${grupoSeleccionado.nombre}"`}{" "}
                            y todos sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmarEliminar}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
