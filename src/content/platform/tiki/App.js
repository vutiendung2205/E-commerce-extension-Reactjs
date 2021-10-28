/* global chrome */
import React, { useState, useEffect } from 'react';
import Provider from 'react-redux/es/components/Provider';
// import store from '../../store';
import store from 'content/store';
import AppContext from './../../AppContext';
import axios from 'axios';
import moment from 'moment';
import $ from 'jquery';
import { api } from 'utils';
// import { API_SAVE_FACEBOOK_ADS_TRACKING } from 'config/constants.js';
// import loadingImage from './images/loading-alt.gif';
// import withReducer from 'popup/store/withReducer';
import withReducer from 'content/store/withReducer';
import reducer from './store';
// import { createGenerateClassName, jssPreset, StylesProvider } from '@material-ui/core/styles';
import jssExtend from 'jss-plugin-extend';
import rtl from 'jss-rtl';
import { create } from 'jss';
import { toggleExtension } from './store/messageSlice';
import Draggable from 'react-draggable';
import { Height } from 'devextreme-react/chart';
import Main from './index.js';
var _ = require('lodash');
let findValuesDeepByKey = (obj, key, res = []) =>
	_.cloneDeepWith(obj, (v, k) => {
		k == key && res.push(v);
	}) && res;

let isBody = true;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message == 'CHECK_OPEN') {
		console.log('message: check open', store.getState().TikiApp.message.isExtensionOpen);
		sendResponse({ isExtensionOpen: store.getState().TikiApp.message.isExtensionOpen });
	}
	if (request.message == 'TOGGLE_EXTENSION') {
		if (request.isExtensionOpen == false) {
		}
		store.dispatch(toggleExtension(request.isExtensionOpen));

		sendResponse({ message: 'finish' });
	}
	return true;
});
/**
 * Cấu trúc các thành phần giao diện
 * Truyền các config chính cho platfrom
 * Quản lý event Ẩn/Hiện extension
 * @param {*} pageType Loại page của platform
 * @param {*} isExtensionOpen status Open Extension
 */
const App = ({ pageType, platform }) => {
	const [loading, setLoading] = useState(true);
	const timer = () => setLoading(false);
	useEffect(() => {
		const id = setInterval(timer, 2000);
		return () => {
			clearInterval(id);
		};
	}, [loading]);
	//
	const [isOpen, setIsOpen] = useState(store.getState().TikiApp.message.isExtensionOpen);
	store.subscribe(() => {
		isOpen != store.getState().TikiApp.message.isExtensionOpen &&
			setIsOpen(store.getState().TikiApp.message.isExtensionOpen);
	});
	//
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const onStop = (event, data) => {
		// Viewport (wrapper)
		const documentElement = document.documentElement;
		const wrapperHeight = window.innerHeight || documentElement.clientHeight;
		const wrapperWidth = window.innerWidth || documentElement.clientWidth;

		// Draggable element center coordinates (x,y)
		// Here we assume that the Draggable Button (from the question)
		// is a rectangle. But we can easily change it with whatever
		// figure we want and fine-tune the calculation.
		// Credits: https://stackoverflow.com/a/18932029/4312466
		const center = {
			x: data.x + data.node.clientWidth / 2,
			y: data.y + data.node.clientHeight / 2
		};

		// The margin from the draggable's center,
		// to the viewport sides (top, left, bottom, right)
		const margin = {
			top: center.y - 0,
			left: center.x - 0,
			bottom: wrapperHeight - center.y,
			right: wrapperWidth - center.x
		};

		// When we get the nearest viewport side (below), then we can
		// use these metrics to calculate the new draggable sticky `position`
		const position = {
			top: { y: 0, x: data.x },
			left: { y: data.y, x: 0 },
			bottom: { y: wrapperHeight - data.node.clientHeight, x: data.x },
			right: { y: data.y, x: wrapperWidth - data.node.clientWidth }
		};

		// Knowing the draggable's margins to the viewport sides,
		// now we can sort them out and get the smaller one.
		// The smallest margin defines the nearest viewport side to draggable.
		const sorted = Object.keys(margin).sort((a, b) => margin[a] - margin[b]);
		const nearestSide = sorted[0];
		setPosition(position[nearestSide]);
		// this.setState({ position: position[nearestSide] })
	};
	console.log('isOpen', isOpen);
	console.log(pageType, platform);
	return (
		<AppContext.Provider
			value={{
				// pageType,
				platform: 'tiki'
			}}
		>
			<Provider store={store}>{isOpen && <Main />}</Provider>
		</AppContext.Provider>
	);
};

// export default App;
export default withReducer('TikiApp', reducer)(App);
