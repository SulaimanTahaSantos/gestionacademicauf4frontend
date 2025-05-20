"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";

export default function EditDialog({ open, onOpenChange, enunciado, onSave }) {
    const [formData, setFormData] = useState({
        id: "",
        titulo: "",
        descripcion: "",
        modulo: "",
        practica: "",
        profesor: "",
        fechaEntrega: "",
        rubrica: "",
        grupo: "",
    });

    useEffect(() => {
        if (enunciado) {
            setFormData({
                ...enunciado,
                fechaEntrega: enunciado.fechaEntrega
                    ? enunciado.fechaEntrega.split("T")[0]
                    : "",
            });
        }
    }, [enunciado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Enunciado</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="titulo" className="text-right">
                                Título
                            </Label>
                            <Input
                                id="titulo"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="descripcion" className="text-right">
                                Descripción
                            </Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modulo" className="text-right">
                                Módulo
                            </Label>
                            <Input
                                id="modulo"
                                name="modulo"
                                value={formData.modulo}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="practica" className="text-right">
                                Práctica
                            </Label>
                            <Input
                                id="practica"
                                name="practica"
                                value={formData.practica}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="profesor" className="text-right">
                                Profesor
                            </Label>
                            <Input
                                id="profesor"
                                name="profesor"
                                value={formData.profesor}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="fechaEntrega"
                                className="text-right"
                            >
                                Fecha de entrega
                            </Label>
                            <Input
                                id="fechaEntrega"
                                name="fechaEntrega"
                                type="date"
                                value={formData.fechaEntrega}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rubrica" className="text-right">
                                Rúbrica
                            </Label>
                            <Input
                                id="rubrica"
                                name="rubrica"
                                value={formData.rubrica}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="grupo" className="text-right">
                                Grupo
                            </Label>
                            <Input
                                id="grupo"
                                name="grupo"
                                value={formData.grupo}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">Guardar cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
