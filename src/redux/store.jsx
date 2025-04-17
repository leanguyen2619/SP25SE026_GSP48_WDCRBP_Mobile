import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import woodworkerReducer from './slice/woodworkerSlice'; 
import productReducer from './slice/productSlice';
import walletReducer from './slice/walletSlice';
import userAddressReducer from './slice/userAddressSlice';
import authReducer from './slice/authSlice';
import cartReducer from './slice/cartSlice';
import designReducer from './slice/designSlice';
import transactionReducer from './slice/transactionSlice';
import provinceSlice from './slice/provinceSlice';
import districtSlice from './slice/districtSlice';
import wardSlice from './slice/wardSlice';
import ghnSlice from './slice/ghnSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    woodworker: woodworkerReducer,
    product: productReducer,
    wallet: walletReducer, 
    userAddress: userAddressReducer,
    auth: authReducer,
    cart: cartReducer,
    design: designReducer,
    transaction: transactionReducer,
    province: provinceSlice,
    district: districtSlice,
    ward: wardSlice,
    ghn: ghnSlice,
  },
});

export default store; 
