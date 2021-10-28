import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const gameSettingSlice = createSlice({
	name: 'message',
	initialState: {
		mode: 'PvP',
		square: 3
	},
	reducers: {
		setMode: (state, action) => {
			state.mode = action.payload;
		},
		setSquare: (state, action) => {
			state.mode = action.payload;
		}
	},
	extraReducers: {}
});

const { reducer, actions } = gameSettingSlice;
export const { setMode, setSquare } = actions;

export default reducer;
