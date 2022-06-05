import {configureStore} from '@reduxjs/toolkit';

import userInfoReducer from './reducers/loginInformationSlice';

export default configureStore({
    reducer: {
        userInfo: userInfoReducer
    }
})