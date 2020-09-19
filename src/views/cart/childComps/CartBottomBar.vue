<template>
	<div class="cart-bottom-bar">
		<div class="check-content">
			<check-button class="check-button" :is-checked="isSelectAll" 
			@click.native="checkClick"></check-button>
			<span>全选</span>
		</div>
		<div class="price">
			合计：{{totalPrice}}
		</div>
		<div class="calculate">
			去计算({{checkLength}})
		</div>
	</div>
</template>

<script>
	import CheckButton from "../../../components/content/checkButton/CheckButton.vue"
	export default{
		name:"CartBottomBar",
		components:{
			CheckButton
		},
		computed:{
			totalPrice(){
				return "¥" + this.$store.state.cartList.filter(item => {
					return item.checked
				}).reduce((preValue,item) => {
					return preValue + item.price * item.count
				},0).toFixed(2)
			},
			checkLength(){
				return this.$store.state.cartList.filter(item => {
					return item.checked
				}).length
			},
			isSelectAll(){
				// 1.下面方法性能不高
				// if(this.$store.state.cartList.length === 0) return false
				// return !(this.$store.state.cartList.filter(item => !item.checked).length)
				if(this.$store.state.cartList.length === 0) return false
				return !this.$store.state.cartList.find(item => !item.checked)
			}
			
			
		},
		methods:{
			checkClick(){
				if(this.isSelectAll){ //全部选中 变全部不选中
					this.$store.state.cartList.forEach(item => item.checked = false)
				}else{ //全没选中 或部分没选中 变全选中
					this.$store.state.cartList.forEach(item => item.checked = true)
				}
				// 简化操作
				// this.$store.state.cartList.forEach(item => item.checked = !this.isSelectAll)
			}
		}
	}
</script>

<style scoped>
	.cart-bottom-bar{
		display: flex;
		height: 40px;
		background-color: #eee;
		position: relative;
		line-height: 40px;
		font-size: 14px;
		
	}
	.check-content{
		display: flex;
		align-items: center;
		margin-left: 10px;
		width: 60px;
	}
	.check-button{
		
		width: 20px;
		height: 20px;
		line-height: 20px;
		margin-right: 5px;
	}
	.price{
		margin-left: 30px;
		flex: 1;
	}
	.calculate{
		width: 90px;
		background-color: red;
		color: #fff;
		text-align: center;
	}
</style>
