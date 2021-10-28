import { combineReducers } from '@reduxjs/toolkit';
import messageSlice from './messageSlice';
import userSlice from './userSlice';
import switchPageSlice from './switchPageSlice';
const reducer = combineReducers({
	message: messageSlice,
	user: userSlice,
	switchPage: switchPageSlice
	// switchPage: switchContentSlice,
	// detailAds: detailAdsSlice,
	// sortBy: SortAdsSlice,
	// requestAds: requestAdsSlice
});

export default reducer;
