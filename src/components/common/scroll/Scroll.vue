<template>
	<div class="wraper" ref="wrapper">
		<div class="content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	import BScroll from "better-scroll"
	export default{
		name:"Scroll",
		props:{
			probeType:{
				type:Number,
				default:0
			},
			pullUpLoad:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				scroll:null
			}
		},
		mounted(){
			//1. 创建BScroll对象
			// console.log(this.$refs.wrapper)
			this.scroll = new BScroll(this.$refs.wrapper,{
				probeType:this.probeType,
				pullUpLoad:this.pullUpLoad,
				click:true
			}),
			// 2.监听滚动位置
			this.scroll.on("scroll",(position) => {
				this.$emit("scroll",position)
			})
			// console.log(this.scroll)
			// 3.监听上拉加载更多
			this.scroll.on("pullingUp",() => {
				this.$emit("pullingUP")
			})
			
		},
		methods:{
			scrollTo(x,y,time=300){
				this.scroll && this.scrollTo && this.scroll.scrollTo(x,y,time)
			},
			finishPullUp(){
				this.scroll && this.scroll.finishPullUp()
			},
			refresh(){
				// console.log("-----")
				this.scroll && this.scroll.refresh()
			}
		}
	}
</script>

<style scoped>
	
</style>
