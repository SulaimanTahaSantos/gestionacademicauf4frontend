import { TablaGrupos } from "@/misComponents/tablaGrupos";

export default function Home() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Gestión de Grupos</h1>
            <TablaGrupos />
        </div>
    );
}
