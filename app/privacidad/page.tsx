export const metadata = { title: "Protección de datos" };

export default function PrivacyPage() {
  return (
    <main className="page-shell py-12 sm:py-20">
      <article className="mx-auto max-w-3xl rounded-[30px] bg-[#fffdfb] p-7 sm:p-12">
        <p className="eyebrow">Estudio de Impresión 3D J&J</p>
        <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">Política de protección de datos personales</h1>
        <p className="mt-6 text-sm leading-7 text-[#786970]">Última actualización: 20 de agosto de 2026.</p>
        <div className="mt-10 space-y-9 text-sm leading-7 text-[#5f5358]">
          <section><h2 className="font-display text-3xl font-semibold text-[#35282d]">1. Datos que tratamos</h2><p className="mt-3">Tratamos datos de identificación, contacto, facturación, dirección de entrega, historial de pedidos y mensajes necesarios para atender compras y cotizaciones. Las imágenes de referencia se tratan cómo archivos temporales.</p></section>
          <section><h2 className="font-display text-3xl font-semibold text-[#35282d]">2. Finalidad</h2><p className="mt-3">Usamos estos datos para crear cuentas, gestionar pedidos, emitir facturas, coordinar entregas, responder cotizaciones y brindar soporte. No vendemos ni cedemos datos personales para fines publicitarios ajenos a la tienda.</p></section>
          <section><h2 className="font-display text-3xl font-semibold text-[#35282d]">3. Imágenes de cotizaciones</h2><p className="mt-3">Las referencias subidas para una pieza personalizada se guardan en una ruta privada. Se eliminan cuando se descarta la cotización o al terminar la venta convertida. Una tarea de limpieza elimina archivos vencidos si una solicitud queda inactiva.</p></section>
          <section><h2 className="font-display text-3xl font-semibold text-[#35282d]">4. Conservación y seguridad</h2><p className="mt-3">Conservamos la información de facturación y pedidos durante el tiempo exigido por obligaciones legales y contables. Aplicamos control de acceso por usuario, reglas de base de datos y comunicaciones seguras con proveedores de infraestructura.</p></section>
          <section><h2 className="font-display text-3xl font-semibold text-[#35282d]">5. Tus derechos</h2><p className="mt-3">Puedes solicitar acceso, actualización, rectificación, eliminación u oposición al tratamiento de tus datos, cuando corresponda. Para ejercerlos, contacta al estudio desde tu cuenta o mediante los canales oficiales publicados en la tienda.</p></section>
          <section><h2 className="font-display text-3xl font-semibold text-[#35282d]">6. Cambios</h2><p className="mt-3">Podemos actualizar esta política al cambiar nuestros procesos o servicios. La versión vigente siempre estará disponible en esta página.</p></section>
        </div>
      </article>
    </main>
  );
}
