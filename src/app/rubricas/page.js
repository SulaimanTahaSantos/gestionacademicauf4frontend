"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, FileText } from "lucide-react";
import RubricTable from "@/misComponents/RubricTable";
import RubricForm from "@/misComponents/RubricForm";
import RubricPreview from "@/misComponents/RubricPreview";
import { UserProfileDropdown } from "@/misComponents/user-profile-dropdown";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Navbar } from "@/misComponents/Navbar";
import toast, { Toaster } from 'react-hot-toast';

export default function Rubricas() {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [editingRubric, setEditingRubric] = useState(null);
    const [previewRubric, setPreviewRubric] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [rubrics, setRubrics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoadingRubrics, setIsLoadingRubrics] = useState(false);

    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isClient, setIsClient] = useState(false);

    const rol = isClient ? userData?.data?.rol : null;
    const name = userData?.data?.name || "";
    const surname = userData?.data?.surname || "";
    const email = userData?.data?.email;
    const url = userData?.data?.url;

    useEffect(() => {
      setIsClient(true);

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

    useEffect(() => {
        const fetchRubrics = async () => {     
            
            setIsLoadingRubrics(true);
            try {
                const apiEndpoint = rol === "profesor" 
                    ? "https://gestionacademicauf4backend-production.up.railway.app/api/profesor/rubricas"
                    : "https://gestionacademicauf4backend-production.up.railway.app/api/rubricas";
                
                const response = await fetch(
                  apiEndpoint,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (!response.ok) {
                    throw new Error(`Error fetching ${rol === "profesor" ? "professor " : ""}rubrics`);
                }
                const data = await response.json();
                console.log(`${rol === "profesor" ? "Professor " : ""}Rubrics data received:`, data);
                
                let transformedRubrics = [];
                if (Array.isArray(data)) {
                    if (rol === "profesor") {
                        
                        transformedRubrics = data.map(item => ({
                            id: item.id,
                            nombre: item.nombre,
                            practica: item.practica_titulo,
                            practica_id: item.practica_titulo ? "1" : null, 
                            evaluadores: item.evaluador_name && item.evaluador_surname ? [item.evaluador_name + " " + item.evaluador_surname] : [],
                            evaluador_ids: item.evaluador_name && item.evaluador_surname ? ["1"] : [""], 
                            evaluacionesRealizadas: item.total_notas || 0,
                            criterios: (item.criterios || []).map(criterio => ({
                                nombre: criterio.nombre,
                                descripcion: criterio.descripcion,
                                puntuacion: criterio.puntuacion_maxima || criterio.puntuacion || 0
                            })),
                            documento: item.documento ? {
                                nombre: item.documento
                            } : null,
                            originalData: item
                        }));
                    } else {
                        transformedRubrics = data.map(item => ({
                            id: item.rubrica?.id,
                            nombre: item.rubrica?.nombre,
                            practica: item.practica_asignada?.nombre_practica,
                            practica_id: item.practica_asignada?.id || item.rubrica?.practica_id,
                            evaluadores: item.evaluador_asignado ? [item.evaluador_asignado.nombre + " " + item.evaluador_asignado.apellido] : [],
                            evaluador_ids: item.evaluador_asignado ? [item.evaluador_asignado.id.toString()] : [""],
                            evaluacionesRealizadas: 0, 
                            criterios: (item.criterios || []).map(criterio => ({
                                nombre: criterio.nombre,
                                descripcion: criterio.descripcion,
                                puntuacion: criterio.puntuacion_maxima || criterio.puntuacion || 0
                            })),
                            documento: item.rubrica?.documento ? {
                                nombre: item.rubrica.documento
                            } : null,
                            originalData: item
                        }));
                    }
                    setRubrics(transformedRubrics);
                    console.log("Rubrics transformed and set:", transformedRubrics);
                } else if (data && Array.isArray(data.data)) {
                    if (rol === "profesor") {
                        
                        transformedRubrics = data.data.map(item => ({
                            id: item.id,
                            nombre: item.nombre,
                            practica: item.practica_titulo,
                            practica_id: item.practica_titulo ? "1" : null, 
                            evaluadores: item.evaluador_name && item.evaluador_surname ? [item.evaluador_name + " " + item.evaluador_surname] : [],
                            evaluador_ids: item.evaluador_name && item.evaluador_surname ? ["1"] : [""], 
                            evaluacionesRealizadas: item.total_notas || 0,
                            criterios: (item.criterios || []).map(criterio => ({
                                nombre: criterio.nombre,
                                descripcion: criterio.descripcion,
                                puntuacion: criterio.puntuacion_maxima || criterio.puntuacion || 0
                            })),
                            documento: item.documento ? {
                                nombre: item.documento
                            } : null,
                            originalData: item
                        }));
                    } else {
                        transformedRubrics = data.data.map(item => ({
                            id: item.rubrica?.id,
                            nombre: item.rubrica?.nombre,
                            practica: item.practica_asignada?.nombre_practica,
                            practica_id: item.practica_asignada?.id || item.rubrica?.practica_id,
                            evaluadores: item.evaluador_asignado ? [item.evaluador_asignado.nombre + " " + item.evaluador_asignado.apellido] : [],
                            evaluador_ids: item.evaluador_asignado ? [item.evaluador_asignado.id.toString()] : [""],
                            evaluacionesRealizadas: 0,
                            criterios: (item.criterios || []).map(criterio => ({
                                nombre: criterio.nombre,
                                descripcion: criterio.descripcion,
                                puntuacion: criterio.puntuacion_maxima || criterio.puntuacion || 0
                            })),
                            documento: item.rubrica?.documento ? {
                                nombre: item.rubrica.documento
                            } : null,
                            originalData: item
                        }));
                    }
                    setRubrics(transformedRubrics);
                    console.log("Rubrics transformed and set from data.data:", transformedRubrics);
                } else {
                    console.warn("Unexpected rubrics data format:", data);
                    setRubrics([]);
                }
            } catch (error) {
                console.error("Error fetching rubrics:", error);
                setRubrics([]); 
                toast.error("Error al cargar las rúbricas");
            } finally {
                setIsLoadingRubrics(false);
            }
        };

        if (token && isClient) {
            fetchRubrics();
        }
    }, [token, isClient, rol]);

    const refreshRubrics = async () => {
        try {
            const apiEndpoint = rol === "profesor" 
                ? "https://gestionacademicauf4backend-production.up.railway.app/api/profesor/rubricas"
                : "https://gestionacademicauf4backend-production.up.railway.app/api/rubricas";
                
            const response = await fetch(
              apiEndpoint,
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!response.ok) {
                throw new Error(`Error fetching ${rol === "profesor" ? "professor " : ""}rubrics`);
            }
            const data = await response.json();
            console.log(`${rol === "profesor" ? "Professor " : ""}Rubrics refreshed data received:`, data);
            
            let transformedRubrics = [];
            if (Array.isArray(data)) {
                if (rol === "profesor") {
                    transformedRubrics = data.map(item => ({
                        id: item.id,
                        nombre: item.nombre,
                        practica: item.practica_titulo,
                        practica_id: item.practica_titulo ? "1" : null, 
                        evaluadores: item.evaluador_name && item.evaluador_surname ? [item.evaluador_name + " " + item.evaluador_surname] : [],
                        evaluador_ids: item.evaluador_name && item.evaluador_surname ? ["1"] : [""], 
                        evaluacionesRealizadas: item.total_notas || 0,
                        criterios: (item.criterios || []).map(criterio => ({
                            nombre: criterio.nombre,
                            descripcion: criterio.descripcion,
                            puntuacion: criterio.puntuacion_maxima || criterio.puntuacion || 0
                        })),
                        documento: item.documento ? {
                            nombre: item.documento
                        } : null,
                        originalData: item
                    }));
                } else {
                    transformedRubrics = data.map(item => ({
                        id: item.rubrica?.id,
                        nombre: item.rubrica?.nombre,
                        practica: item.practica_asignada?.nombre_practica,
                        practica_id: item.practica_asignada?.id || item.rubrica?.practica_id,
                        evaluadores: item.evaluador_asignado ? [item.evaluador_asignado.nombre + " " + item.evaluador_asignado.apellido] : [],
                        evaluador_ids: item.evaluador_asignado ? [item.evaluador_asignado.id.toString()] : [""],
                        evaluacionesRealizadas: 0, 
                        criterios: (item.criterios || []).map(criterio => ({
                            nombre: criterio.nombre,
                            descripcion: criterio.descripcion,
                            puntuacion: criterio.puntuacion_maxima || criterio.puntuacion || 0
                        })),
                        documento: item.rubrica?.documento ? {
                            nombre: item.rubrica.documento
                        } : null,
                        originalData: item
                    }));
                }
                setRubrics(transformedRubrics);
                console.log("Rubrics refreshed and transformed:", transformedRubrics);
            } else if (data && Array.isArray(data.data)) {
                if (rol === "profesor") {
                    transformedRubrics = data.data.map(item => ({
                        id: item.id,
                        nombre: item.nombre,
                        practica: item.practica_titulo,
                        practica_id: item.practica_titulo ? "1" : null, 
                        evaluadores: item.evaluador_name && item.evaluador_surname ? [item.evaluador_name + " " + item.evaluador_surname] : [],
                        evaluador_ids: item.evaluador_name && item.evaluador_surname ? ["1"] : [""], 
                        evaluacionesRealizadas: item.total_notas || 0,
                        criterios: (item.criterios || []).map(criterio => ({
                            nombre: criterio.nombre,
                            descripcion: criterio.descripcion,
                            puntuacion: criterio.puntuacion_maxima || criterio.puntuacion || 0
                        })),
                        documento: item.documento ? {
                            nombre: item.documento
                        } : null,
                        originalData: item
                    }));
                } else {
                    transformedRubrics = data.data.map(item => ({
                        id: item.rubrica?.id,
                        nombre: item.rubrica?.nombre,
                        practica: item.practica_asignada?.nombre_practica,
                        practica_id: item.practica_asignada?.id || item.rubrica?.practica_id,
                        evaluadores: item.evaluador_asignado ? [item.evaluador_asignado.nombre + " " + item.evaluador_asignado.apellido] : [],
                        evaluador_ids: item.evaluador_asignado ? [item.evaluador_asignado.id.toString()] : [""],
                        evaluacionesRealizadas: 0,
                        criterios: (item.criterios || []).map(criterio => ({
                            nombre: criterio.nombre,
                            descripcion: criterio.descripcion,
                            puntuacion: criterio.puntuacion_maxima || criterio.puntuacion || 0
                        })),
                        documento: item.rubrica?.documento ? {
                            nombre: item.rubrica.documento
                        } : null,
                        originalData: item
                    }));
                }
                setRubrics(transformedRubrics);
            } else {
                setRubrics([]);
            }
        } catch (error) {
            toast.error("Error al actualizar las rúbricas");
        }
    };


    const handleSettingsClick = () => {
        router.push("/configuracion");
    };

    const handleHomeClick = () => {
        router.push("/home");
    };

    const handleAddRubric = () => {
        setEditingRubric(null);
        setShowForm(true);
    };

    const handleEditRubric = (rubric) => {
        console.log("Editing rubric:", rubric);
        console.log("Criterios to edit:", rubric.criterios);
        
        if (!rubric.criterios || !Array.isArray(rubric.criterios) || rubric.criterios.length === 0) {
            rubric.criterios = [{ nombre: "", descripcion: "", puntuacion: 0 }];
        }
        
        setEditingRubric(rubric);
        setShowForm(true);
    };

    const handlePreviewRubric = (rubric) => {
        setPreviewRubric(rubric);
        setShowPreview(true);
    };

    const handleDeleteRubric = async (id) => {
        if (!token) {
            console.error("No token available");
            toast.error("No hay token de autenticación disponible");
            return;
        }

        if (!window.confirm("¿Estás seguro de que deseas eliminar esta rúbrica? Esta acción no se puede deshacer.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const apiEndpoint = rol === "profesor" 
                ? `https://gestionacademicauf4backend-production.up.railway.app/api/profesor/rubricas/${id}`
                : `https://gestionacademicauf4backend-production.up.railway.app/api/rubricas/${id}`;
                
            const response = await fetch(
                apiEndpoint,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error deleting ${rol === "profesor" ? "professor " : ""}rubric: ${errorData.message || response.statusText}`);
            }

            setRubrics(rubrics.filter((rubric) => rubric.id !== id));
            
            toast.success("Rúbrica eliminada exitosamente");
            
            console.log("Rubric deleted successfully");
        } catch (error) {
            console.error("Error deleting rubric:", error);
            toast.error(`Error al eliminar la rúbrica: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveRubric = async (rubric) => {
        setIsLoading(true);
        try {
            if (editingRubric) {
                const apiEndpoint = rol === "profesor" 
                    ? `https://gestionacademicauf4backend-production.up.railway.app/api/profesor/rubricas/${editingRubric.id}`
                    : `https://gestionacademicauf4backend-production.up.railway.app/api/rubricas/${editingRubric.id}`;
                    
                const response = await fetch(
                    apiEndpoint,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            nombre: rubric.nombre,
                            documento: rubric.documento?.nombre || null,
                            practica_id: rubric.practica_id || null,
                            evaluador_id: rubric.evaluador_ids && rubric.evaluador_ids[0] ? rubric.evaluador_ids[0] : null,
                            criterios: rubric.criterios.map(criterio => ({
                                nombre: criterio.nombre,
                                descripcion: criterio.descripcion,
                                puntuacion_maxima: criterio.puntuacion
                            }))
                        }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error updating ${rol === "profesor" ? "professor " : ""}rubric: ${errorData.message || response.statusText}`);
                }

                const updatedData = await response.json();
                console.log("Rubric updated:", updatedData);
                
                await refreshRubrics();
                toast.success("Rúbrica actualizada exitosamente");
            } else {
                const apiEndpoint = rol === "profesor" 
                    ? "https://gestionacademicauf4backend-production.up.railway.app/api/profesor/rubricas"
                    : "https://gestionacademicauf4backend-production.up.railway.app/api/rubricas";
                    
                const response = await fetch(
                    apiEndpoint,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            nombre: rubric.nombre,
                            documento: rubric.documento?.nombre || null,
                            practica_id: rubric.practica_id || 1,
                            evaluador_id: rubric.evaluador_ids && rubric.evaluador_ids[0] ? rubric.evaluador_ids[0] : null,
                            criterios: rubric.criterios.map(criterio => ({
                                nombre: criterio.nombre,
                                descripcion: criterio.descripcion,
                                puntuacion_maxima: criterio.puntuacion
                            }))
                        }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error creating ${rol === "profesor" ? "professor " : ""}rubric: ${errorData.message || response.statusText}`);
                }

                const newData = await response.json();
                console.log("Rubric created:", newData);
                

                await refreshRubrics();
                toast.success("Rúbrica creada exitosamente");
            }
            
            setShowForm(false);
        } catch (error) {
            console.error("Error saving rubric:", error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingRubric(null);
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setPreviewRubric(null);
    };

    const filteredRubrics = rubrics.filter(
        (rubric) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesNombre = rubric.nombre && rubric.nombre.toLowerCase().includes(searchLower);
            const matchesPractica = rubric.practica && rubric.practica.toLowerCase().includes(searchLower);
            return matchesNombre || matchesPractica;
        }
    );

    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#10b981",
                color: "#fff",
              },
            },
            error: {
              duration: 5000,
              style: {
                background: "#ef4444",
                color: "#fff",
              },
            },
          }}
        />
        <header className="bg-white border-b sticky top-0 z-10">
          <Navbar
            userEmail={email}
            userImage={url}
            userName={`${name} ${surname}`}
            onSettingsClick={handleSettingsClick}
            onHomeClick={handleHomeClick}
          />
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Gestión de Rúbricas
                </h2>
                <p className="text-muted-foreground mt-1">
                  Administra y organiza tus rúbricas de evaluación
                  {rubrics.length > 0 &&
                    ` (${rubrics.length} rúbrica${
                      rubrics.length === 1 ? "" : "s"
                    })`}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar rúbricas..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {rol !== "user" && (
                  <Button
                    onClick={handleAddRubric}
                    className="whitespace-nowrap"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nueva Rúbrica
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {isLoadingRubrics ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando rúbricas...</p>
                </div>
              </div>
            ) : (
              <RubricTable
                rubrics={filteredRubrics}
                onEdit={handleEditRubric}
                onDelete={handleDeleteRubric}
                onPreview={handlePreviewRubric}
                isDeleting={isDeleting}
                rol={rol}
              />
            )}
          </div>

          {filteredRubrics.length === 0 && searchTerm && !isLoadingRubrics && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron rúbricas que coincidan con &ldquo;{searchTerm}
              &rdquo;
            </div>
          )}

          {searchTerm && filteredRubrics.length > 0 && (
            <div className="text-center py-2 text-sm text-muted-foreground bg-blue-50 rounded-lg">
              Mostrando {filteredRubrics.length} de {rubrics.length} rúbricas
            </div>
          )}
        </main>

        <RubricForm
          open={showForm}
          onClose={handleCloseForm}
          onSave={handleSaveRubric}
          rubric={editingRubric}
          isLoading={isLoading}
        />

        <RubricPreview
          open={showPreview}
          onClose={handleClosePreview}
          rubric={previewRubric}
        />
      </div>
    );
}
