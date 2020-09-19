<template>
	<div class="toast" v-show="show">
		<div >{{message}}</div>
	</div>
</template>

<script>
	export default{
		name:"Toast",
		props:{
			message:{
				type:String,
				default:""
			},
			show:{
				type:Boolean,
				default:false
			}
		}
		
	}
</script>

<style scoped>
	.toast{
		position: fixed;
		top:50%;
		left:50%;
		padding: 8px,10px;
		transform: translate(-50%,-50%);
		background-color: rgba(0,0,0,.7);
		height: 40px;
		line-height: 40px;
		font-size: 20px;
		border-radius: 8px;
		color: #fff;
	}
</style>
