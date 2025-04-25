import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext({});

// Maximum allowed quantity per cart item
const MAX_QUANTITY = 4;

export const CartProvider = ({ children }) => {
  // Initialize cart with structure { designs: {}, products: {} }
  const [cart, setCart] = useState({ designs: {}, products: {} });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart data from AsyncStorage on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load cart from AsyncStorage:", error);
        setIsLoaded(true);
      }
    };

    loadCart();
  }, []);

  // Save to AsyncStorage whenever cart changes
  useEffect(() => {
    if (isLoaded) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem("cart", JSON.stringify(cart));
        } catch (error) {
          console.error("Failed to save cart to AsyncStorage:", error);
        }
      };

      saveCart();
    }
  }, [cart, isLoaded]);

  // Add design to cart
  const addDesignToCart = (designItem) => {
    setCart((prevCart) => {
      const woodworkerId = designItem.woodworkerId;

      // Deep clone the current cart to avoid mutation issues
      const newCart = JSON.parse(JSON.stringify(prevCart));

      if (!newCart.designs[woodworkerId]) {
        newCart.designs[woodworkerId] = [];
      }

      // Check if the same variant already exists in cart
      const existingItemIndex = newCart.designs[woodworkerId].findIndex(
        (item) => item.designIdeaVariantId === designItem.designIdeaVariantId
      );

      if (existingItemIndex >= 0) {
        // Increment quantity if item exists, but respect the maximum limit
        const currentQuantity =
          newCart.designs[woodworkerId][existingItemIndex].quantity;
        const newQuantity = Math.min(
          currentQuantity + designItem.quantity,
          MAX_QUANTITY
        );
        newCart.designs[woodworkerId][existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item with quantity respecting the maximum limit
        designItem.quantity = Math.min(designItem.quantity, MAX_QUANTITY);
        newCart.designs[woodworkerId].push(designItem);
      }

      return newCart;
    });
  };

  // Remove design from cart
  const removeDesignFromCart = (woodworkerId, designVariantId) => {
    setCart((prevCart) => {
      const newCart = JSON.parse(JSON.stringify(prevCart));

      if (newCart.designs[woodworkerId]) {
        newCart.designs[woodworkerId] = newCart.designs[woodworkerId].filter(
          (item) => item.designIdeaVariantId !== designVariantId
        );

        // Remove woodworker entry if no more items
        if (newCart.designs[woodworkerId].length === 0) {
          delete newCart.designs[woodworkerId];
        }
      }

      return newCart;
    });
  };

  // Change quantity of a design in cart
  const changeDesignQuantity = (woodworkerId, designVariantId, newQuantity) => {
    // Enforce maximum quantity limit
    const limitedQuantity = Math.min(newQuantity, MAX_QUANTITY);

    setCart((prevCart) => {
      const newCart = JSON.parse(JSON.stringify(prevCart));

      if (newCart.designs[woodworkerId]) {
        const itemIndex = newCart.designs[woodworkerId].findIndex(
          (item) => item.designIdeaVariantId === designVariantId
        );

        if (itemIndex >= 0) {
          newCart.designs[woodworkerId][itemIndex].quantity = limitedQuantity;
        }
      }

      return newCart;
    });
  };

  // Add product to cart
  const addProductToCart = (productItem) => {
    setCart((prevCart) => {
      const woodworkerId = productItem.woodworkerId;

      // Deep clone the current cart to avoid mutation issues
      const newCart = JSON.parse(JSON.stringify(prevCart));

      if (!newCart.products[woodworkerId]) {
        newCart.products[woodworkerId] = [];
      }

      // Check if the same product already exists in cart
      const existingItemIndex = newCart.products[woodworkerId].findIndex(
        (item) => item.productId === productItem.productId
      );

      if (existingItemIndex >= 0) {
        // Increment quantity if item exists, but respect the maximum limit
        const currentQuantity =
          newCart.products[woodworkerId][existingItemIndex].quantity;
        const newQuantity = Math.min(
          currentQuantity + productItem.quantity,
          MAX_QUANTITY
        );
        newCart.products[woodworkerId][existingItemIndex].quantity =
          newQuantity;
      } else {
        // Add new item with quantity respecting the maximum limit
        productItem.quantity = Math.min(
          productItem.quantity || 1,
          MAX_QUANTITY
        );
        newCart.products[woodworkerId].push(productItem);
      }

      return newCart;
    });
  };

  // Remove product from cart
  const removeProductFromCart = (woodworkerId, productId) => {
    setCart((prevCart) => {
      const newCart = JSON.parse(JSON.stringify(prevCart));

      if (newCart.products[woodworkerId]) {
        newCart.products[woodworkerId] = newCart.products[woodworkerId].filter(
          (item) => item.productId !== productId
        );

        // Remove woodworker entry if no more items
        if (newCart.products[woodworkerId].length === 0) {
          delete newCart.products[woodworkerId];
        }
      }

      return newCart;
    });
  };

  // Change quantity of a product in cart
  const changeProductQuantity = (woodworkerId, productId, newQuantity) => {
    // Enforce maximum quantity limit
    const limitedQuantity = Math.min(newQuantity, MAX_QUANTITY);

    setCart((prevCart) => {
      const newCart = JSON.parse(JSON.stringify(prevCart));

      if (newCart.products[woodworkerId]) {
        const itemIndex = newCart.products[woodworkerId].findIndex(
          (item) => item.productId === productId
        );

        if (itemIndex >= 0) {
          newCart.products[woodworkerId][itemIndex].quantity = limitedQuantity;
        }
      }

      return newCart;
    });
  };

  // Get total number of items in cart (designs + products)
  const getCartItemCount = () => {
    let count = 0;

    // Count design items
    Object.values(cart.designs).forEach((woodworkerItems) => {
      woodworkerItems.forEach((item) => {
        count += item.quantity;
      });
    });

    // Count product items
    Object.values(cart.products).forEach((woodworkerItems) => {
      woodworkerItems.forEach((item) => {
        count += item.quantity;
      });
    });

    return count;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addDesignToCart,
        removeDesignFromCart,
        changeDesignQuantity,
        addProductToCart,
        removeProductFromCart,
        changeProductQuantity,
        getCartItemCount,
        MAX_QUANTITY,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
