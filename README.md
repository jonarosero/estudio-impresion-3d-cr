# Estudio de Impresion 3D J&J

Prototipo responsive de una tienda de objetos impresos en 3D con catalogo, carrito persistente, cotizaciones por mensajeria interna y dashboard administrativo.

## Funcionalidades

- Inicio editorial y responsive.
- Catalogo con busqueda, categorias y ordenamiento.
- Detalle de producto con colores, cantidad y productos relacionados.
- Carrito persistente en el navegador.
- Checkout visual preparado para DEUNA.
- Cotizaciones personalizadas mediante conversaciones privadas dentro de la tienda.
- Imagenes temporales con eliminacion al descartar la solicitud o terminar la venta.
- Login visual preparado para Google y Firebase Authentication.
- Dashboard para productos, promociones, pedidos, cotizaciones y configuracion.

## Tecnologias

- Next.js con App Router
- React y TypeScript
- Tailwind CSS
- Zustand
- React Hook Form y Zod
- Lucide React

## Uso local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

## Verificacion

```bash
npm run lint
npm run typecheck
npm run build
```

## Mensajeria e imagenes temporales

Cada cotizacion abre una conversacion privada entre cliente y administracion. En produccion, las referencias se almacenaran bajo una ruta aislada por usuario y solicitud.

- Al descartar una cotizacion se eliminan sus imagenes.
- Al convertirla en pedido, las imagenes se conservan durante la produccion.
- Al terminar la venta se eliminan las imagenes.
- Una tarea programada elimina archivos vencidos como mecanismo de respaldo.

Consulta [docs/INTEGRATIONS.md](docs/INTEGRATIONS.md) para el ciclo de vida completo.

## Integraciones futuras

### Firebase

- Authentication con Google para clientes y administradores.
- Firestore para productos, promociones, pedidos y estados de cotizaciones.
- Storage para imagenes del catalogo y referencias temporales de cotizaciones.
- Firebase Admin en rutas de servidor para comprobar permisos.

Las reglas iniciales estan en `firebase/` y deben adaptarse al modelo definitivo antes de produccion.

### DEUNA

La opcion recomendada es Payment Link:

1. Validar productos y precios en el servidor.
2. Crear una orden y un enlace mediante la API de DEUNA.
3. Redirigir al checkout alojado.
4. Confirmar el resultado exclusivamente mediante un webhook verificado.
5. Actualizar el pedido en Firestore de forma idempotente.

Las credenciales `DEUNA_*` nunca deben exponerse como variables `NEXT_PUBLIC_*`.

## Despliegue

1. Importa el repositorio en Vercel.
2. Configura `NEXT_PUBLIC_WHATSAPP_NUMBER`.
3. Ejecuta el despliegue.
4. Cuando existan Firebase y DEUNA, agrega sus credenciales en Vercel sin guardarlas en GitHub.

## Estado

Esta entrega es un prototipo visual. Los datos de productos y dashboard son demostrativos. Consulta [PLAN.md](PLAN.md) para el alcance y la evolucion propuesta.
