import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

export const checkLogin = createAsyncThunk('shopee/user/checkLogin', async () => {
	return await Axios.get('https://shopee.vn/api/v2/user/account_info?skip_address=1').then(res => res.data);
});

export const getTotalOrderList = createAsyncThunk('shopee/user/getTotalOrderList', async () => {
	let offset = 0;
	let flag = true;
	let totalOrderList = new Array();
	while (flag) {
		await Axios.get('https://shopee.vn/api/v4/order/get_order_list?limit=50&list_type=3&offset=' + offset).then(
			res => {
				if (res.data.data.next_offset != -1) {
					offset = res.data.data.next_offset;
					let details_list = res.data.data.details_list;
					details_list.map(order => {
						totalOrderList = [...totalOrderList, order.info_card.order_id];
					});
					// totalOrderList = [...totalOrderList, ...res.data.data.details_list];
				} else {
					flag = false;
				}
			}
		);
	}
	let total_price = 0;
	// tổng phí vận chuyển đã giảm
	let total_shipping_price = 0;
	// tổng phí vận chuyển chưa giảm
	let total_shipping_fee = 0;
	let total_coin_used = 0;
	let total_merchandise_subtotal = 0;
	let total_shop_voucher_applied = 0;
	let total_shopee_voucher_applied = 0;
	let info_orders = Promise.all(
		totalOrderList.map(orderId => {
			return Axios.get('https://shopee.vn/api/v4/order/get_order_detail?order_id=' + orderId).then(res => {
				return res.data.data.info_card;
			});
		})
	);
	info_orders = await info_orders.then(res => res);
	info_orders.map(order => {
		// tính tổng số tiền phải trả

		total_price = total_price + order.final_total;
		// tính giá ship phải trả của đơn hàng;
		let parcel_cards = order.parcel_cards; /* số kiện hàng trong 1 đơn hàng */
		let shipping_fee_order = 0;
		parcel_cards.map(card => {
			let info_rows = card.payment_info.info_rows;
			//  giá ship của 1 kiện hàng
			let odp_shipping =
				info_rows.filter(v => v.info_label.text == 'label_odp_shipping')[0].info_value.value || 0;
			// gía ship đã giảm của 1 kiện hàng
			let odp_shipping_discount_subtotal = info_rows.filter(
				v => v.info_label.text == 'label_odp_shipping_discount_subtotal'
			)[0]
				? info_rows.filter(v => v.info_label.text == 'label_odp_shipping_discount_subtotal')[0].info_value.value
				: 0;
			// giá sản phẩm
			let odp_merchandise_subtotal = info_rows.filter(
				v => v.info_label.text == 'label_odp_merchandise_subtotal'
			)[0]
				? info_rows.filter(v => v.info_label.text == 'label_odp_merchandise_subtotal')[0].info_value.value
				: 0;
			//  mã giảm giá của shop
			let shop_voucher_applied = info_rows.filter(v => v.info_label.text == 'label_odp_shop_voucher_applied')[0]
				? info_rows.filter(v => v.info_label.text == 'label_odp_shop_voucher_applied')[0].info_value.value
				: 0;
			// số tiền giảm giá từ voucher của shopee
			let shopee_voucher_applied = info_rows.filter(
				v => v.info_label.text == 'label_odp_shopee_voucher_applied'
			)[0]
				? info_rows.filter(v => v.info_label.text == 'label_odp_shopee_voucher_applied')[0].info_value.value
				: 0;
			shipping_fee_order = shipping_fee_order + Number(odp_shipping) + Number(odp_shipping_discount_subtotal);
			//  số coin đã sử dụng
			let odp_redeemed_number_coins = info_rows.filter(
				v => v.info_label.text == 'label_odp_redeemed_number_coins'
			)[0]
				? info_rows.filter(v => v.info_label.text == 'label_odp_redeemed_number_coins')[0].info_value.value
				: 0;
			total_coin_used += Number(odp_redeemed_number_coins);
			total_shipping_fee += Number(odp_shipping);
			//
			total_merchandise_subtotal += Number(odp_merchandise_subtotal);
			total_shop_voucher_applied += Number(shop_voucher_applied);
			total_shopee_voucher_applied += Number(shopee_voucher_applied);
		});
		total_shipping_price += shipping_fee_order;
	});
	const total_coin_user_sum = await Axios.get('https://shopee.vn/api/v4/coin/get_user_coins_summary').then(
		res => res.data.coins.available_amount
	);
	const data = {
		total_merchandise_subtotal: total_merchandise_subtotal / 100000,
		total_shipping_fee: Math.round(total_shipping_fee / 100000),
		total_shipping_price: Math.round(total_shipping_price / 100000),
		total_shop_voucher_applied: Math.round(Math.abs(total_shop_voucher_applied / 100000)),
		total_shopee_voucher_applied: Math.round(Math.abs(total_shopee_voucher_applied / 100000)),
		total_coin_used: Math.round(Math.abs(total_coin_used / 100000)),
		total_coin_user_sum: total_coin_user_sum
	};
	return data;
	// return totalOrderList;
});
const initialState = {
	isLoggedIn: false,
	email: null,
	// email_valid: '',
	// gender: null,
	name: null,
	phone_number: null,
	// raw_email: null,
	created_date: null,
	// reward_point: 0,
	// userInformation: {},
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
	name: 'shopee/user',
	initialState: initialState,
	reducers: {},
	extraReducers: {
		[checkLogin.rejected]: (state, action) => {
			state = initialState;
		},
		[checkLogin.fulfilled]: (state, action) => {
			console.log('user data: ', action.payload);
			let dataUser = action.payload.data;
			if (action.payload.error == 0) {
				state.isLoggedIn = true;
				state.email = dataUser.email;
				// state.email_valid = '';
				// state.gender = null;
				state.name = dataUser.username;
				state.phone_number = dataUser.phone;
				// state.raw_email = null;
				// state.created_date = null;
				// state.reward_point = 0;
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
