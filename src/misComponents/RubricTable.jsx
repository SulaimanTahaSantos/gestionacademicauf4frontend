"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Users, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RubricTable({ rubrics, onEdit, onDelete, onPreview }) {
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre Rúbrica</TableHead>
                        <TableHead>Práctica Asignada</TableHead>
                        <TableHead>Evaluadores</TableHead>
                        <TableHead className="text-center">
                            Evaluaciones Realizadas
                        </TableHead>
                        <TableHead className="text-center">Documento</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rubrics.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-center py-10 text-muted-foreground"
                            >
                                No hay rúbricas disponibles. Crea una nueva
                                rúbrica para comenzar.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rubrics.map((rubric) => (
                            <TableRow key={rubric.id}>
                                <TableCell className="font-medium">
                                    {rubric.nombre}
                                </TableCell>
                                <TableCell>{rubric.practica}</TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                        {rubric.evaluadores.length > 1 ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge variant="outline">
                                                            {
                                                                rubric
                                                                    .evaluadores
                                                                    .length
                                                            }{" "}
                                                            evaluadores
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <ul className="list-disc pl-5">
                                                            {rubric.evaluadores.map(
                                                                (
                                                                    evaluador,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {
                                                                            evaluador
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            rubric.evaluadores[0]
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="secondary">
                                        {rubric.evaluacionesRealizadas}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {rubric.documento ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-primary/10"
                                                    >
                                                        <FileText className="h-3 w-3 mr-1" />
                                                        Disponible
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {
                                                            rubric.documento
                                                                .nombre
                                                        }
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="text-muted-foreground"
                                        >
                                            No disponible
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onPreview(rubric)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onEdit(rubric)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => onDelete(rubric.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
