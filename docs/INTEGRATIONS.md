# Integraciones y ciclo de vida de datos

## Mensajeria interna

Las cotizaciones se gestionan dentro de la aplicacion. Cada solicitud crea:

- Un documento privado en `quotes`.
- Una subcoleccion `messages` para la conversacion.
- Una carpeta temporal en Storage: `quotes/{userId}/{quoteId}/`.

El cliente solo puede consultar sus solicitudes y archivos. Los administradores acceden mediante un custom claim validado por Firebase Rules y Firebase Admin.

## Retencion de imagenes

Las referencias no son archivos permanentes del catalogo.

1. Al crear la cotizacion, cada archivo recibe `storagePath` y `expiresAt`.
2. Mientras la solicitud esta en revision o cotizada, los archivos permanecen disponibles.
3. Si se convierte en pedido, se extiende la retencion hasta terminar produccion y entrega.
4. Si se descarta, una operacion de servidor elimina primero los objetos de Storage y despues marca la solicitud como descartada.
5. Al terminar una venta convertida se ejecuta la misma eliminacion.
6. Una tarea programada diaria elimina objetos cuyo `expiresAt` haya vencido y registra el resultado.

La eliminacion debe ser idempotente: intentar borrar un archivo que ya no existe no debe impedir cerrar la cotizacion o el pedido.

## Firebase

- Proyecto: `estudio-jj-3d`.
- Consola: https://console.firebase.google.com/project/estudio-jj-3d/overview
- Firestore esta creado en `nam5`; sus reglas se publican con `npx firebase deploy --only firestore:rules`.
- Authentication con Google identifica clientes y administradores. La aplicacion crea un perfil `users/{uid}` con rol inicial `customer` al primer acceso.
- Los administradores requieren el custom claim `admin: true`, asignado exclusivamente con Firebase Admin desde un entorno de servidor.
- Storage almacena fotografias de productos y referencias temporales. Antes del primer despliegue de reglas se debe crear el bucket en la consola.
- Firebase Admin ejecuta transiciones de estado y eliminacion de archivos.
- App Check protege formularios y rutas publicas contra abuso.

### Configuracion pendiente en consola

1. Crear un cliente OAuth 2.0 web para Google en Cloud Console y habilitarlo en Authentication. Usar `https://estudio-jj-3d.firebaseapp.com/__/auth/handler` como URI de redireccion autorizada; el Client ID y Client Secret se requieren para activar el proveedor por API.
2. Los dominios `studiocr-three.vercel.app`, `studiocr-jonaroseros-projects.vercel.app` y `studiocr-git-main-jonaroseros-projects.vercel.app` ya estan autorizados.
3. Storage ya esta creado en `US-EAST1` y sus reglas estan publicadas.
4. Para otorgar administracion, usar Firebase Admin para asignar `{ admin: true }` al usuario y pedirle que vuelva a iniciar sesion para renovar su token.

La configuracion publica del cliente se define en `.env.example`; en produccion ya esta cargada como variables `NEXT_PUBLIC_FIREBASE_*` en Vercel. No guardar claves privadas de Firebase Admin en el cliente ni en el repositorio.

## DEUNA

Payment Link reduce el alcance de seguridad porque DEUNA aloja la interfaz de pago. La aplicacion debe crear enlaces en una ruta de servidor y considerar pagado un pedido solo despues de consultar la orden o validar un webhook firmado.

Antes de activar pagos se necesita:

- Cuenta comercial aprobada y credenciales de sandbox.
- Codigo de tienda y metodos de pago configurados.
- URLs publicas para retorno y webhook.
- Pruebas de pagos aprobados, rechazados y pendientes.
- Politica de reembolsos y conciliacion.

Documentacion oficial: https://docs.deuna.com/
