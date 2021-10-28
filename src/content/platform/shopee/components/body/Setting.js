import React from 'react';
import { Typography, Paper } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
const Setting = () => {
	return (
		<FormGroup style={{ height: '400px', padding: '15px' }}>
			<FormControlLabel
				control={<Switch defaultChecked />}
				style={{ display: 'inline' }}
				labelPlacement="start"
				label="Tự động nhận voucher"
			/>
		</FormGroup>
	);
};
export default Setting;
