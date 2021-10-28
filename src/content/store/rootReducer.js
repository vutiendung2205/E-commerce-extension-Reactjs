import { combineReducers } from '@reduxjs/toolkit';

const createReducer = asyncReducers =>
	combineReducers({
		auth: () => ({ mock: true }),
		...asyncReducers
	});

export default createReducer;
