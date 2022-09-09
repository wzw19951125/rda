<template>
	<view class="pages">
		<u-navbar :title=title title-color="#FFFFFF" title-size="40" :is-fixed="true" back-icon-color="#FFF" :is-back="true" :background="$tools.navbarBg()"></u-navbar>
		<view class="pages">
			<view class="pages-row" v-if="title=='使用量详情'">
				<text>{{date[0]}}</text>
				<text>至</text>
				<text>{{date[1]}}</text>
			</view>
		</view>
		<view class="pages">
			<scroll-view class="logcat" scroll-y="true" >
				<view v-for="(item,index) in date" :key='index'>
					<text>{{item+"  "+index}}</text>
				</view>
			</scroll-view>
		</view>
	</view>
	
</template>

<script>
	export default{
		data(){
			return {
				title : '',
				date: ["2020-03-25","2020-03-27"],
			};
		},
		onLoad(params) {
			console.log(params);
			this.title =JSON.parse(params.params).detailName;
		}
	}
</script>

<style>
	.pages.row{
		align-items: center;
		flex-direction: row;
		height: 90rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-bottom: solid 2rpx #E4E7ED;
	}
</style>
