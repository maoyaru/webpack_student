<template>
	<div>
		<div class="toaster" v-show="show">
			<div class="icon"></div>
			<div>{{msg}}</div>
		</div>
	</div>
</template>
<script>
	export default{
		data() {
			msg: 'Successfully added refer'
		}
	}
</script>
<style>
	.toaster{
		position: fixed;
		top: 50%;
		left: 50%;
		margin: -120px 0 0 -200px;
		width: 400px;
		height: 240px;
		color: #fff;
		padding: 150px 60px 60px;
		font-size: 20px;
		line-height: 32px;
		background: rgba(0,0,0,0.6);
		text-align:center;
		border-radius:10px;
		box-sizing:border-box;
		z-index:9999;
	}
	.toaster .icon{
		width: 68px;
		height: 68px;
		background: url(../../../assets/theme-default/images/common/sucess-icon.png) no-repeat 0 0/cover;
		position: absolute;
		top: 60px;
		left: 50%;
		margin-left: -32px;

	}
</style>