import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlice';
import skillReducer from './slice/skillSlice';

export const store = configureStore({
    reducer: {
        account: accountReducer,
        skill: skillReducer,
        // other reducers...
    },
});

export default store; 