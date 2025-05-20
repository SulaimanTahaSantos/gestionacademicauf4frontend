"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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
    AlignLeft,
    Download,
} from "lucide-react";

export default function ViewDialog({
    open,
    onOpenChange,
    enunciado,
    onDownload,
}) {
    if (!enunciado) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Detalles del Enunciado</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-start">
                        <Id className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Identificador</h3>
                            <p>{enunciado.id}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <FileText className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Título</h3>
                            <p>{enunciado.titulo}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <AlignLeft className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Descripción</h3>
                            <p>{enunciado.descripcion}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <BookOpen className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Módulo</h3>
                            <p>{enunciado.modulo}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <TestTube className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Práctica</h3>
                            <p>{enunciado.practica}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <User className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Profesor</h3>
                            <p>{enunciado.profesor}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Calendar className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Fecha de entrega</h3>
                            <p>
                                {new Date(
                                    enunciado.fechaEntrega
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Paperclip className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Rúbrica vinculada</h3>
                            <p>{enunciado.rubrica}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Users className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                            <h3 className="font-medium">Grupo destinatario</h3>
                            <p>{enunciado.grupo}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cerrar
                    </Button>
                    <Button onClick={() => onDownload(enunciado)}>
                        <Download className="mr-2 h-4 w-4" /> Descargar práctica
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
