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
import { useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ModulesTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [modules, setModules] = useState([]);
       

    const [newModule, setNewModule] = useState({
        codigo: "",
        nombre: "",
        descripcion: "",
        grupo_id: "",
        user_id: "",
    });
    const [editingModule, setEditingModule] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [groups, setGroups] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [isClient, setIsClient] = useState(false);

    const rol = isClient ? userData?.data?.rol : null;
    const name = userData?.data?.name || '';
    const surname = userData?.data?.surname || '';
    const email = userData?.data?.email || '';
    const url = userData?.data?.url || '';




    const router = useRouter();

    const fetchModules = async () => {
        if (!token) {
          alert("No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.");
          router.push("/login");
            return;
        }
        
        try{
            const endpoint = rol === 'profesor' 
                ? "https://gestionacademicauf4backend-production.up.railway.app/api/profesor/modulos"
                : "https://gestionacademicauf4backend-production.up.railway.app/api/modulos";
                
            const response = await fetch(
              endpoint,
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
                throw new Error("Error al obtener los módulos");
            }

            const data = await response.json();
            setModules(data.data);
            console.log("Módulos obtenidos:", data);
            console.log("Módulos obtenidosv2:", data.data);


        }catch (error) {
            console.error("Error fetching modules:", error);
            }
        }

    const fetchGroups = async () => {
        if (!token) {
          alert("No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.");
          router.push("/login");
            return;
        }
        
        try {
            const response = await fetch(
                "https://gestionacademicauf4backend-production.up.railway.app/api/fetchUsersAndGroupsAndClasses",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Error al obtener los grupos");
            }

            const data = await response.json();
            const uniqueGroups = [];
            const groupNames = new Set();
            
            data.forEach(user => {
                if (user.grupo && !groupNames.has(user.grupo.nombre)) {
                    uniqueGroups.push({
                        id: user.grupo.id || user.grupo.nombre,
                        nombre: user.grupo.nombre
                    });
                    groupNames.add(user.grupo.nombre);
                }
            });
            
            setGroups(uniqueGroups);
            console.log("Grupos obtenidos:", uniqueGroups);

        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    const fetchProfessors = async () => {
        if (!token) {
            console.warn("No token available, skipping professors fetch");
            return;
        }
        
        try {
            const response = await fetch(
                "https://gestionacademicauf4backend-production.up.railway.app/api/fetchUsersAndGroupsAndClasses",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Error al obtener los profesores");
            }

            const data = await response.json();
            const professorsList = data.filter(user => user.rol === 'profesor');
            setProfessors(professorsList);
            console.log("Profesores obtenidos:", professorsList);

        } catch (error) {
            console.error("Error fetching professors:", error);
        }
    };

    useEffect(() => {
        setIsClient(true);
        
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem("token");
            const storedUserData = localStorage.getItem("userData");
            
            setToken(storedToken);
            if (storedUserData) {
                try {
                    setUserData(JSON.parse(storedUserData));
                } catch (error) {
                    console.error("Error parsing userData from localStorage:", error);
                    setUserData(null);
                }
            }
        }
    }, []);

    useEffect(() => {
      if(token && isClient){
        fetchModules();
        fetchGroups();
        fetchProfessors();
      } else if (token === "" || (token === null && typeof window !== 'undefined')) {
        console.warn("Token no encontrado, redirigiendo a inicio de sesión");
      }
    }, [token, isClient, rol]); 

    useEffect(() => {
        if (isClient && rol === 'profesor' && professors.length > 0 && userData?.data?.id) {
            const currentProfessor = professors.find(prof => prof.id === userData.data.id);
            if (currentProfessor && !newModule.user_id) {
                setNewModule(prev => ({
                    ...prev,
                    user_id: currentProfessor.id.toString()
                }));
            }
        }
    }, [isClient, rol, professors, userData, newModule.user_id]);



    const filteredModules = modules.filter(
        (module) => {
            const searchLower = searchTerm.toLowerCase();
            return (
              (module.modulo_codigo || "")
                .toLowerCase()
                .includes(searchLower) ||
              (module?.modulo_nombre || "")
                .toLowerCase()
                .includes(searchLower) ||
              (module?.modulo_descripcion || "")
                .toLowerCase()
                .includes(searchLower) ||
              (module?.grupo_nombre || "")
                .toLowerCase()
                .includes(searchLower) ||
              (module?.profesor_name + module?.profesor_surname || "").toLowerCase().includes(searchLower) ||
              (module?.modulo_id || "").toString().toLowerCase().includes(searchLower)
            );
        }
    );

    const handleNewModuleChange = (e) => {
        const { name, value } = e.target;
        setNewModule({
            ...newModule,
            [name]: value,
        });
    };

    const handleSelectChange = (name, value) => {
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

    const handleEditSelectChange = (name, value) => {
        setEditingModule({
            ...editingModule,
            [name]: value,
        });
    };

    const handleAddModule = async () => {
        try {
            const endpoint = rol === 'profesor' 
                ? "https://gestionacademicauf4backend-production.up.railway.app/api/profesor/modulos"
                : "https://gestionacademicauf4backend-production.up.railway.app/api/modulos";
                
            const response = await fetch(
                endpoint,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newModule),
                }
            );

            if (!response.ok) {
                throw new Error("Error al crear el módulo");
            }

            const data = await response.json();
            console.log("Módulo creado exitosamente:", data);

            await fetchModules();
            
            setNewModule({
                codigo: "",
                nombre: "",
                descripcion: "",
                grupo_id: "",
                user_id: "",
            });
            
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Error creating module:", error);
            alert("Error al crear el módulo. Por favor, inténtelo de nuevo.");
        }
    };

    const handleEditModule = async () => {
        try {
            if (!editingModule.modulo_codigo || !editingModule.modulo_nombre || !editingModule.grupo_id || !editingModule.user_id) {
                alert("Por favor, complete todos los campos requeridos.");
                return;
            }

            console.log("Editing module with data:", {
                id: editingModule.modulo_id,
                codigo: editingModule.modulo_codigo,
                nombre: editingModule.modulo_nombre,
                descripcion: editingModule.modulo_descripcion,
                grupo_id: editingModule.grupo_id,
                user_id: editingModule.user_id,
            });

            const endpoint = rol === 'profesor' 
                ? `https://gestionacademicauf4backend-production.up.railway.app/api/profesor/modulos/${editingModule.id}`
                : `https://gestionacademicauf4backend-production.up.railway.app/api/modulos/${editingModule.id}`;
                
            const response = await fetch(
                endpoint,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        codigo: editingModule.modulo_codigo,
                        nombre: editingModule.modulo_nombre,
                        descripcion: editingModule.modulo_descripcion,
                        grupo_id: editingModule.grupo_id,
                        user_id: editingModule.user_id,
                    }),
                }
            );


            if (!response.ok) {
                const errorData = await response.text();
                console.log("Error response:", errorData);
                throw new Error(`Error al actualizar el módulo: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            console.log("Módulo actualizado exitosamente:", data);

            await fetchModules();

            setEditingModule(null);
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating module:", error);
            alert(`Error al actualizar el módulo: ${error.message}`);
        }
    };

    const handleDeleteModule = async () => {
        try {
            const endpoint = rol === 'profesor' 
                ? `https://gestionacademicauf4backend-production.up.railway.app/api/profesor/modulos/${moduleToDelete.id}`
                : `https://gestionacademicauf4backend-production.up.railway.app/api/modulos/${moduleToDelete.id}`;
                
            const response = await fetch(
                endpoint,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Error al eliminar el modulo");
            }


            await fetchModules();

            setModuleToDelete(null);
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error deleting module:", error);
            alert("Error al eliminar el módulo. Por favor, inténtelo de nuevo.");
        }
    };

    const openEditDialog = (module) => {
        if (groups.length === 0 || professors.length === 0) {
            console.warn("Groups or professors not loaded yet");
            return;
        }

        const selectedGroup = groups.find(group => 
            group.nombre?.trim().toLowerCase() === module.grupo_nombre?.trim().toLowerCase()
        );
        
        const selectedProfessor = professors.find(professor => {
            const professorFullName = `${professor.name || ''} ${professor.surname || ''}`.trim();
            const moduleFullName = `${module.profesor_name || ''} ${module.profesor_surname || ''}`.trim();
            return professorFullName.toLowerCase() === moduleFullName.toLowerCase();
        });

     
        const editingModuleData = { 
            ...module,
            id: module.modulo_id, 
            grupo_id: selectedGroup ? selectedGroup.id.toString() : "",
            user_id: selectedProfessor ? selectedProfessor.id.toString() : ""
        };

        console.log("Final editing module data:", editingModuleData);

        setEditingModule(editingModuleData);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (module) => {
        setModuleToDelete({
            ...module,
            id: module.modulo_id
        });
        setIsDeleteDialogOpen(true);
    };

    const handleSettingsClick = () => {
        router.push("/configuracion");
    };



    return (
      <>
        <Navbar
          userEmail={email}
          userImage={url}
          userName={`${name} ${surname}`}
          handleSettingsClick={handleSettingsClick}
        />

        <div className="p-4 space-y-4">
          <div className="bg-white pb-4 mb-6">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                  <h1 className="text-2xl font-bold">
                    Módulos Académicos
                    {rol === "profesor" && (
                      <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                        Vista Profesor
                      </span>
                    )}
                  </h1>
                </div>

                {rol !== "user" && (
                  <div className="flex items-center gap-4">
                    <Dialog
                      open={isAddDialogOpen}
                      onOpenChange={setIsAddDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                          <Plus className="h-4 w-4" /> Agregar Módulo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>
                            {rol === "profesor"
                              ? "Agregar Nuevo Módulo (Como Profesor)"
                              : "Agregar Nuevo Módulo"}
                          </DialogTitle>
                          <DialogDescription>
                            {rol === "profesor"
                              ? "Complete el formulario para agregar un nuevo módulo. Como profesor, usted será asignado automáticamente."
                              : "Complete el formulario para agregar un nuevo módulo académico."}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="codigo" className="text-right">
                              Código
                            </Label>
                            <Input
                              id="codigo"
                              name="codigo"
                              value={newModule.codigo}
                              onChange={handleNewModuleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                              Nombre
                            </Label>
                            <Input
                              id="nombre"
                              name="nombre"
                              value={newModule.nombre}
                              onChange={handleNewModuleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="descripcion" className="text-right">
                              Descripción
                            </Label>
                            <Input
                              id="descripcion"
                              name="descripcion"
                              value={newModule.descripcion}
                              onChange={handleNewModuleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="grupo_id" className="text-right">
                              Grupo
                            </Label>
                            <Select
                              value={newModule.grupo_id}
                              onValueChange={(value) =>
                                handleSelectChange("grupo_id", value)
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Seleccionar grupo" />
                              </SelectTrigger>
                              <SelectContent>
                                {groups.map((group) => (
                                  <SelectItem
                                    key={group.id}
                                    value={group.id.toString()}
                                  >
                                    {group.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="user_id" className="text-right">
                              Profesor{" "}
                              {rol === "profesor" && (
                                <span className="text-xs text-blue-600">
                                  (Auto-seleccionado)
                                </span>
                              )}
                            </Label>
                            <Select
                              value={newModule.user_id}
                              onValueChange={(value) =>
                                handleSelectChange("user_id", value)
                              }
                              disabled={rol === "profesor"}
                            >
                              <SelectTrigger
                                className={`col-span-3 ${
                                  rol === "profesor"
                                    ? "bg-blue-50 border-blue-200"
                                    : ""
                                }`}
                              >
                                <SelectValue placeholder="Seleccionar profesor" />
                              </SelectTrigger>
                              <SelectContent>
                                {professors.map((professor) => (
                                  <SelectItem
                                    key={professor.id}
                                    value={professor.id.toString()}
                                  >
                                    {professor.name} {professor.surname}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleAddModule}>
                            Guardar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
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
                      Grupo del modulo
                    </TableHead>
                    <TableHead className="font-semibold">Profesor</TableHead>
                    {rol !== "user" && (
                      <TableHead className="text-right font-semibold">
                        Acciones
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.length > 0 ? (
                    filteredModules.map((module, index) => (
                      <TableRow
                        key={module.modulo_id}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <TableCell className="font-medium text-emerald-700">
                          {module.modulo_codigo}
                        </TableCell>
                        <TableCell>{module.modulo_nombre}</TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {module.modulo_descripcion}
                        </TableCell>
                        <TableCell>{module.grupo_nombre}</TableCell>
                        <TableCell>
                          {module.profesor_name} {module.profesor_surname}
                        </TableCell>
                        <TableCell className="text-right">
                          {rol !==
                            "user" && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(module)}
                                  className="hover:bg-slate-100"
                                >
                                  <Pencil className="h-4 w-4 text-slate-600" />
                                  <span className="sr-only">Editar</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(module)}
                                  className="hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">Eliminar</span>
                                </Button>
                              </div>
                            )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-slate-500"
                      >
                        No se encontraron resultados para su búsqueda.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {rol === "profesor"
                    ? "Editar Módulo (Como Profesor)"
                    : "Editar Módulo"}
                </DialogTitle>
                <DialogDescription>
                  {rol === "profesor"
                    ? "Actualice la información de su módulo académico."
                    : "Actualice la información del módulo académico."}
                </DialogDescription>
              </DialogHeader>
              {editingModule && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-codigo" className="text-right">
                      Código
                    </Label>
                    <Input
                      id="edit-codigo"
                      name="modulo_codigo"
                      value={editingModule.modulo_codigo || ""}
                      onChange={handleEditModuleChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-nombre" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="edit-nombre"
                      name="modulo_nombre"
                      value={editingModule.modulo_nombre || ""}
                      onChange={handleEditModuleChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-descripcion" className="text-right">
                      Descripción
                    </Label>
                    <Input
                      id="edit-descripcion"
                      name="modulo_descripcion"
                      value={editingModule.modulo_descripcion || ""}
                      onChange={handleEditModuleChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-grupo" className="text-right">
                      Grupo
                    </Label>
                    <Select
                      value={editingModule.grupo_id?.toString() || ""}
                      onValueChange={(value) =>
                        handleEditSelectChange("grupo_id", value)
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem
                            key={group.id}
                            value={group.id.toString()}
                          >
                            {group.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-profesor" className="text-right">
                      Profesor{" "}
                      {rol === "profesor" && (
                        <span className="text-xs text-blue-600">
                          (Tu módulo)
                        </span>
                      )}
                    </Label>
                    <Select
                      value={editingModule.user_id?.toString() || ""}
                      onValueChange={(value) =>
                        handleEditSelectChange("user_id", value)
                      }
                      disabled={rol === "profesor"}
                    >
                      <SelectTrigger
                        className={`col-span-3 ${
                          rol === "profesor" ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <SelectValue placeholder="Seleccionar profesor" />
                      </SelectTrigger>
                      <SelectContent>
                        {professors.map((professor) => (
                          <SelectItem
                            key={professor.id}
                            value={professor.id.toString()}
                          >
                            {professor.name} {professor.surname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  permanentemente el módulo {moduleToDelete?.modulo_codigo} -{" "}
                  {moduleToDelete?.modulo_nombre}.
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
      </>
    );
}
