import { IPromocode } from "#root/database/interfaces/promocode.js";

export function containsLink(text: string): boolean {
  return /(https?:\/\/(?:www\.|(?!www))[\dA-Za-z][\dA-Za-z-]+[\dA-Za-z]\.\S{2,}|www\.[\dA-Za-z][\dA-Za-z-]+[\dA-Za-z]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[\dA-Za-z]+\.\S{2,}|www\.[\dA-Za-z]+\.\S{2,})/.test(
    text,
  );
}

export function validatePromocodeUsage(promocode: IPromocode) {
  const now = new Date();
  if (promocode.express_at < now) {
    return { can_use: false, reason: "promocode.use-no_promocode" };
  }
  if (promocode.activated >= promocode.activations) {
    return { can_use: false, reason: "promocode.use-no_promocode" };
  }
  return { can_use: true };
}
