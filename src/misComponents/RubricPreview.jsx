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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FileText, Users, ClipboardCheck, Download, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RubricPreview({ open, onClose, rubric }) {
    if (!rubric) return null;

    const totalPuntuacion = rubric.criterios.reduce(
        (sum, criterio) => sum + criterio.puntuacion,
        0
    );

    const handleDownload = () => {
        // En un entorno real, esto descargaría el archivo desde el servidor
        // Para este ejemplo, simplemente abrimos la URL (que es un blob temporal)
        if (rubric.documento?.url) {
            window.open(rubric.documento.url, "_blank");
        }
    };

    // Función para formatear el tamaño del archivo
    const formatFileSize = (bytes) => {
        if (!bytes) return "";
        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${kb.toFixed(1)} KB`;
        } else {
            return `${(kb / 1024).toFixed(1)} MB`;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>Vista Previa de Rúbrica</DialogTitle>
                </DialogHeader>

                <div className="py-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {rubric.nombre}
                            </h2>
                            <div className="flex items-center mt-1 text-muted-foreground">
                                <FileText className="h-4 w-4 mr-2" />
                                {rubric.practica}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                <span className="text-sm text-muted-foreground">
                                    {rubric.evaluadores.length}{" "}
                                    {rubric.evaluadores.length === 1
                                        ? "evaluador"
                                        : "evaluadores"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <ClipboardCheck className="h-4 w-4 mr-2" />
                                <span className="text-sm text-muted-foreground">
                                    {rubric.evaluacionesRealizadas} evaluaciones
                                    realizadas
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sección de documento */}
                    {rubric.documento && (
                        <div className="mb-4 p-3 bg-muted/30 rounded-md border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <File className="h-5 w-5 mr-2 text-primary" />
                                    <div>
                                        <p className="font-medium text-sm">
                                            {rubric.documento.nombre}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(
                                                rubric.documento.tamaño
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleDownload}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Descargar
                                </Button>
                            </div>
                        </div>
                    )}

                    <h3 className="text-lg font-semibold mb-2">
                        Criterios de Evaluación
                    </h3>
                    <div className="border rounded-md mb-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[30%]">
                                        Criterio
                                    </TableHead>
                                    <TableHead className="w-[50%]">
                                        Descripción
                                    </TableHead>
                                    <TableHead className="text-right w-[20%]">
                                        Puntuación
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rubric.criterios.map((criterio, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium py-2">
                                            {criterio.nombre}
                                        </TableCell>
                                        <TableCell className="py-2">
                                            {criterio.descripcion}
                                        </TableCell>
                                        <TableCell className="text-right py-2">
                                            {criterio.puntuacion} pts
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell
                                        colSpan={2}
                                        className="text-right font-bold py-2"
                                    >
                                        Total
                                    </TableCell>
                                    <TableCell className="text-right font-bold py-2">
                                        {totalPuntuacion} pts
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3">
                        <div>
                            <h4 className="font-semibold mb-1">Evaluadores:</h4>
                            <ul className="list-disc pl-5 space-y-0.5">
                                {rubric.evaluadores.map((evaluador, index) => (
                                    <li key={index} className="text-sm">
                                        {evaluador}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Badge variant="outline" className="text-base">
                            Puntuación máxima: {totalPuntuacion} puntos
                        </Badge>
                    </div>
                </div>

                <DialogFooter className="mt-2">
                    <Button onClick={onClose}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
