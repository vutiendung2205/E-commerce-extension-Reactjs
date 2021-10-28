import React from 'react';
import { Typography, Paper } from '@mui/material';
import MenuUser from './MenuUser';
import Setting from './Setting';
import { useSelector } from 'react-redux';
const Body = () => {
	const { page } = useSelector(state => state.ShopeeApp.switchPage);
	const switchPage = page => {
		switch (page) {
			case 'user':
				return <MenuUser />;
			case 'setting':
				return <Setting />;
			default:
				return <MenuUser />;
		}
	};
	return <div style={{ height: '400px', padding: '15px' }}>{switchPage(page)}</div>;
};
export default Body;
