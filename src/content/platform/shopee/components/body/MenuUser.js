// import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Axios from 'axios';
function pxgPrice(number, fixed = 0) {
	if (isNaN(number)) return number;
	number = number.toFixed(fixed);
	let delimeter = ',';
	number += '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(number)) {
		number = number.replace(rgx, '$1' + delimeter + '$2');
	}
	return number;
}
const MenuUser = () => {
	const dispatch = useDispatch();
	const user = useSelector(state => state.ShopeeApp.user);
	const { email, phone_number, name, information } = user;
	const [shopOrdersId, setShopOrdersId] = useState([]);
	const handleDeleteCart = async () => {
		console.log('shopOrdersId', shopOrdersId);

		let delCart = await Axios({
			method: 'POST',
			url: 'https://shopee.vn/api/v4/cart/update',
			data: {
				action_type: 2,
				add_on_deal_sub_item_list: {
					use_coins: false,
					platform_vouchers: []
				},
				promotion_data: {
					free_shipping_voucher_info: {
						free_shipping_voucher_id: 0,
						free_shipping_voucher_code: null
					},
					platform_vouchers: [],
					use_coins: false
				},
				selected_shop_order_ids: shopOrdersId /* xem lại cái này */,
				updated_shop_order_ids: shopOrdersId,
				version: 3
			}
		}).then(res => res.data);
		console.log('del cart', delCart);
	};
	// Chọn tất cả các mục trong giỏ hàng action_type: 4;
	const hadleCheckAllOrderInCart = async () => {
		await Axios({
			method: 'POST',
			url: 'https://shopee.vn/api/v4/cart/update',
			data: {
				action_type: '4',
				add_on_deal_sub_item_list: [
					{
						add_on_deal_id: 5332308 /* id của giỏ hàng khi mới chạy hàm handleGetCart type: Number */,
						item_group_id: '5332308' /* id của giỏ hàng khi mới chạy hàm handleGetCart type: String */,
						sub_item_list: []
					}
				],
				pre_select: false,
				promotion_data: {
					free_shipping_voucher_info: {
						free_shipping_voucher_id: 0,
						free_shipping_voucher_code: null
					},
					platform_vouchers: [],
					use_coins: false
				}
			}
		});
	};
	const handleGetCart = async () => {
		// let order = await Axios.post('https://shopee.vn/api/v4/cart/get',{pre_selected_item_list: [],
		// version: 3}).then(res => res.data);
		let order = await Axios({
			method: 'POST',
			url: 'https://shopee.vn/api/v4/cart/get',
			data: {
				pre_selected_item_list: [],
				version: 3
			}
		}).then(res => res.data);
		console.log('order:', order);
		let shop_orders = order.data.shop_order_ids;
		setShopOrdersId([...shop_orders]);
	};
	console.log('user: ', user);
	return (
		<React.Fragment>
			<Typography variant="subtitle1" gutterBottom component="div">
				Tên đăng nhập: {name}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Email: {email}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Số điện thoại: {phone_number}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Tổng số tiền đã tiêu : {pxgPrice(information.total_merchandise_subtotal)}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Phí vận chuyển đã trả: {pxgPrice(information.total_shipping_price)}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Tiền giảm từ mã voucher shopee: {pxgPrice(information.total_shopee_voucher_applied)}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Tiền giảm từ mã voucher shop: {pxgPrice(information.total_shop_voucher_applied)}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Xu đã sử dụng: {information.total_coin_used}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Tổng xu: {information.total_coin_user_sum}
			</Typography>
		</React.Fragment>
	);
};

export default MenuUser;
