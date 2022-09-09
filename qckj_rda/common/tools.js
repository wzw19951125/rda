

/**
 * Navbar的背景色（渐变）
 */
const navbarBg = function() {
	return {
		'background-image': 'linear-gradient(45deg, rgb(72, 165, 235), rgb(160, 212, 235))'
	};
}

/**
 * Navbar的高度（titleBar + statusBar）
 * @param {Number} height Navbar的高度，0时取系统值，单位px
 */
const navbarHeight = function(height) {
	let system_info = uni.getSystemInfoSync(),
		status = system_info.statusBarHeight;
	// #ifdef MP
	let isIos = 'ios' == system_info.platform,
		h = isIos ? 44 : 48;
	return (height > 0 ? height : h) + status;
	// #endif
	// #ifdef APP-PLUS || H5
	return (height > 0 ? height : 44) + status;
	// #endif
}

/**
 * Body的高度
 * @param {Number} use 已用的高度，单位px
 * @param {Number} nav Navbar的高度，0时取系统值，单位px
 */
const bodyHeight = function(use, nav) {
	let h = uni.getSystemInfoSync().screenHeight;
	return (h - navbarHeight(nav) - use) + 'px';
}

export default {
	navbarBg,
	bodyHeight
}
