var env = {
	default : "default"
}


var config = {
	 _3_0_licence: 'cY5eGxTrRcvELb+ZjHv7Fa1SB3I2mciXRDSaAPeFu63XZZKWd4+lPyIuCH42xFo7XqaArdutrLWnb' +
		'0woIE3qfkphrCnJL2XkBP7FFwMb1CTPNE7uz3ZxjNPe6Mz7tTnY4reM34GBDsNwdic1N7GEuekE2pDx6MaNEzYqaMej3e2' +
		'9MhWcZW/ECBxFu7AJR8s1b5OLBi5J3alc3XVlwslTrAeGYdBSJDGGj9mAKIuf0QbNN2CCvxoNZ36/dUfI8oXAVearoxukt' +
		'ONwYa3IqHBcPKktSk7+lgrAdeO3LYR31kffN1Fw+56U81MJbIVW/FJv6VTa3p1wf6rDEfZNIUZLUA==H3DUu2nRnldsk0w' +
		'Ahr5aUJLs8UGNAhhpRcL34Ake00KHCPWAzlMvc8MIJRwnJBmWGVcYcg338l519VVIVKK3TzZhXZXYQw+ojNT7I+ENZ/lnA' +
		'WNGimt4ypdiD7w05voQKwk/RWKNkiWpoAlZ3saZi89xRQrxumepm/4qfDR8QcRcsQnKd06P+uWXh315EM9kKz8P/wFrkbe' +
		'2Y2Bt5SO5u9uCytycEoDgn/V7pe6hWA/JnHC6QhHmmzrYOg+D0+u/S/2SCHhX7qB7Q68sN+2bc1ftTY2obDNanfwKH4edf' +
		'zvd1PxainctyczTs55gv37yqk85VO0eue7Giyymzk8yhg==',
	// _3_0_licence:"HQ+rcLoHnH4GJS7MZemfyijxZV88KgEti0swU8pl/K1OkPLVrnH2483V0z+j+K2FfdoZ8Rai8U+KYw6lfgo/e43/M3mRTc0tKDwvQGJiUbn2r71xjH66VUZiMqWT3qylCaKXC2LmWxgVzSZbQhCSniOysV94DBsL5TZmmiI/ipTehVxhlVMCowncz6sYmnBqfuokqju10f0TEZMoZJ+aXwpiN/5QKPB272yz0htBVNKK//9/dw5QmhQNDkrFwVLCtNjTvmXjy23zEoV5Nv+fIY0Z+FvzpEenTYKMZIVQbByUFJnPxRJ96ej/8R42zlIXMobCy/uzn6wb3FHnzoif1Q==t9ouwsN5Op9Ag9KDqaVc2z53BFZZSkNynN/x4iOJyIxirsU77fMpsaZIYynpmQi0wcTpIbBwYDqV3Zsp1Dhq9SiRcUKN8JaL0TaIn2nkzzHucBD3QZtVEsVfGDtdLtvigPW0QFSuiTVcEk393sxZKwgBXVTPhx+Ttn5NrdZVhXwR3rUvgaUnpJA+be19RYUYlTWD1kIexBZ/wPEvL913OanUh3JA+bcbePcfHD51SPdLSYNYQTsVMcMoq7M5YLlbBE91JRXLcTi394IBSguAdUB7Y68yK8W+h4Dmk3x/M7ntUbl2v70gwaJ0n7SosIOEm59Tehhkkh/LOWi86z1awA==",
	  
	  // _3_0_login : 'http://222.212.93.70:60012/qnms/V1_0_0/account/login',
	  // _3_0_report : 'http://222.212.93.70:60012/communication/DeviceUpload',
	  _3_0_login : 'https://lysb3.qc91.cdqckj.com/qnms/V1_0_0/account/login',
	  _3_0_report : 'https://lysb3.qc91.cdqckj.com/communication/DeviceUpload',
	  _mp_app_id : 'wxbaf4488c8e76d2f6', // 小程序appid
	  _mp_mch_id : '1289915201', // 商户号mchid
	  _7_0_openid : '/basic/remoteinterface/WXOpenIdRequest.ashx?',
	  _7_0_hostUrl: '/basic/remoteinterface/ServiceInterface.ashx?Data='
}

const chooseConfig = function(code){
	switch(code){
		case code==0:
			return defaultConfig;
	}
	
}

export default{
	config
}