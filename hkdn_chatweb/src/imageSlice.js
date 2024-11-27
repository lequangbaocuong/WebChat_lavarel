import { createSlice } from '@reduxjs/toolkit';

const imageSlice = createSlice({
    name: 'image',
    initialState: {
        image: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        uploadStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        uploadSuccess: (state, action) => {
            state.isLoading = false;
            state.image = action.payload; // Dữ liệu ảnh từ API
        },
        uploadFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const { uploadStart, uploadSuccess, uploadFailure } = imageSlice.actions;
export default imageSlice.reducer;
