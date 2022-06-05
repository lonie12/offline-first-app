import { createSlice } from "@reduxjs/toolkit";

const loginInformationSlice = createSlice({
    name: 'userInfo',

    initialState: {
        connectedUser: null
    },

    reducers: {
        saveSession: (state, {payload}) => {
            state.connectedUser = payload
        }
    }
});

export const {saveSession} = loginInformationSlice.actions;

export default loginInformationSlice.reducer;