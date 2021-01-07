import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'

// orders module
import orders from './modules/orders'
import customers from './modules/customers'
import branches from './modules/branches'
import products from './modules/products'
import news from './modules/news'
import promo from './modules/promo'
import shops from './modules/shops'
import brands from './modules/brands'
import couriers from './modules/couriers'
import clients from './modules/clients'
import productKinds from './modules/product-kinds'
import measures from './modules/measures'
import categories from './modules/categories'
import distributors from './modules/distributors'
import attrs from './modules/attrs'
import reviews from './modules/reviews'
import bannerPositions from './modules/bannerPositions'
import banners from './modules/banners'
import pages from './modules/pages'
import permissions from './modules/permissions'
import admins from './modules/admins'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    products,
    couriers,
    clients,
    user,
    orders,
    branches,
    productKinds,
    measures,
    brands,
    categories,
    distributors,
    permission,
    news,
    promo,
    shops,
    customers,
    attrs,
    reviews,
    bannerPositions,
    banners,
    pages,
    permissions,
    admins
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
