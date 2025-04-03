import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import woodworkerReducer from './slice/woodworkerSlice'; 
import productReducer from './slice/productSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    woodworker: woodworkerReducer,
    product: productReducer,
  },
});

export default store; 
