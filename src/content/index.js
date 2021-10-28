/* global chrome */
import React from 'react';
import { render } from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import { createGenerateClassName, jssPreset, StylesProvider } from '@material-ui/core/styles';
import { create } from 'jss';
import routerConfig from './platform/routerConfig';
/**
 * Khởi tạo React UI
 */
(async () => {
	function dragElement(elm) {
		var pos1 = 0,
			pos2 = 0,
			pos3 = 0,
			pos4 = 0;
		if (document.getElementById('#handle-header-extension')) {
			// if present, the header is where you move the DIV from:
			document.getElementById('#handle-header-extension').onmousedown = dragMouseDown;
		} else {
			// otherwise, move the DIV from anywhere inside the DIV:
			elm.onmousedown = dragMouseDown;
		}

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			console.log('top:', elm.offsetTop - pos2);
			console.log('left:', elm.offsetLeft - pos1);
			console.log('window: ', document.body.clientWidth);
			elm.style.top = elm.offsetTop - pos2 > 0 ? elm.offsetTop - pos2 + 'px' : '0px';
			// elm.style.left = elm.offsetLeft - pos1 > 0 ? elm.offsetLeft - pos1 + 'px' : '0px';
			if (elm.offsetLeft + 352 - pos1 > 0) {
				if (elm.offsetLeft + 352 - pos1 > document.body.clientWidth) {
					elm.style.left = document.body.clientWidth - 352 + 'px';
				} else {
					elm.style.left = elm.offsetLeft - pos1 + 'px';
				}
			} else {
				elm.style.left = '0px';
			}
			// set the element's new position:
			// elm.style.top = elm.offsetTop - pos2 + 'px';
			// elm.style.left = elm.offsetLeft - pos1 + 'px';
		}

		function closeDragElement() {
			// stop moving when mouse button is released:
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
	/**
	 * Append To body
	 */
	const body = document.getElementsByTagName('BODY')[0];
	const extensionContainer = document.createElement('mdi-window');
	extensionContainer.id = 'storm-extension';
	extensionContainer.style.position = 'absolute';
	extensionContainer.style.top = '40px';
	extensionContainer.style.left = '40px';
	extensionContainer.style.borderRadius = '10px';
	extensionContainer.style.overflow = 'hidden';
	extensionContainer.style.zIndex = 12343513245;
	if (body) body.append(extensionContainer);

	let styles = Object.keys(document.getElementsByTagName('style'));
	const shadowRoot = document.getElementById(extensionContainer.id);
	const reactRoot = shadowRoot.appendChild(document.createElement('div'));
	const jss = create({ ...jssPreset() });
	const generateClassName = createGenerateClassName();

	dragElement(document.getElementById('storm-extension'));
	var currentUrl = window.location.hostname.split('.')[0];

	const currentApp = domain => {
		console.log('currentUrl', currentUrl);
		return routerConfig.filter(v => v.platform == currentUrl)[0].component;
	};
	try {
		render(
			<StylesProvider jss={jss} generateClassName={generateClassName}>
				{currentApp(currentUrl)}
			</StylesProvider>,
			shadowRoot
		);
		retargetEvents(shadowRoot);
	} catch (error) {
		// console.log('error: ', error);
	}
})();
