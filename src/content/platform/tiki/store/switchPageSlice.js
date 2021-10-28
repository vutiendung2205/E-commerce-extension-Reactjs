import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const switchPageSlice = createSlice({
	name: 'switchPage',
	initialState: {
		page: 'user'
	},
	reducers: {
		setPage: (state, action) => {
			state.page = action.payload;
		}
	},
	extraReducers: {}
});

const { reducer, actions } = switchPageSlice;
export const { setPage } = actions;

export default reducer;
