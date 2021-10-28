import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

export const checkLogin = createAsyncThunk('Tiki/user/checkLogin', async () => {
	return await Axios.get('https://tiki.vn/api/v2/me').then(res => res.data);
});

export const getTotalOrderList = createAsyncThunk('Tiki/user/getTotalOrderList', async () => {
	// return totalOrderList;
});
const initialState = {
	isLoggedIn: false,
	account_type: null,
	email: null,
	birthday: null,
	username: null,
	gender: null,
	name: null,
	phone_number: null,
	created_date: null,
	reward_point: 0,
	information: {
		total_merchandise_subtotal: 0,
		total_shipping_fee: 0,
		total_shipping_price: 0,
		total_shop_voucher_applied: 0,
		total_shopee_voucher_applied: 0,
		total_coin_used: 0,
		total_coin_user_sum: 0
	}
};
const userSlice = createSlice({
	name: 'Tiki/user',
	initialState: initialState,
	reducers: {},
	extraReducers: {
		[checkLogin.rejected]: (state, action) => {
			state = initialState;
		},
		[checkLogin.fulfilled]: (state, action) => {
			console.log('user data: ', action.payload);
			const dataUser = action.payload;
			if (dataUser.account_type != null) {
				state.isLoggedIn = true;
				state.account_type = dataUser.account_type;
				state.email = dataUser.email;
				state.birthday = dataUser.birthday;
				state.username = dataUser.username;
				state.gender = dataUser.gender;
				state.name = dataUser.name;
				state.phone_number = dataUser.phone_number;
				state.created_date = dataUser.created_date;
				state.reward_point = dataUser.reward_point;
			} else {
				state = initialState;
			}
		},
		[getTotalOrderList.fulfilled]: (state, action) => {
			state.information = action.payload;
		},
		[getTotalOrderList.pending]: (state, action) => {
			state.information = {
				total_merchandise_subtotal: 'loading...',
				total_shipping_fee: 'loading...',
				total_shipping_price: 'loading...',
				total_shop_voucher_applied: 'loading...',
				total_shopee_voucher_applied: 'loading...',
				total_coin_used: 'loading...',
				total_coin_user_sum: 'loading...'
			};
		},
		[getTotalOrderList.rejected]: (state, action) => {
			state.information = {
				total_merchandise_subtotal: 0,
				total_shipping_fee: 0,
				total_shipping_price: 0,
				total_shop_voucher_applied: 0,
				total_shopee_voucher_applied: 0,
				total_coin_used: 0,
				total_coin_user_sum: 0
			};
		}
	}
});

const { reducer, actions } = userSlice;
export const {} = actions;

export default reducer;
