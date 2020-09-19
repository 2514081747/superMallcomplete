<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
	<tab-control ref="tabControl1"
	 :titles="['新款','流行','精选']" @tabClick="tabClick" v-show="isTabFixed" ></tab-control>
	<scroll class="content" ref="scroll" 
	:probe-type="3" :pull-up-load="true" @scroll="contentScroll" @pullingUP="loadMore"> 
	<!-- @pullingUP="loadMore" -->
		<home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
		<recommend-view :recommends="recommends"/>
		<feature-view></feature-view>
		<tab-control ref="tabControl2"
		 :titles="['新款','流行','精选']" @tabClick="tabClick" ></tab-control>
		<goods-list :goods="showGoods"></goods-list>
		
	</scroll>
	<back-top v-show="isShowBackTop"  @click.native="backClick"></back-top>

	
	
	
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar';
  import TabControl from "../../components/content/tabControl/TabControl.vue"
  import GoodsList from "../../components/content/goods/GoodsList.vue"
  import Scroll from "../../components/common/scroll/Scroll.vue"
  import BackTop from "../../components/content/backTop/BackTop.vue"
	
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from "./childComps/FeatureView.vue"
  

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {debounce} from "../../common/utils.js"

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
	  FeatureView,
	  TabControl,
	  GoodsList,
	  Scroll,
	  BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
		goods:{
			"pop":{page:0,list:[]},
			"new":{page:0,list:[]},
			"sell":{page:0,list:[]},
		},
		currentType:"pop",
		isShowBackTop:true,
		tabOffsetTop:0,
		isTabFixed:false,
		saveY:0
      }
    },
	computed:{
		showGoods(){
			return this.goods[this.currentType].list
		}
	},
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()
	  // 2请求商品数据
	  this.getHomeGoods("pop")
	  this.getHomeGoods("new")
	  this.getHomeGoods("sell")
	 
	  
    },
	mounted() {
		// 3监听item中图片加载完成
		const refresh = debounce(this.$refs.scroll.refresh,500)
		this.$bus.$on("itemImageLoad",() => {
				  // console.log("--------")
				  // this.$refs.scroll.refresh()
				  refresh()
		}),
		// 获取tabcontrol的offsetTop值
		console.log(this.$refs.tabControl2.$el.offsetTop)
	},
	activated(){
		this.$refs.scroll.scrollTo(0,this.saveY,0)
		this.$refs.scroll.refresh()
	},
	deactivated(){
		this.saveY = this.$refs.scroll.scroll.y
	},
	methods:{
		getHomeMultidata(){
			getHomeMultidata().then(res => {
			  // this.result = res;
			  this.banners = res.data.banner.list;
			  this.recommends = res.data.recommend.list;
			})
		},
		getHomeGoods(type){
			const page = this.goods[type].page + 1
			getHomeGoods(type,page).then(res => {
				this.goods[type].list.push(...res.data.list)
				this.goods[type].page += 1
				// this.$refs.scroll.finishPullUp()
			})
		},
		tabClick(index){
			switch(index){
				case 0:
					this.currentType = "pop"
					break
				case 1:
					this.currentType = "new"
					break
				case 2:
					this.currentType = "sell"
					break
				
			}
			this.$refs.tabControl1.currentIndex = index
			this.$refs.tabControl2.currentIndex = index
		},
		backClick(){
			this.$refs.scroll.scrollTo(0,0)
		},
		contentScroll(position){
			// console.log(position) 判断backtop是否显示
			this.isShowBackTop = -(position.y) > 1000
			// 决定tabcontrol是否吸顶
			this.isTabFixed = (-position.y) > this.tabOffsetTop +30
			
		},
		// 防抖函数
		// debounce(func,delay){
		// 	let timer = null
		// 	return function(...args){
		// 		if(timer){
		// 			clearTimeout(timer)
		// 		}
		// 		timer = setTimeout(() => {
		// 			func.apply(this,args)
		// 		},delay)
		// 	}
		// },
		loadMore(){
			// console.log("shang ")
			this.getHomeGoods(this.currentType)
			this.$refs.scroll.finishPullUp()
			this.$refs.scroll.scroll.refresh()
		},
		swiperImageLoad(){
			this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
		}
	}
  }
</script>

<style scoped>
	#home{
		padding-top: 44px;
	}
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
	
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	z-index: 9;
  }
 /* .tab-control{
	  position: sticky;
	  top:44px;
	  z-index:9
  } */
  .content{
	  height: calc(100vh - 93px);
	  overflow: hidden;
	  
  }
 /* .fixed{
	  position: fixed;
	  left: 0;
	  top: 0;
	  right: 0;
  } */
</style>
