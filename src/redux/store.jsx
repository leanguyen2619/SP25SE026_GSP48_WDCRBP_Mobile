import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import woodworkerReducer from './slice/woodworkerSlice'; 
import productReducer from './slice/productSlice';
import walletReducer from './slice/walletSlice';
import userAddressReducer from './slice/userAddressSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    woodworker: woodworkerReducer,
    product: productReducer,
    wallet: walletReducer, 
    userAddress: userAddressReducer,
  },
});

export default store; 
