export const FREE_SHIPPING_MINIMUM = 60;

const localDestinations = ["la libertad", "salinas", "santa elena"];

export function isLocalFreeShipping(city: string) {
  const normalized = city.trim().toLocaleLowerCase("es-EC");
  return localDestinations.some((destination) => normalized.includes(destination));
}

export function getShippingRule(subtotal: number, city: string) {
  if (subtotal >= FREE_SHIPPING_MINIMUM) {
    return { free: true, reason: "Compra de $60 o mas" };
  }
  if (isLocalFreeShipping(city)) {
    return { free: true, reason: "Entrega local en Santa Elena" };
  }
  return { free: false, reason: "Tarifa por cotizar con Servientrega" };
}

export const SERVIENTREGA_QUOTE_URL = "https://www.servientrega.com.ec/Cotizador/Nacional";
