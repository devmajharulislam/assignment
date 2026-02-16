export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addToCart(item: CartItem) {
  const cart = getCart();

  const existing = cart.find((p) => p.productId === item.productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
