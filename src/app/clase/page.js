"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Trash2, Pencil } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Clase() {
  const router = useRouter()
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEstudiante, setNewEstudiante] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    rol: "",
    dni: "",
    grupo: "",
    clase: "",
  });
  const [editEstudiante, setEditEstudiante] = useState(null);

  useEffect(() => {
    fetchUsersAndGroupsAndClasses();
  }, []);

  const fetchUsersAndGroupsAndClasses = async () => {
    try {
      const response = await fetch(
        "https://gestionacademicauf4backend-production.up.railway.app/api/fetchUsersAndGroupsAndClasses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      console.log('Fetched data:', data);
      setEstudiantesList(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEstudiante(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit detectado", newEstudiante);


    if (editEstudiante) {
      // Update existing student
      setEstudiantesList((prev) =>
        prev.map((est) =>
          est.id === editEstudiante.id ? { ...est, ...newEstudiante } : est
        )
      );
    } else {
      try {
        const response = await fetch(
          "https://gestionacademicauf4backend-production.up.railway.app/api/insertUsersAndGroupsAndClasses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(newEstudiante),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error en POST:", errorData);
          alert("Error al crear el usuario.");
          return;
        }

        const data = await response.json();
        console.log("Usuario creado:", data);

        setEstudiantesList((prev) => [...prev, data]);
      } catch (error) {
        console.error("Error en fetch:", error);
      }
    }

    setShowModal(false);
    setNewEstudiante({
      name: "",
      surname: "",
      email: "",
      dni: "",
      rol: "",
      grupo: { nombre: "" },
      clase: { nombre: "" },
    });
    setEditEstudiante(null);
  };
  

  const handleClick = () => {
    router.push('/home');
  };

  const handleAddUser = () => {
    console.log("Añadir usuario a la clase")
    setShowModal(true)
    setEditEstudiante(null)
    }

  const handleEditUser = (estudiante) => {
    console.log("Editar usuario:", estudiante)
    setNewEstudiante(estudiante)
    setEditEstudiante(estudiante)
    setShowModal(true)
  }

  const clasesPorGrupo = {
    DAW1: ["T5"],
    DAW2: ["T6"],
    SMX1: ["T7"],
    SMX2: ["T6"],
    ARI1: ["T3"],
    ARI2: ["T1"],
    IEA1: ["T4"],
    IEA2: ["T2"],
    PFI: ["T8"],
  };

  return (
    <main className="container mx-auto py-4 px-4 sm:py-10 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <Button
          onClick={handleClick}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Volver a Home
        </Button>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddUser}
              variant="default"
              className="w-full sm:w-auto"
            >
              Añadir Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editEstudiante ? "Editar Usuario" : "Añadir Usuario"}
              </DialogTitle>
              <DialogDescription>
                {editEstudiante
                  ? "Aquí puedes editar los datos de un usuario existente."
                  : "Aquí puedes añadir un nuevo usuario a la clase."}
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre:</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={newEstudiante.name}
                  onChange={handleInputChange}
                  placeholder="Escribe tu nombre"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="surname">Apellidos:</Label>
                <Input
                  id="surname"
                  type="text"
                  name="surname"
                  value={newEstudiante.surname}
                  onChange={handleInputChange}
                  placeholder="Escribe tus apellidos"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electronico:</Label>
                <Input
                  id="email"
                  type="text"
                  name="email"
                  value={newEstudiante.email}
                  onChange={handleInputChange}
                  placeholder="Escribe tu correo electronico"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Password:</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={newEstudiante.password}
                  onChange={handleInputChange}
                  placeholder="Escribe tu password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dni">DNI:</Label>
                <Input
                  id="dni"
                  type="text"
                  name="dni"
                  value={newEstudiante.dni}
                  onChange={handleInputChange}
                  placeholder="Escribe tu DNI/NIE"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rol">Rol:</Label>
                <Select
                  onValueChange={(value) =>
                    setNewEstudiante({ ...newEstudiante, rol: value })
                  }
                  value={newEstudiante.rol}
                >
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="profesor">Profesor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="grupo">Grupo:</Label>
                <Select
                  onValueChange={(value) =>
                    setNewEstudiante({ ...newEstudiante, grupo: value })
                  }
                  value={newEstudiante.grupo}
                >
                  <SelectTrigger id="grupo">
                    <SelectValue placeholder="Selecciona un grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAW1">DAW1</SelectItem>
                    <SelectItem value="DAW2">DAW2</SelectItem>
                    <SelectItem value="SMX1">SMX1</SelectItem>
                    <SelectItem value="SMX2">SMX2</SelectItem>
                    <SelectItem value="IEA1">IEA1</SelectItem>
                    <SelectItem value="IEA2">IEA2</SelectItem>
                    <SelectItem value="ARI1">ARI1</SelectItem>
                    <SelectItem value="ARI2">ARI2</SelectItem>
                    <SelectItem value="PFI">PFI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="clase">Clase:</Label>
                <Select
                  onValueChange={(value) =>
                    setNewEstudiante({ ...newEstudiante, clase: value })
                  }
                  value={newEstudiante.clase}
                  disabled={!newEstudiante.grupo}
                >
                  <SelectTrigger id="clase">
                    <SelectValue placeholder="Selecciona una clase" />
                  </SelectTrigger>
                  <SelectContent>
                    {(clasesPorGrupo[newEstudiante.grupo] || []).map(
                      (clase) => (
                        <SelectItem key={clase} value={clase}>
                          {clase}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="mt-6">
                <Button type="submit">
                  {editEstudiante ? "Actualizar" : "Guardar"}
                </Button>
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <h1 className="text-2xl font-bold mb-4">Usuarios y Grupos</h1>
      <p className="text-gray-700 mb-6">
        Aquí puedes gestionar los usuarios y grupos de tu sistema.
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead className="hidden sm:table-cell">Nombre</TableHead>
              <TableHead className="hidden sm:table-cell">Apellidos</TableHead>
              <TableHead className="hidden sm:table-cell">
                Correo electronico
              </TableHead>
              <TableHead className="hidden sm:table-cell">Rol</TableHead>
              <TableHead className="hidden sm:table-cell">DNI</TableHead>
              <TableHead className="hidden md:table-cell">Grupo</TableHead>
              <TableHead className="hidden md:table-cell">Clase</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estudiantesList.map((estudiante, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{estudiante.name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {estudiante.surname}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {estudiante.email}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {estudiante.rol}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {estudiante.dni}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {estudiante.grupo?.nombre}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {estudiante.clase?.nombre}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditUser(estudiante)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
