import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../store/switchPageSlice';
export default function Footer() {
	// const [value, setValue] = React.useState('user');
	const dispatch = useDispatch();

	const { page } = useSelector(state => state.ShopeeApp.switchPage);
	const handleChange = (event, newValue) => {
		// setValue(newValue);
		dispatch(setPage(newValue));
	};
	console.log('this is Shopee');
	const state = useSelector(state => state.App);
	console.log('state:', state);
	return (
		<BottomNavigation
			sx={{ width: '100%' }}
			value={page}
			onChange={handleChange}
			style={{ position: 'absolute', bottom: 0, left: 0, height: '56px' }}
		>
			<BottomNavigationAction label="User" value="user" icon={<PersonIcon />} />
			<BottomNavigationAction label="Setting" value="setting" icon={<SettingsIcon />} />
		</BottomNavigation>
	);
}
