# Plan de construccion - Estudio de Impresion 3D C&R

## Objetivo

Construir un prototipo visual responsive de una tienda de productos impresos en 3D, con carrito, cotizaciones mediante mensajeria interna y un dashboard administrativo demostrable. El proyecto quedara preparado para una futura conexion con Firebase, DEUNA, Vercel y GitHub sin incluir credenciales.

## Decisiones tecnicas

- Framework: Next.js con App Router, React y TypeScript.
- Estilos: Tailwind CSS, variables de tema y componentes propios accesibles.
- Iconos: Lucide React.
- Estado del carrito: Zustand con persistencia en localStorage.
- Formularios: React Hook Form y Zod.
- Datos del prototipo: archivos TypeScript locales y persistencia local donde aporte valor.
- Autenticacion futura: Firebase Authentication con Google.
- Datos futuros: Cloud Firestore para productos, promociones, pedidos y clientes.
- Imagenes futuras: Firebase Storage para catalogo y referencias temporales de cotizaciones.
- Pagos futuros: DEUNA Payment Link, creado desde una ruta segura del servidor y confirmado mediante webhook.
- Despliegue: Vercel conectado al repositorio de GitHub.

## Cotizaciones personalizadas y mensajeria

- El cliente podra seleccionar solamente imagenes como referencia; no se aceptaran STL, OBJ ni otros archivos 3D.
- Las imagenes se previsualizan antes de crear una solicitud privada.
- Cliente y administracion conversan dentro de la aplicacion mediante mensajes asociados a la cotizacion.
- Las referencias se almacenan bajo rutas privadas y temporales en Firebase Storage.
- Si una cotizacion se descarta, sus imagenes se eliminan inmediatamente.
- Si se convierte en pedido, se conservan durante produccion y se eliminan al terminar la venta.
- Una tarea diaria elimina archivos vencidos como mecanismo de respaldo.

## Identidad visual

- Estilo femenino, minimalista y artesanal, sin aspecto infantil.
- Fondo rosa crema, superficies blanco calido, acento rosa empolvado y texto ciruela.
- Tipografia editorial para titulares y sans-serif para interfaz.
- Tarjetas amplias, bordes finos, sombras suaves y esquinas redondeadas.
- Inspiracion estructural en la referencia: navegacion ligera, hero editorial, filtros tipo chip y grilla limpia.

## Paginas de la tienda

- Inicio con hero, categorias, destacados, proceso y llamada a cotizacion.
- Catalogo con busqueda, categorias y ordenamiento.
- Detalle de producto con variantes, cantidad y productos relacionados.
- Carrito lateral y pagina de carrito.
- Checkout visual preparado para DEUNA.
- Cotizacion personalizada con imagenes y conversacion privada.
- Login visual con Google y cuenta de cliente.

## Dashboard

- Resumen con indicadores y actividad reciente.
- Productos: listado, busqueda, estados y formulario visual de creacion.
- Promociones: campanas activas y programadas conectadas al banner de inicio.
- Pedidos: tabla con estados y totales.
- Cotizaciones: bandeja de mensajes, archivos temporales y conversion a pedido.
- Configuracion: mensajeria, almacenamiento, entregas, DEUNA y Firebase.
- El acceso administrativo futuro se validara en servidor mediante Firebase Admin y una lista de usuarios autorizados.

## Modelo de datos futuro

- `products`: nombre, slug, descripcion, categoria, precio, precio anterior, variantes, stock, imagenes y estado.
- `promotions`: titulo, descuento, fechas, productos o categorias y estado.
- `orders`: cliente, lineas, subtotal, entrega, total, estado y referencia DEUNA.
- `quotes`: datos del cliente, descripcion, medidas, cantidad, estado, mensajes, rutas de imagenes y fecha de expiracion.
- `users`: perfil basico, direcciones y rol.

## Seguridad futura

- Nunca exponer claves de Firebase Admin o DEUNA al navegador.
- Verificar precios y existencias en el servidor antes de crear una orden de pago.
- Verificar firma y autenticidad de webhooks de DEUNA.
- Reglas de Firestore: catalogo publico de solo lectura y escritura exclusiva para administradores.
- Variables sensibles solo en Vercel y archivos `.env.local` ignorados por Git.

## Fases de ejecucion

1. Inicializar Next.js, dependencias, tema, fuentes y estructura.
2. Crear modelos, datos demo y estado persistente del carrito.
3. Construir layout, inicio, catalogo y detalle de producto.
4. Implementar carrito, checkout visual y estados de interaccion.
5. Crear cotizacion con imagenes temporales y mensajeria interna.
6. Construir login visual, cuenta y dashboard.
7. Preparar adaptadores y documentacion para Firebase y DEUNA.
8. Agregar CI de GitHub, metadatos, README y configuracion de Vercel.
9. Verificar lint, tipos, build, accesibilidad basica y responsive.
10. Inicializar Git y publicar el repositorio publico.

## Criterios de finalizacion del prototipo

- La tienda carga correctamente en escritorio y movil.
- Se puede navegar, filtrar productos y gestionar un carrito persistente.
- La cotizacion valida datos, muestra referencias y abre una conversacion privada.
- El dashboard presenta los flujos principales con datos demostrativos.
- El repositorio no contiene secretos y pasa lint, comprobacion de tipos y build.
- El README explica como ejecutar, configurar y evolucionar el proyecto.
