"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Upload,
    Download,
    Check,
    AlertCircle,
    Trash,
    FileText,
    Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AssignDialog({
    open,
    onOpenChange,
    enunciado,
    onSave,
    onDownload,
}) {
    const [formData, setFormData] = useState({
        rubrica: "",
        grupo: "",
    });

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(null); 
    const [uploadMessage, setUploadMessage] = useState("");

    // Estado para la práctica ya subida
    const [submittedPractice, setSubmittedPractice] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (enunciado) {
            setFormData({
                rubrica: enunciado.rubrica || "",
                grupo: enunciado.grupo || "",
            });

            if (enunciado.id === "ENS001") {
                setSubmittedPractice({
                    id: "PRAC001",
                    fileName: "practica_api_rest.pdf",
                    fileSize: "2.4 MB",
                    uploadDate: "2023-11-15T14:30:00",
                    fileType: "pdf",
                });
            } else if (enunciado.id === "ENS002") {
                setSubmittedPractice({
                    id: "PRAC002",
                    fileName: "diseno_responsive.zip",
                    fileSize: "4.7 MB",
                    uploadDate: "2023-11-10T09:15:00",
                    fileType: "zip",
                });
            } else {
                setSubmittedPractice(null);
            }
        }

        setFile(null);
        setUploading(false);
        setUploadProgress(0);
        setUploadStatus(null);
        setUploadMessage("");
        setDeleting(false);
    }, [enunciado, open]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setUploadStatus(null);
            setUploadMessage("");
        }
    };

    const handleSubmit = () => {
        if (!enunciado) return;

        onSave({
            ...enunciado,
            rubrica: formData.rubrica,
            grupo: formData.grupo,
        });
    };

    const handleUpload = async () => {
        if (!file || !enunciado) return;

        try {
            setUploading(true);
            setUploadProgress(0);
            setUploadStatus(null);
            setUploadMessage("");

            const totalSteps = 10;
            for (let i = 1; i <= totalSteps; i++) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                setUploadProgress(Math.floor((i / totalSteps) * 100));
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("enunciadoId", enunciado.id);

            await new Promise((resolve) => setTimeout(resolve, 500));

            setUploadStatus("success");
            setUploadMessage(
                `Práctica "${file.name}" subida correctamente para el enunciado "${enunciado.titulo}"`
            );

            setSubmittedPractice({
                id: `PRAC${Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(3, "0")}`,
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                uploadDate: new Date().toISOString(),
                fileType: getFileType(file.name),
            });

            setFile(null);
        } catch (error) {
            console.error("Error al subir el archivo:", error);
            setUploadStatus("error");
            setUploadMessage(
                "Error al subir el archivo. Por favor, inténtalo de nuevo."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePractice = async () => {
        if (!submittedPractice) return;

        try {
            setDeleting(true);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            setSubmittedPractice(null);
            setUploadStatus("success");
            setUploadMessage(
                "Práctica eliminada correctamente. Ahora puedes subir una nueva."
            );
        } catch (error) {
            console.error("Error al eliminar la práctica:", error);
            setUploadStatus("error");
            setUploadMessage(
                "Error al eliminar la práctica. Por favor, inténtalo de nuevo."
            );
        } finally {
            setDeleting(false);
        }
    };

    if (!enunciado) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        Gestionar Enunciado: {enunciado.titulo}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="assign">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="assign">Asignar</TabsTrigger>
                        <TabsTrigger value="upload">Subir Práctica</TabsTrigger>
                    </TabsList>

                    <TabsContent value="assign" className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="rubrica-select"
                                className="text-right"
                            >
                                Rúbrica
                            </Label>
                            <Select
                                value={formData.rubrica}
                                onValueChange={(value) =>
                                    handleChange("rubrica", value)
                                }
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar rúbrica" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Rúbrica API REST">
                                        Rúbrica API REST
                                    </SelectItem>
                                    <SelectItem value="Rúbrica Diseño Web">
                                        Rúbrica Diseño Web
                                    </SelectItem>
                                    <SelectItem value="Rúbrica BBDD">
                                        Rúbrica BBDD
                                    </SelectItem>
                                    <SelectItem value="Rúbrica Programación">
                                        Rúbrica Programación
                                    </SelectItem>
                                    <SelectItem value="Rúbrica Sistemas">
                                        Rúbrica Sistemas
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="grupo-select"
                                className="text-right"
                            >
                                Grupo
                            </Label>
                            <Select
                                value={formData.grupo}
                                onValueChange={(value) =>
                                    handleChange("grupo", value)
                                }
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar grupo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DAW1">DAW1</SelectItem>
                                    <SelectItem value="DAW2">DAW2</SelectItem>
                                    <SelectItem value="ASIR1">ASIR1</SelectItem>
                                    <SelectItem value="ASIR2">ASIR2</SelectItem>
                                    <SelectItem value="DAW1, DAW2">
                                        DAW1, DAW2
                                    </SelectItem>
                                    <SelectItem value="DAW2, ASIR1">
                                        DAW2, ASIR1
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit}>
                                Guardar asignación
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-4 py-4">
                        <div className="grid gap-4">
                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 space-y-2">
                                <Download className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Descarga la práctica actual
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => onDownload(enunciado)}
                                >
                                    <Download className="mr-2 h-4 w-4" />{" "}
                                    Descargar práctica
                                </Button>
                            </div>

                            {submittedPractice && (
                                <div className="border rounded-lg p-4 bg-muted/30">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium">
                                            Práctica ya subida
                                        </h3>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDeletePractice}
                                            disabled={deleting}
                                        >
                                            <Trash className="h-4 w-4 mr-1" />
                                            {deleting
                                                ? "Eliminando..."
                                                : "Eliminar"}
                                        </Button>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <FileIcon
                                            fileType={
                                                submittedPractice.fileType
                                            }
                                            size="lg"
                                        />

                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {submittedPractice.fileName}
                                            </p>
                                            <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-3">
                                                <span>
                                                    {submittedPractice.fileSize}
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {formatDate(
                                                        submittedPractice.uploadDate
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(!submittedPractice || file) && (
                                <>
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 space-y-2">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {submittedPractice
                                                ? "Sube una nueva práctica para reemplazar la actual"
                                                : "Sube tu práctica completada"}
                                        </p>
                                        <Input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.zip,.rar"
                                        />
                                        <Label
                                            htmlFor="file-upload"
                                            className="cursor-pointer"
                                        >
                                            <Button
                                                variant="outline"
                                                type="button"
                                            >
                                                Seleccionar archivo
                                            </Button>
                                        </Label>
                                        {file && (
                                            <div className="flex items-center gap-2">
                                                <FileIcon
                                                    fileType={getFileType(
                                                        file.name
                                                    )}
                                                />
                                                <p className="text-sm">
                                                    {file.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Barra de progreso */}
                                    {uploading && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Subiendo...</span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <Progress
                                                value={uploadProgress}
                                                className="h-2"
                                            />
                                        </div>
                                    )}

                                    {/* Botón de subida */}
                                    <Button
                                        onClick={handleUpload}
                                        disabled={!file || uploading}
                                        className={
                                            uploadStatus === "success"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : ""
                                        }
                                    >
                                        {uploadStatus === "success" ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />{" "}
                                                Subida completada
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />{" "}
                                                {uploading
                                                    ? "Subiendo..."
                                                    : "Subir práctica"}
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}

                            {/* Mensaje de estado */}
                            {uploadStatus && (
                                <Alert
                                    variant={
                                        uploadStatus === "success"
                                            ? "default"
                                            : "destructive"
                                    }
                                >
                                    {uploadStatus === "success" ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4" />
                                    )}
                                    <AlertDescription>
                                        {uploadMessage}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

// Componente para mostrar un icono según el tipo de archivo
function FileIcon({ fileType, size = "md" }) {
    const getIconColor = () => {
        switch (fileType) {
            case "pdf":
                return "text-red-500";
            case "doc":
            case "docx":
                return "text-blue-500";
            case "zip":
            case "rar":
                return "text-yellow-500";
            default:
                return "text-gray-500";
        }
    };

    const sizeClass = size === "lg" ? "w-10 h-10" : "w-5 h-5";
    const iconSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";

    return (
        <div
            className={`flex items-center justify-center ${sizeClass} ${getIconColor()}`}
        >
            <FileText className={iconSize} />
        </div>
    );
}

// Función para obtener el tipo de archivo a partir del nombre
function getFileType(filename) {
    const extension = filename.split(".").pop().toLowerCase();
    return extension;
}

// Función para formatear el tamaño del archivo
function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
        Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    );
}

// Función para formatear la fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
}
