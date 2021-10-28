import React from 'react';
import TikiApp from '../platform/tiki/App';
import ShopeeApp from '../platform/shopee/App';

export default [
	{
		component: <TikiApp />,
		title: 'Tiki',
		platform: 'tiki'
		// icon: 'images/img/icon_home.svg',
		// currentFeature: FEATURES_ID.OVER_VIEW,
		// header: {
		// 	isShowLogo: true,
		// 	title: '',
		// 	isShowBack: false,
		// 	isShowSearch: false
		// }
	},
	{
		component: <ShopeeApp />,
		title: 'Shopee',
		platform: 'shopee'
		// icon: 'images/img/icon_home.svg',
		// currentFeature: FEATURES_ID.OVER_VIEW,
		// header: {
		// 	isShowLogo: true,
		// 	title: '',
		// 	isShowBack: false,
		// 	isShowSearch: false
		// }
	}
];
