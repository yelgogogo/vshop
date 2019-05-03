<style scoped>

</style>
<template>
  <div >
    <div @click="goToMenu">
      <i class="icon ion-ios-arrow-dropleft"></i>
    </div>

  </div>
</template>
<script>
import Bus from '../libs/bus.js'
export default {
  name: 'Cart',
  data () {
    return {
      cartData: []
    }
  },
  mounted () {
    Bus.$on('onCartChange', (x) => {
      this.cartData = x
    })
  },
  methods: {
    goToMenu () {
      this.$router.push('/')
      setTimeout(() => {
        Bus.$emit('onCartChange', this.cartData)
      }, 100)
    }
  }
}
</script>
