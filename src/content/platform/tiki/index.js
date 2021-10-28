import React, { useEffect, useContext } from 'react';
import Header from './components/Header';
import Paper from '@mui/material/Paper';
import Body from './components/body';
import Footer from './components/Footer';
import { useDispatch } from 'react-redux';
import { checkLogin, getTotalOrderList } from './store/userSlice';
import AppContext from '../../AppContext';
const Main = props => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(checkLogin());
		// dispatch(getTotalOrderList());
	}, []);

	const appContext = useContext(AppContext);
	const { routerConfig, platform } = appContext;
	// console.log('props', props);
	// console.log('routerConfig, platform:', routerConfig, platform);
	return (
		<Paper
			variant="outlined"
			style={{ width: 350, height: 500, backgroundColor: 'whitesmoke', overflow: 'hidden' }}
		>
			<Header />
			<Body />
			<Footer />
		</Paper>
	);
};
export default Main;
