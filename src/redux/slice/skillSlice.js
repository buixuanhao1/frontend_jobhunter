import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllSkillAPI } from '../../services/api.service';

// Async thunk để fetch skills
export const fetchSkill = createAsyncThunk(
    'skill/fetchSkill',
    async ({ query }) => {
        const response = await fetchAllSkillAPI(query);
        return response.data;
    }
);

const initialState = {
    result: [],
    isFetching: false,
    isError: false,
    meta: {
        page: 1,
        pageSize: 10,
        total: 0
    }
};

export const skillSlice = createSlice({
    name: 'skill',
    initialState,
    reducers: {
        // Các reducers thông thường nếu cần
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSkill.pending, (state) => {
                state.isFetching = true;
                state.isError = false;
            })
            .addCase(fetchSkill.fulfilled, (state, action) => {
                state.isFetching = false;
                state.result = action.payload.result;
                state.meta = {
                    page: action.payload.meta.page,
                    pageSize: action.payload.meta.pageSize,
                    total: action.payload.meta.total
                };
            })
            .addCase(fetchSkill.rejected, (state) => {
                state.isFetching = false;
                state.isError = true;
            });
    },
});

// Export reducer
export default skillSlice.reducer; 