"use client";

import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2, Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RubricForm({ open, onClose, onSave, rubric, isLoading = false }) {
    const fileInputRef = useRef(null);
    const defaultCriterio = { nombre: "", descripcion: "", puntuacion: 0 };
    const [formData, setFormData] = useState({
        nombre: "",
        practica: "",
        practica_id: "",
        evaluadores: [""],
        evaluador_ids: [""],
        evaluacionesRealizadas: 0,
        criterios: [defaultCriterio],
        documento: null,
    });
    const [fileName, setFileName] = useState("");
    const [fileError, setFileError] = useState("");
    
    const [practices, setPractices] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoadingPractices, setIsLoadingPractices] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
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

    const rol = userData?.data?.rol;

    useEffect(() => {
        if (open && token) {
            fetchPractices();
            fetchUsers();
        }
    }, [open, token]);

    const fetchPractices = async () => {
        if (!token) return;
        
        setIsLoadingPractices(true);
        try {
            const mockPractices = [
                { 
                    id: 1, 
                    titulo: "Desarrollo de API REST", 
                    descripcion: "Crear una API REST utilizando Express.js con autenticación JWT",
                    modulo: "Desarrollo Backend"
                },
                { 
                    id: 2, 
                    titulo: "Diseño de interfaces responsive", 
                    descripcion: "Crear una interfaz adaptable a diferentes dispositivos usando Flexbox y Grid",
                    modulo: "Desarrollo Frontend"
                },
                { 
                    id: 3, 
                    titulo: "Modelado de base de datos", 
                    descripcion: "Diseñar e implementar una base de datos relacional para un sistema de gestión escolar",
                    modulo: "Bases de Datos"
                },
                { 
                    id: 4, 
                    titulo: "Testing y QA", 
                    descripcion: "Pruebas unitarias e integración para aplicaciones web",
                    modulo: "Calidad de Software"
                },
                { 
                    id: 5, 
                    titulo: "Práctica de Redes", 
                    descripcion: "Configuración y administración de redes locales",
                    modulo: "Redes y Comunicaciones"
                }
            ];
            
            
            setPractices(mockPractices);
            console.log("Practices loaded:", mockPractices);
        } catch (error) {
            console.error("Error fetching practices:", error);
            setPractices([]);
        } finally {
            setIsLoadingPractices(false);
        }
    };

    const fetchUsers = async () => {
        if (!token) return;
        
        setIsLoadingUsers(true);
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
                throw new Error("Error al obtener los usuarios");
            }

            const data = await response.json();
            const evaluators = data.filter(user => 
                user.rol === 'profesor' || user.rol === 'teacher' || user.rol === 'evaluador'
            );
            setUsers(evaluators);
            console.log("Users/evaluators loaded:", evaluators);
        } catch (error) {
            console.error("Error fetching users:", error);
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
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (fallbackError) {
                console.error("Error in fallback user fetch:", fallbackError);
            }
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (rubric) {
            console.log("Setting form data for editing rubric:", rubric);
            console.log("Rubric criterios array:", rubric.criterios);
            console.log("Rubric criterios length:", rubric.criterios?.length || 0);
            
            const criteriosToUse = Array.isArray(rubric.criterios) && rubric.criterios.length > 0 
                ? rubric.criterios 
                : [{ nombre: "", descripcion: "", puntuacion: 0 }];
                
            console.log("Using criterios for form:", criteriosToUse);
            
            setFormData({
                nombre: rubric.nombre,
                practica: rubric.practica,
                practica_id: rubric.practica_id ? rubric.practica_id.toString() : "",
                evaluadores: [...rubric.evaluadores],
                evaluador_ids: rubric.evaluador_ids || [""],
                evaluacionesRealizadas: rubric.evaluacionesRealizadas,
                criterios: criteriosToUse,
                documento: rubric.documento || null,
            });
            setFileName(rubric.documento?.nombre || "");
        } else {
            setFormData({
                nombre: "",
                practica: "",
                practica_id: "",
                evaluadores: [""],
                evaluador_ids: [""],
                evaluacionesRealizadas: 0,
                criterios: [{ nombre: "", descripcion: "", puntuacion: 0 }],
                documento: null,
            });
            setFileName("");
        }
        setFileError("");
    }, [rubric, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePracticaSelect = (value) => {
        const selectedPractice = practices.find(p => p.id.toString() === value);
        setFormData({
            ...formData,
            practica_id: value,
            practica: selectedPractice ? selectedPractice.titulo : "",
        });
    };

    const handleEvaluadorSelect = (index, value) => {
        const selectedUser = users.find(u => u.id.toString() === value);
        const newEvaluadores = [...formData.evaluadores];
        const newEvaluadorIds = [...formData.evaluador_ids];
        
        newEvaluadores[index] = selectedUser ? `${selectedUser.name} ${selectedUser.surname}` : "";
        newEvaluadorIds[index] = value;
        
        setFormData({
            ...formData,
            evaluadores: newEvaluadores,
            evaluador_ids: newEvaluadorIds,
        });
    };

    const handleEvaluadorChange = (index, value) => {
        const newEvaluadores = [...formData.evaluadores];
        newEvaluadores[index] = value;
        setFormData({
            ...formData,
            evaluadores: newEvaluadores,
        });
    };

    const addEvaluador = () => {
        setFormData({
            ...formData,
            evaluadores: [...formData.evaluadores, ""],
            evaluador_ids: [...formData.evaluador_ids, ""],
        });
    };

    const removeEvaluador = (index) => {
        const newEvaluadores = [...formData.evaluadores];
        const newEvaluadorIds = [...formData.evaluador_ids];
        newEvaluadores.splice(index, 1);
        newEvaluadorIds.splice(index, 1);
        setFormData({
            ...formData,
            evaluadores: newEvaluadores,
            evaluador_ids: newEvaluadorIds,
        });
    };

    const handleCriterioChange = (index, field, value) => {
        const newCriterios = [...formData.criterios];
        newCriterios[index] = {
            ...newCriterios[index],
            [field]:
                field === "puntuacion" ? Number.parseInt(value) || 0 : value,
        };
        setFormData({
            ...formData,
            criterios: newCriterios,
        });
    };

    const addCriterio = () => {
        const currentCriterios = Array.isArray(formData.criterios) ? formData.criterios : [];
        console.log("Adding new criterio to existing:", currentCriterios);
        
        setFormData({
            ...formData,
            criterios: [
                ...currentCriterios,
                { nombre: "", descripcion: "", puntuacion: 0 },
            ],
        });
    };

    const removeCriterio = (index) => {
        const newCriterios = [...formData.criterios];
        newCriterios.splice(index, 1);
        setFormData({
            ...formData,
            criterios: newCriterios,
        });
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!validTypes.includes(file.type)) {
            setFileError("Solo se permiten archivos PDF, DOC o DOCX");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFileError("El archivo no debe superar los 5MB");
            return;
        }

        setFileError("");
        setFileName(file.name);

        setFormData({
            ...formData,
            documento: {
                nombre: file.name,
                tipo: file.type,
                tamaño: file.size,
                url: URL.createObjectURL(file), 
                fechaSubida: new Date().toISOString(),
            },
        });
    };

    const removeFile = () => {
        setFileName("");
        setFormData({
            ...formData,
            documento: null,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const cleanedData = {
            ...formData,
            evaluadores: formData.evaluadores.filter((e) => e.trim() !== ""),
        };
        onSave(cleanedData);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {rubric ? "Editar Rúbrica" : "Nueva Rúbrica"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">
                                    Nombre de la Rúbrica
                                </Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="practica">
                                    Práctica Asignada
                                </Label>
                                <Select
                                    value={formData.practica_id}
                                    onValueChange={handlePracticaSelect}
                                    disabled={isLoadingPractices}
                                >
                                    <SelectTrigger>
                                        <SelectValue 
                                            placeholder={
                                                isLoadingPractices 
                                                    ? "Cargando prácticas..." 
                                                    : practices.length === 0 
                                                    ? "No hay prácticas disponibles"
                                                    : "Selecciona una práctica"
                                            } 
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {practices.length === 0 && !isLoadingPractices ? (
                                            <SelectItem value="" disabled>
                                                No hay prácticas disponibles
                                            </SelectItem>
                                        ) : (
                                            practices.map((practice) => (
                                                <SelectItem 
                                                    key={practice.id} 
                                                    value={practice.id.toString()}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{practice.titulo}</span>
                                                        {practice.modulo && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {practice.modulo}
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Documento de la Práctica</Label>
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors",
                                    fileError && "border-destructive"
                                )}
                                onClick={handleFileClick}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />

                                {fileName ? (
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <FileText className="h-5 w-5 mr-2 text-primary" />
                                            <span className="text-sm font-medium">
                                                {fileName}
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile();
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Haz clic para subir el documento de
                                            la práctica
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PDF, DOC, DOCX (máx. 5MB)
                                        </p>
                                    </>
                                )}
                            </div>
                            {fileError && (
                                <p className="text-sm text-destructive mt-1">
                                    {fileError}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Evaluadores</Label>
                            {formData.evaluadores.map((evaluador, index) => (
                                <div
                                    key={index}
                                    className="flex gap-2 items-center"
                                >
                                    <Select
                                        value={formData.evaluador_ids[index] || ""}
                                        onValueChange={(value) => handleEvaluadorSelect(index, value)}
                                        disabled={isLoadingUsers}
                                    >
                                        <SelectTrigger>
                                            <SelectValue 
                                                placeholder={
                                                    isLoadingUsers 
                                                        ? "Cargando evaluadores..." 
                                                        : users.length === 0 
                                                        ? "No hay evaluadores disponibles"
                                                        : "Selecciona un evaluador"
                                                } 
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.length === 0 && !isLoadingUsers ? (
                                                <SelectItem value="" disabled>
                                                    No hay evaluadores disponibles
                                                </SelectItem>
                                            ) : (
                                                users.map((user) => (
                                                    <SelectItem 
                                                        key={user.id} 
                                                        value={user.id.toString()}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {user.name} {user.surname}
                                                            </span>
                                                            {user.rol && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {user.rol}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {formData.evaluadores.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                removeEvaluador(index)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addEvaluador}
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Añadir Evaluador
                            </Button>
                        </div>

                        {rubric && (
                            <div className="space-y-2">
                                <Label htmlFor="evaluacionesRealizadas">
                                    Evaluaciones Realizadas
                                </Label>
                                <Input
                                    id="evaluacionesRealizadas"
                                    name="evaluacionesRealizadas"
                                    type="number"
                                    min="0"
                                    value={formData.evaluacionesRealizadas}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>Criterios de Evaluación</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addCriterio}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Añadir Criterio
                                </Button>
                            </div>

                            {console.log("Rendering criterios:", formData.criterios)}
                            {(formData.criterios && Array.isArray(formData.criterios) && formData.criterios.length > 0 
                              ? formData.criterios 
                              : [{ nombre: "", descripcion: "", puntuacion: 0 }]
                            ).map((criterio, index) => (
                                <Card key={index}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-sm font-medium">
                                                Criterio {index + 1}
                                            </CardTitle>
                                            {formData.criterios.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeCriterio(index)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-0">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nombre</Label>
                                                <Input
                                                    value={criterio.nombre}
                                                    onChange={(e) =>
                                                        handleCriterioChange(
                                                            index,
                                                            "nombre",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Ej: Diseño UI/UX"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Puntuación Máxima</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={criterio.puntuacion}
                                                    onChange={(e) =>
                                                        handleCriterioChange(
                                                            index,
                                                            "puntuacion",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Descripción</Label>
                                            <Input
                                                value={criterio.descripcion}
                                                onChange={(e) =>
                                                    handleCriterioChange(
                                                        index,
                                                        "descripcion",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Descripción del criterio"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Guardando..." : (rubric ? "Guardar Cambios" : "Crear Rúbrica")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
