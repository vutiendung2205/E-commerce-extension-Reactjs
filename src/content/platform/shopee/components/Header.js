import React from 'react';
import { Typography } from '@mui/material';

const Header = () => {
	return (
		<div style={{ height: '44px' }}>
			<Typography
				id="handle-header-extension"
				style={{
					margin: 'auto',
					textAlign: 'center',
					padding: '10px 0px',
					backgroundColor: '#F9F3DF',
					cursor: 'move'
				}}
			>
				IShopee
			</Typography>
		</div>
	);
};
export default Header;
