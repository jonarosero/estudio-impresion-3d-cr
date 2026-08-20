# Integraciones de WhatsApp, Firebase y DEUNA

## WhatsApp: alternativas evaluadas

### Click to Chat (`wa.me`) - seleccionado

- Oficial y gratuito.
- No requiere token, backend o aprobacion de Meta.
- Permite precargar texto.
- No permite adjuntar automaticamente imagenes desde una pagina web.
- Es adecuado para cotizaciones atendidas personalmente.

### Web Share API - mejora opcional

- Puede compartir archivos desde navegadores moviles compatibles.
- El usuario elige la aplicacion de destino; la web no puede forzar WhatsApp.
- El soporte depende del navegador y del sistema operativo.
- No sustituye el flujo base de Click to Chat.

### WhatsApp Business Platform Cloud API

- Es la API oficial para automatizacion.
- Requiere Meta Business, una aplicacion, un numero habilitado y webhooks.
- Los archivos se cargan temporalmente a la infraestructura de Meta.
- Tiene reglas de ventanas de servicio, plantillas y precios que pueden cambiar.
- No es necesaria para el prototipo ni para conversaciones iniciadas manualmente.

### APIs no oficiales

No se recomiendan. Automatizan WhatsApp Web, requieren conservar sesiones y pueden ocasionar interrupciones o bloqueos del numero.

## Firebase

La aplicacion final separara dos contextos:

- SDK cliente: login de Google y lectura publica del catalogo.
- Admin SDK: operaciones del dashboard, roles y creacion de pedidos.

Las solicitudes personalizadas no almacenaran sus imagenes. Firebase Storage se reservara para fotografias de productos cargadas por administradores.

## DEUNA

Payment Link reduce el alcance de seguridad porque DEUNA aloja la interfaz de pago. La aplicacion debe crear enlaces en una ruta de servidor y considerar pagado un pedido solo despues de consultar la orden o validar un webhook firmado.

Antes de activar pagos se necesita:

- Cuenta comercial aprobada.
- Credenciales de sandbox.
- Codigo de tienda y metodos de pago configurados.
- URLs publicas para retorno y webhook.
- Pruebas de pagos aprobados, rechazados y pendientes.
- Politica de reembolsos y conciliacion.

Documentacion oficial consultada: https://docs.deuna.com/
