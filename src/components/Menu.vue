
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainBox {
  display: flex;
  flex-direction: column;
}
.topBox {
  display: flex;
  flex-direction: row;
  height: 14vh;
  background-color: rgb(1, 1, 1);
}
.topLeftBox {
  width: 23vw;
  color: rgb(214, 198, 158);
  font-size: 2.1rem;
  text-decoration: underline;
  font-family: "楷体";
}
.topRightBox {
  flex: 1;
  background: rgb(41, 39, 42);
  color: antiquewhite;
  justify-content: space-around;
  font-family: "黑体";
  font-size: 2.2rem;
  line-height: 90px;
}
.centerBox {
  display: flex;
}
.leftBox {
  width: 23vw;
  height: 86vh;
  overflow: scroll;
  display: flex;
  flex-direction: column;
}
.rightBox {
  width: 75vw;
  height: 86vh;
  flex: 1;
  overflow: scroll;
  display: flex;
  align-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  background: black;
}
.leftBoxItem {
  height: 60px;
  background: rgb(133, 129, 102);
  color: rgb(255, 255, 255);
  line-height: 60px;
  font-size: 20px;
  font-family: "楷体";
  text-align: left;
  padding-left: 20px;
}
.current {
  background: rgb(196, 190, 144);
}
.goodCard {
  width: 25vw;
  height: 38vh;
  margin: 2px;
  margin-bottom: 6px;
  background: rgb(102, 96, 98);
}
.goodimgdiv {
  width: 25vw;
  height: 80%;
}
.goodimg {
  max-width: 320px;
  width: expression(this.width>320? "100%": this.width);
  max-height: 240px;
  height: expression(this.height>240? "100%": this.height);
}
.footer {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  height: 20%;
  line-height: 50px;
  color: whitesmoke;
  font-family: "楷体";
  background: rgb(102, 96, 98);
}
.price {
  background: green;
  color: whitesmoke;
  font-size: 1.1rem;
  /*#f4f4f4;*/
  width: 80px;
}
</style>

<template>
  <div class="mainBox">
    <div class="topBox">
      <div class="topLeftBox">T H E<br />G R I L L</div>
      <div class="topRightBox"> {{ currentGoodsType }}</div>
    </div>
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
          <div class="goodimgdiv">
            <img :src="imgs(good.ID)"
                 class="goodimg"
                 :onerror="emptyGoodImg"
                 alt />
          </div>
          <div class="footer">
            <div>{{ good.GoodsName }}</div>
            <div class="price">￥{{ good.Price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Util from '../libs/utils.js'
export default {
  name: 'Menu',
  data () {
    return {
      types: [1, 2, 3, 4, 5],
      currentIndex: 0,
      currentGoodsType: '',
      goods: [],
      foods: [],
      GoodsTypes: [],
      emptyGoodImg: 'this.src="' + require('../assets/nopic.gif') + '"'
    }
  },
  mounted () {
    this.loadFoods()
  },
  methods: {
    imgs (id) {
      return 'http://192.168.1.51:99/imggoods/' + id + '.jpg'
    },
    loadFoods () {
      let apiURL = 'webserviceex.asmx/Moon_GetLocalGoods'
      console.log(apiURL)
      Util.ajax.get(apiURL).then(res => {
        this.foods = res.data
        this.getTypes()
        this.selectType(this.GoodsTypes[0], 0)
      })
    },
    selectType (type, index) {
      this.currentIndex = index
      this.currentGoodsType = type
      this.goods = this.foods.filter(f => f.GoodsTypeName === type)
    },
    getTypes () {
      let arr = this.foods.map(f => f.GoodsTypeName)
      this.GoodsTypes = Array.from(new Set(arr))
    }
  }
}
</script>
