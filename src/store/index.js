import Vue from "vue"
import Vuex from "vuex"

// 1.安装插件
Vue.use(Vuex)

// 2.创建store对象
const store = new Vuex.Store({
	state:{
		cartList:[]
	},
	mutations:{
		// addCart(state,payload){
		// 	// state.cartList.push(payload)
		// 	// let oldProduct = null
		// 	// for(let item of state.cartList){
		// 	// 	if(item.iid === payload.iid){
		// 	// 		oldProduct = item
		// 	// 	}
		// 	// }
		// 	let oldProduct = state.cartList.find(item => item.iid === payload.iid)
		// 	// 判断oldProduct
		// 	if(oldProduct){
		// 		oldProduct.count += 1
		// 	}else{
		// 		payload.count = 1
		// 		state.cartList.push(payload)
		// 	}
		// }
		AddCounter(state,payload){
			payload.count++
		},
		addToCart(state,payload){
			payload.checked = true
			state.cartList.push(payload)
		}
		
	},
	actions:{
		addCart(context,payload){
			// state.cartList.push(payload)
			// let oldProduct = null
			// for(let item of state.cartList){
			// 	if(item.iid === payload.iid){
			// 		oldProduct = item
			// 	}
			// }
			return new Promise((resolve,reject) => {
				let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
				// 判断oldProduct
				if(oldProduct){
					// oldProduct.count += 1
					context.commit("AddCounter",oldProduct)
					resolve("当前的商品数量+1")
				}else{
					payload.count = 1
					// context.state.cartList.push(payload)
					context.commit("addToCart",payload)
					resolve("添加了新的商品")
				}
			})
		}
	}
})

// 3.导出并挂载到vue实例下
export default store
