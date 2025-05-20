"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DeleteDialog({
    open,
    onOpenChange,
    enunciado,
    onConfirm,
}) {
    if (!enunciado) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Eliminar Enunciado
                    </DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer. ¿Estás seguro de que
                        quieres eliminar este enunciado?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <p className="font-medium">{enunciado.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                        ID: {enunciado.id}
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
