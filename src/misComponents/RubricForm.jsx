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
import { PlusCircle, Trash2, Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RubricForm({ open, onClose, onSave, rubric }) {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        nombre: "",
        practica: "",
        evaluadores: [""],
        evaluacionesRealizadas: 0,
        criterios: [{ nombre: "", descripcion: "", puntuacion: 0 }],
        documento: null,
    });
    const [fileName, setFileName] = useState("");
    const [fileError, setFileError] = useState("");

    useEffect(() => {
        if (rubric) {
            setFormData({
                nombre: rubric.nombre,
                practica: rubric.practica,
                evaluadores: [...rubric.evaluadores],
                evaluacionesRealizadas: rubric.evaluacionesRealizadas,
                criterios: [...rubric.criterios],
                documento: rubric.documento || null,
            });
            setFileName(rubric.documento?.nombre || "");
        } else {
            setFormData({
                nombre: "",
                practica: "",
                evaluadores: [""],
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
        });
    };

    const removeEvaluador = (index) => {
        const newEvaluadores = [...formData.evaluadores];
        newEvaluadores.splice(index, 1);
        setFormData({
            ...formData,
            evaluadores: newEvaluadores,
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
        setFormData({
            ...formData,
            criterios: [
                ...formData.criterios,
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
                                <Input
                                    id="practica"
                                    name="practica"
                                    value={formData.practica}
                                    onChange={handleChange}
                                    required
                                />
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
                                    <Input
                                        value={evaluador}
                                        onChange={(e) =>
                                            handleEvaluadorChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nombre del evaluador"
                                    />
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

                            {formData.criterios.map((criterio, index) => (
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
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {rubric ? "Guardar Cambios" : "Crear Rúbrica"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
