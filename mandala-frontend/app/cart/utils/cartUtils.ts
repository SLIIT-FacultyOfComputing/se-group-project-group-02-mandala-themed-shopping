interface CartItem {
    productId: number;
    quantity: number;
  }
  
  const CART_KEY = "cartItems";
  
  /**
   * Get all cart items from localStorage
   */
  export function getCartItems(): CartItem[] {
    if (typeof window === "undefined") return [];
    const items = localStorage.getItem(CART_KEY);
    return items ? JSON.parse(items) : [];
  }
  
  /**
   * Save cart items to localStorage
   */
  export function saveCartItems(items: CartItem[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }
  
  /**
   * Add product to cart (or increment quantity)
   */
  export function addToCart(productId: number, quantity: number = 1) {
    const cart = getCartItems();
    const existingItem = cart.find((item) => item.productId === productId);
  
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
  
    saveCartItems(cart);
  }
  
  /**
   * Remove product from cart
   */
  export function removeFromCart(productId: number) {
    const cart = getCartItems().filter((item) => item.productId !== productId);
    saveCartItems(cart);
  }
  
  /**
   * Clear all cart items
   */
  export function clearCart() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_KEY);
    }
  }
  