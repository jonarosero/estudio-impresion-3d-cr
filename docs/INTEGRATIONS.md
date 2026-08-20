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

- Authentication con Google identifica clientes y administradores.
- Firestore almacena productos, promociones, pedidos, cotizaciones y mensajes.
- Storage almacena fotografias de productos y referencias temporales.
- Firebase Admin ejecuta transiciones de estado y eliminacion de archivos.
- App Check protege formularios y rutas publicas contra abuso.

## DEUNA

Payment Link reduce el alcance de seguridad porque DEUNA aloja la interfaz de pago. La aplicacion debe crear enlaces en una ruta de servidor y considerar pagado un pedido solo despues de consultar la orden o validar un webhook firmado.

Antes de activar pagos se necesita:

- Cuenta comercial aprobada y credenciales de sandbox.
- Codigo de tienda y metodos de pago configurados.
- URLs publicas para retorno y webhook.
- Pruebas de pagos aprobados, rechazados y pendientes.
- Politica de reembolsos y conciliacion.

Documentacion oficial: https://docs.deuna.com/
