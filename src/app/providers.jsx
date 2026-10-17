"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "addis-eats-cart";

const EMPTY_CART = Object.freeze([]);

let cartSnapshot = EMPTY_CART;
let initialized = false;

const listeners = new Set();

function validateCart(items) {
  if (!Array.isArray(items)) {
    return EMPTY_CART;
  }

  return items.filter(
    (item) =>
      item &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      Number.isFinite(item.price) &&
      item.price >= 0 &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
  );
}

function initializeCart() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  try {
    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (storedValue) {
      cartSnapshot = validateCart(JSON.parse(storedValue));
    } else {
      cartSnapshot = EMPTY_CART;
    }
  } catch (error) {
    console.error("Unable to restore cart:", error);
    cartSnapshot = EMPTY_CART;
  }
}

function getSnapshot() {
  initializeCart();
  return cartSnapshot;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function handleStorage(event) {
  if (
    event.key !== CART_STORAGE_KEY &&
    event.key !== null
  ) {
    return;
  }

  initialized = false;
  initializeCart();
  notifyListeners();
}

function subscribe(listener) {
  listeners.add(listener);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(listener);

    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function updateCart(updater) {
  initializeCart();

  const nextCart = updater(cartSnapshot);

  if (nextCart === cartSnapshot) {
    return;
  }

  cartSnapshot = nextCart;

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartSnapshot)
    );
  } catch (error) {
    console.error("Unable to save cart:", error);
  }

  notifyListeners();
}

export function Providers({ children }) {
  const cart = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function addToCart(dish) {
    // Never add a dish explicitly marked unavailable.
    if (
      !dish ||
      dish.available === false ||
      typeof dish.id !== "string" ||
      typeof dish.name !== "string" ||
      !Number.isFinite(dish.price) ||
      dish.price < 0
    ) {
      return;
    }

    updateCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === dish.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...dish,
          quantity: 1,
        },
      ];
    });
  }

  function increaseQuantity(dishId) {
    updateCart((currentCart) =>
      currentCart.map((item) =>
        item.id === dishId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(dishId) {
    updateCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === dishId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(dishId) {
    updateCart((currentCart) =>
      currentCart.filter((item) => item.id !== dishId)
    );
  }

  function clearCart() {
    updateCart(() => EMPTY_CART);
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside Providers"
    );
  }

  return context;
}