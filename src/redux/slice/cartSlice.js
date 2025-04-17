import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      // Tạo unique key dựa trên tất cả các thuộc tính quan trọng
      const getItemKey = (item) => {
        const key = {
          id: item.id,
          configuration: item.configuration || {},
          price: item.price,
          name: item.name,
          timestamp: new Date().getTime() // Thêm timestamp để đảm bảo mỗi lần thêm đều là unique
        };
        return JSON.stringify(key);
      };

      const existingItem = state.items.find(item => 
        getItemKey(item) === getItemKey(newItem)
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ 
          ...newItem, 
          quantity: 1,
          cartItemKey: getItemKey(newItem) // Lưu key để dùng cho việc xóa/cập nhật
        });
      }
    },
    removeFromCart: (state, action) => {
      const keyToRemove = action.payload;
      state.items = state.items.filter(item => item.cartItemKey !== keyToRemove);
    },
    updateQuantity: (state, action) => {
      const { cartItemKey, change } = action.payload;
      const item = state.items.find(item => item.cartItemKey === cartItemKey);
      if (item) {
        const newQuantity = item.quantity + change;
        item.quantity = newQuantity > 0 ? newQuantity : 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 