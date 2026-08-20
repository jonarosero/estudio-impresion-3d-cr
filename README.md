# Estudio de Impresion 3D C&R

Prototipo responsive de una tienda de objetos impresos en 3D con catalogo, carrito persistente, cotizaciones por WhatsApp y dashboard administrativo.

## Funcionalidades

- Inicio editorial y responsive.
- Catalogo con busqueda, categorias y ordenamiento.
- Detalle de producto con colores, cantidad y productos relacionados.
- Carrito persistente en el navegador.
- Checkout visual preparado para DEUNA.
- Cotizaciones personalizadas mediante WhatsApp.
- Seleccion y previsualizacion local de imagenes sin subirlas a un servidor.
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
cp .env.example .env.local
npm run dev
```

En Windows PowerShell, crea `.env.local` a partir de `.env.example` con el metodo que prefieras y configura:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=593999999999
```

El numero debe incluir codigo de pais y no debe contener `+`, espacios ni guiones.

## Verificacion

```bash
npm run lint
npm run typecheck
npm run build
```

## WhatsApp e imagenes

El proyecto usa el enlace gratuito oficial `wa.me`. El formulario crea un mensaje con los datos de la solicitud y abre WhatsApp.

Los navegadores no pueden adjuntar automaticamente archivos a una conversacion de WhatsApp mediante Click to Chat. Por esa razon:

- Las imagenes se muestran mediante URLs `blob:` locales.
- Las imagenes no se suben a Firebase ni a otro servidor.
- El cliente debe adjuntar manualmente las referencias una vez abierto el chat.
- No se usan APIs no oficiales ni automatizaciones que puedan bloquear el numero.

Consulta [docs/INTEGRATIONS.md](docs/INTEGRATIONS.md) para comparar alternativas.

## Integraciones futuras

### Firebase

- Authentication con Google para clientes y administradores.
- Firestore para productos, promociones, pedidos y estados de cotizaciones.
- Storage solamente para imagenes del catalogo subidas por administradores.
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
