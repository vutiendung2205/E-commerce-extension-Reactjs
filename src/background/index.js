// 'use strict';
/* global chrome */
import qs from 'query-string';
import axios from 'axios';
import { api } from '../utils';
import { reject, result } from 'lodash';

chrome.runtime.onInstalled.addListener(async function () {
	console.log('browser');
});
const networkFilters = {
	urls: ['*://*.facebook.com/ajax/*', '*://*.facebook.com/api/graphql/']
};
chrome.action.onClicked.addListener(function (tab) {
	console.log('background onclick');
	if (tab.url.substr(0, 9) == 'chrome://') return;
	// console.log('browserAction.onClicked: ', tab);

	chrome.tabs.get(tab.id, () => {
		console.log('tab.id', tab.id);
		if (chrome.runtime.lastError) {
			console.log(chrome.runtime.lastError.message);
		} else {
			chrome.tabs.sendMessage(tab.id, { message: 'CHECK_OPEN' }, reponse => {
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
					// Handle errors from chrome.tabs.query
				}
				if (reponse) {
					let { isExtensionOpen } = reponse;
					console.log('isExtensionOpen', isExtensionOpen);
					chrome.storage.local.set({ isExtensionOpen: !isExtensionOpen }, function () {
						chrome.tabs.sendMessage(
							tab.id,
							{ message: 'TOGGLE_EXTENSION', isExtensionOpen: !isExtensionOpen },
							() => {
								if (chrome.runtime.lastError) {
									console.log(chrome.runtime.lastError.message);
									// Handle errors from chrome.tabs.query
								}
							}
						);
					});
				}
			});
		}
	});
});

(async () => {
	// chrome.tabs.onActivated.addListener(function (activeInfo) {
	// 	getActivatedTab();
	// });
	// function getActivatedTab() {
	// 	chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
	// 		try {
	// 			if (tabs[0] != undefined) {
	// 				console.log(tabs[0].url);
	// 			}
	// 		} catch (err) {
	// 			setTimeout(function () {
	// 				getActivatedTab();
	// 			}, 100);
	// 		}
	// 	});
	// }
	console.log('Run 1');
	let dataString = {};
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (chrome.runtime.lastError) {
			// console.log(chrome.runtime.lastError.message);
		} else {
			// Tab exists
			if (request.message === 'API') {
				api.apiCalling(request.data).then(r => {
					return sendResponse(r);
				});
			}
			if (request.message == 'set Badge Text') {
				chrome.browserAction.setBadgeText({
					text: request.text
				});
				sendResponse(true);
			}
			if (request.message === 'getURL') {
				chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
					let url = tabs[0].url;
					sendResponse(url);
				});
			}
		}

		return true;
	});
})();
