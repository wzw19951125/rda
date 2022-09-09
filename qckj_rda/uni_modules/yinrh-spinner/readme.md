## yinrh-spinner
仿Spinner下拉组件

## 使用方法
在``template``中直接使用
```
<yinrh-spinner :list="list" title="连接表具:" />
```
或者
```
<yinrh-spinner ref="uMeter" title="气表型号:"  type="jump" />
```

## 参数说明
+ width：组件宽度，默认686，单位rpx，最小值240
+ title：标题
+ hint：无内容时的提示信息
+ list：列表，格式如[{name:''},{name:''},{name:''}]，必须含有name字段
+ type：类型，drop-下拉，jump-跳转
+ jump：跳转
+ drop：选中时的回调方法，返回{name:''}
+ error：下拉时，拦截list的长度为0的回调方法