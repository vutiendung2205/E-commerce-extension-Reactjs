import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const messageSlice = createSlice({
	name: 'message',
	initialState: {
		isExtensionOpen: true
	},
	reducers: {
		toggleExtension: (state, action) => {
			state.isExtensionOpen = typeof action.payload == 'undefined' ? !state.isExtensionOpen : action.payload;
		}
	},
	extraReducers: {}
});

const { reducer, actions } = messageSlice;
export const { toggleExtension } = actions;

export default reducer;
