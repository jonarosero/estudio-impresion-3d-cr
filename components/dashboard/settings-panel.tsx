"use client";

import { AdminUsersPanel } from "@/components/dashboard/admin-users-panel";
import { IntegrationCard } from "@/components/dashboard/integration-card";
import { MediaSettings } from "@/components/dashboard/media-settings";
import { PanelHeading } from "@/components/dashboard/panel-heading";
import { CustomPrintsPanel } from "@/components/dashboard/custom-prints-panel";

const integrations = [
  {
    title: "Mensajeria interna",
    text: "Cotizaciones privadas con archivos temporales y seguimiento dentro de la tienda.",
    active: true,
  },
  {
    title: "Firebase",
    text: "Google Auth, Firestore y Storage temporal pendientes de credenciales.",
    active: false,
  },
  {
    title: "DEUNA",
    text: "Payment Link preparado para la futura cuenta comercial.",
    active: false,
  },
  {
    title: "Vercel",
    text: "Listo para desplegar desde el repositorio de GitHub.",
    active: true,
  },
];

export function SettingsPanel() {
  return (
    <>
      <PanelHeading
        title="Configuración"
        subtitle="Conexiones, medios y datos de la tienda"
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.title} {...integration} />
        ))}
      </div>
      <MediaSettings />
      <CustomPrintsPanel />
      <AdminUsersPanel />
    </>
  );
}
