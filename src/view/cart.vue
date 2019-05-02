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

    }
  },
  mounted () {
    Bus.$on('onCartChange', (x) => {
      console.log(x)
    })
  },
  methods: {
    goToMenu () {
      this.$router.push('/')
    }
  }
}
</script>
