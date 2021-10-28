/* global chrome */
import axios from 'axios';

export default {
	get(url, params, headers = {}) {
		// console.log('getttttttt');
		return new Promise((resolve, reject) =>
			chrome.runtime.sendMessage(
				{ message: 'API', data: { url, method: 'GET', params }, headers },
				({ result, error }) => {
					if (error) return reject(error);
					else return resolve(result);
				}
			)
		);
	},
	post(url, data) {
		// console.log('post ', url, data);
		return new Promise((resolve, reject) =>
			chrome.runtime.sendMessage({ message: 'API', data: { url, method: 'POST', data } }, ({ result, error }) => {
				if (error) return reject(error);
				else return resolve(result);
			})
		);
	},
	delete(url, data) {
		return new Promise((resolve, reject) =>
			chrome.runtime.sendMessage(
				{ message: 'API', data: { url, method: 'DELETE', data } },
				({ result, error }) => {
					if (error) return reject(error);
					else return resolve(result);
				}
			)
		);
	},
	apiCalling(objCalling) {
		return axios({
			...objCalling,
			headers: {
				'x-type': 'extension'
			}
		})
			.then(r => ({ result: r.data, error: null }))
			.catch(error => ({ result: null, error }));
	}
};
