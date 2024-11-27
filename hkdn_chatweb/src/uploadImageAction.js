import { uploadStart, uploadSuccess, uploadFailure } from './imageSlice';
import { uploadImage } from '../api'; // File API đã tạo ở bước 1

export const uploadImageAction = (file) => async (dispatch) => {
    dispatch(uploadStart());
    try {
        const imageData = await uploadImage(file); // Gửi ảnh qua API
        dispatch(uploadSuccess(imageData)); // Lưu vào store
    } catch (error) {
        dispatch(uploadFailure(error.message));
    }
};
