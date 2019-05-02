import Vue from 'vue'
import Router from 'vue-router'
import Menu from '@/components/Menu'
import Cart from '@/view/cart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }
  ]
})
