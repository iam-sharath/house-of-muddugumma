import { useCart, useSettings } from "./store";

export function buildWhatsAppUrl(items, settings, extraNote = "") {
  const num = (settings?.whatsapp_number || "").replace(/[^0-9]/g, "");
  const lines = [
    `Hello ${settings?.business_name || "House of Muddugumma"},`,
    ``,
    `I would like to order:`,
    ``,
  ];
  items.forEach((it, idx) => {
    lines.push(`${idx + 1}. ${it.name}`);
    if (it.color) lines.push(`   Color: ${it.color}`);
    if (it.size) lines.push(`   Size: ${it.size}`);
    lines.push(`   Quantity: ${it.qty}`);
    lines.push(`   Price: ₹${it.price_inr}${it.price_gbp ? ` / £${it.price_gbp}` : ""}`);
    lines.push("");
  });
  if (extraNote) { lines.push(`Note: ${extraNote}`); lines.push(""); }
  lines.push("Please contact me.");
  const msg = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${num}?text=${msg}`;
}

export function useWhatsAppOrder() {
  const { settings } = useSettings();
  return (items, note) => window.open(buildWhatsAppUrl(items, settings, note), "_blank");
}
