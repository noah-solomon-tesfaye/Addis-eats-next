"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "addis-eats-cart";

function getInitialCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function Providers({ children }) {
  const [cart, setCart] = useState(getInitialCart);

  // Persist cart changes in the browser.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cart]);

  function addToCart(dish) {
    if (
      !dish ||
      typeof dish.id !== "string" ||
      !Number.isFinite(dish.price) ||
      dish.price < 0
    ) {
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === dish.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
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
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === dishId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(dishId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === dishId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(dishId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== dishId)
    );
  }

  function clearCart() {
    setCart([]);
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
    throw new Error("useCart must be used inside Providers");
  }

  return context;
}