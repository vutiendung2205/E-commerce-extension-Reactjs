import { combineReducers } from '@reduxjs/toolkit';
import messageSlice from './messageSlice';
import userSlice from './userSlice';
import switchPageSlice from './switchPageSlice';
// import gameSettingSlice from './gameSettingSlice';
const reducer = combineReducers({
	message: messageSlice,
	user: userSlice,
	switchPage: switchPageSlice
});

export default reducer;
