
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainBox {
  display: flex;
  flex-direction: column;
}
.topBox {
  height: 50px;
  background-color: rgb(1, 1, 1);
}
.bottomBox {
  height: 1px;
}
.centerBox {
  display: flex;
}
.leftBox {
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgb(26, 25, 24);
}
.rightBox {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: #eee;
  padding: 10px;
}
.leftBoxItem {
  height: 60px;
  background: whitesmoke;
  line-height: 60px;
  font-size: 24px;
  text-align: left;
  padding-left: 20px;
}
.current {
  background: antiquewhite;
}
.goodCard {
  width: 24vw;
  margin: 2px;
  background: white;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  height: 40px;
  line-height: 40px;
}
.price {
  background: cadetblue;
  color: #f4f4f4;
  width: 60px;
}
</style>

<template>
  <div class="mainBox">
    <div class="topBox">top</div>
    <div class="centerBox">
      <div class="leftBox">
        <div v-for="(type, index) in GoodsTypes"
             :key="type"
             class="leftBoxItem"
             :class="{ current: currentIndex === index }"
             @click="selectType(type, index)">
          {{ type }}
        </div>
      </div>
      <div class="rightBox">
        <div v-for="good in goods"
             :key="good.ID"
             class="goodCard">
          <img :src="imgs(good.ID)"
               alt
               width="100"
               height="100" />
          <div class="footer">
            <div>{{ good.GoodsName }}</div>
            <div class="price">￥{{ good.Price }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomBox">bottom</div>
  </div>
</template>
rainforce1982@sina.com
<script>
import Util from '../libs/utils.js'
export default {
  name: 'Menu',
  data () {
    return {
      types: [1, 2, 3, 4, 5],
      currentIndex: 0,
      goods: [],
      foods: [],
      GoodsTypes: []
    }
  },
  mounted () {
    this.loadFoods()
  },
  methods: {
    imgs (id) {
      return 'http://120.25.86.111:89/imggoods/' + id + '.jpg'
    },
    loadFoods () {
      let apiURL = 'webserviceex.asmx/Moon_GetLocalGoods'
      Util.ajax.get(apiURL).then(res => {
        this.foods = res.data
        this.getTypes()
        this.selectType(this.GoodsTypes[0], 0)
      })
    },
    selectType (type, index) {
      this.currentIndex = index
      this.goods = this.foods.filter(f => f.GoodsTypeName === type)
    },
    getTypes () {
      let arr = this.foods.map(f => f.GoodsTypeName)
      this.GoodsTypes = Array.from(new Set(arr))
    }
  }
}
</script>
