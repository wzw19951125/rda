import Vue from 'vue'
import App from './App'

import uView from "uview-ui"
Vue.use(uView);

// 工具类
import toolsJS from 'common/tools.js'
Vue.prototype.$tools = toolsJS;

// 常量类
import constJS from 'common/const.js'
Vue.prototype.$const = constJS;
// 蓝牙类
import blueJS from 'common/blue.js'
Vue.prototype.$blue = blueJS;
// 网络类
import httpJS from 'common/http.js'
Vue.prototype.$http = httpJS;
// 路由器
Vue.prototype.$navigateTo = function(params) {
	let data = JSON.stringify(params.data);
	uni.navigateTo({
		animationType: 'slide-in-left',
		url: params.path + '?params=' + data
	});
}
// Toast
Vue.prototype.$toast = function(text) {
	let uToast = this.$refs.uToast;
	if (uToast) uToast.show({
		duration: 3000,
		title: text,
		type: 'warning',
		position: 'center'
	});
}


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
