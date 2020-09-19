<template>
	<div id="detail">
		<detail-nav-bar class="detail-nav" @itemClick="itemClick" ref="nav"></detail-nav-bar>
		<scroll class="content" ref="scroll" :probe-type="3"  @scroll="contentScroll">
			<!-- <div>{{$store.state.cartList.length}}</div> -->
			<!-- <ul>
				<li v-for="(item,index) in $store.state.cartList" :key="index">{{item}}</li>
			</ul> -->
			<detail-swiper :top-images="topImages"></detail-swiper>
			<detail-base-info :goods="goods"></detail-base-info>
			<detail-shop-info :shop="shop"></detail-shop-info>
			<detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
			<detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
			<detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
			<goods-list ref="recommend" :goods="recommends"></goods-list>
		</scroll>
		<detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
		<back-top v-show="isShowBackTop"  @click.native="backClick"></back-top>
		<toast :message="message" :show="show"></toast>
		
		
		
	</div>
</template>

<script>
	import DetailNavBar from "./childComps/DetailNavBar.vue"
	import DetailSwiper from "./childComps/DetailSwiper.vue"
	import DetailBaseInfo from "./childComps/DetailBaseInfo.vue"
	import DetailShopInfo from "./childComps/DetailShopInfo.vue"
	import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue"
	import DetailParamInfo from "./childComps/DetailParamInfo.vue"
	import DetailCommentInfo from "./childComps/DetailCommentInfo.vue"
	import DetailBottomBar from "./childComps/DetailBottomBar.vue"
	import BackTop from "../../components/content/backTop/BackTop.vue"
	import Toast from "../../components/common/toast/Toast.vue"
	
	import Scroll from "../../components/common/scroll/Scroll.vue"
	import GoodsList from "../../components/content/goods/GoodsList.vue"
	import {debounce} from "../../common/utils.js"
	
	import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "../../network/detail.js"
	export default{
		name:"Detail",
		components:{
			DetailNavBar,
			DetailSwiper,
			DetailBaseInfo,
			DetailShopInfo,
			Scroll,
			DetailGoodsInfo,
			DetailParamInfo,
			DetailCommentInfo,
			GoodsList,
			DetailBottomBar,
			BackTop,
			Toast
		},
		data(){
			return {
				iid:null,
				topImages:[],
				goods:{},
				shop:{},
				detailInfo:{},
				paramInfo:{},
				commentInfo:{},
				recommends:[],
				themeTopYs:[],
				getThemeTopY:null,
				currentIndex:0,
				isShowBackTop:false,
				tabOffsetTop:0,
				show:false,
				message:""
				
			}
		},
		created() {
			// 保存传入的iid
			this.iid = this.$route.params.iid,
			// 根据iid请求详情数据
			getDetail(this.iid).then(res => {
				// console.log(res)
				const data = res.result
				this.topImages = data.itemInfo.topImages
				// 获取商品信息
				this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
				// 获取店铺信息
				this.shop = new Shop(data.shopInfo)
				// 保存商品详情数据
				this.detailInfo = data.detailInfo
				// 获取参数信息
				this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
				// 获取评论信息
				if(data.rate.cRate !== 0){
					this.commentInfo = data.rate.list[0]
				}
				// this.getThemeTopY = debounce(() => {
				// 	this.themeTopYs = []
				// 	this.themeTopYs.push(0)
				// 	this.themeTopYs.push(this.$refs.params.$el.offsetTop)
				// 	this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
				// 	this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
				// 	console.log(this.themeTopYs)
				// })
				
	// 			this.$nextTick(() => {
	// // 根据最新数据，对应DOM是已经渲染出来了 但是图片依然没有加载完（offsetTop不包含图片）
	// 				this.themeTopYs = []
	// 				this.themeTopYs.push(0)
	// 				this.themeTopYs.push(this.$refs.params.$el.offsetTop)
	// 				this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
	// 				this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
	// 				console.log(this.themeTopYs)
					
	// 			})
				
			}),
			// 请求推荐数据
			getRecommend().then(res => {
				console.log(res)
				this.recommends = res.data.list
			})
			
		},
		updated() {
			
		},
		methods:{
			imageLoad(){
				this.$refs.scroll.refresh()
				this.themeTopYs = []
				this.themeTopYs.push(0)
				this.themeTopYs.push(this.$refs.params.$el.offsetTop)
				this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
				this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
				console.log(this.themeTopYs)
				
			},
			itemClick(index){
				console.log(index)
				this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
			},
			contentScroll(position){
				// console.log(position) 获取y值
				const positionY = -position.y
				// positionY与主题中值进行对比
				let length = this.themeTopYs.length
				for(let i = 0; i< length; i++ ){
					// console.log(i)
					// if(positionY > this.themeTopYs[parseInt(i)] && positionY < this.themeTopYs[parseInt(i)+1]){
					// 	console.log(i)
					// }
					
					if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])|| 
					(i === length-1 && positionY > this.themeTopYs[i]))){
						this.currentIndex = i
						console.log(this.currentIndex)
						this.$refs.nav.currentIndex = this.currentIndex
					}
				}
				this.isShowBackTop = -(position.y) > 1000
				// 决定tabcontrol是否吸顶
				// this.isTabFixed = (-position.y) > this.tabOffsetTop +30
				
			},
			backClick(){
				this.$refs.scroll.scrollTo(0,0)
			},
			addToCart(){
				// 1.获取需要展示购物车的商品信息
				const product = {}
				product.image = this.topImages[0]
				product.title = this.goods.title
				product.desc = this.goods.desc
				product.price = this.goods.realPrice
				product.iid = this.iid
				// 2.将商品添加到购物车
				// this.$store.commit("addCart",product)
				this.$store.dispatch("addCart",product).then(res => {
					// console.log(res) 模态框
					this.show = true
					this.message = res
					setTimeout(() => {
						this.show = false
						this.message = ""
					},1500)
					
				})
				// 
			}
		
			
	}
}
</script>

<style scoped>
	#detail{
		position: relative;
		z-index: 9;
		background-color: #fff;
		height: 100vh;
	}
	.detail-nav{
		position: relative;
		z-index: 9;
		background-color: #fff;
	}
	.content{
		height:calc(100% - 44px - 49px);
		overflow: hidden;
	}
</style>
