// import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Axios from 'axios';
import moment from 'moment';
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
	const user = useSelector(state => state.TikiApp.user);
	const { birthday, created_date, email, gender, name, phone_number, reward_point, username } = user;
	const [shopOrdersId, setShopOrdersId] = useState([]);

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
				Ngày sinh : {moment.unix(birthday).format('L')}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Ngày tạo: {moment.unix(created_date).format('L')}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Giới tính: {gender}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Tiki xu: {reward_point}
			</Typography>
			<Typography variant="subtitle1" gutterBottom component="div">
				Nick name: {username}
			</Typography>
		</React.Fragment>
	);
};

export default MenuUser;
