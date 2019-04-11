
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
  background: url("../assets/shop.png") no-repeat center;
  height: 100%;
  background-size: 100% 100%;
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
  background: rgb(133, 129, 102);
  color: rgb(255, 255, 255);
  line-height: 20px;
  font-size: 17px;
  font-family: "楷体";
  text-align: left;
  padding: 15px 0px 15px 20px;
  margin-bottom: 1px;
}
.current {
  background: rgb(196, 190, 144);
}
.goodCard {
  width: 25vw;
  height: 300px;
  margin: 2px;
  margin-bottom: 6px;
  background: rgb(102, 96, 98);
}
.goodimgdiv {
  width: 25vw;
  height: 240px;
}
.goodimgsmall {
  width: 100%;
  height: 100%;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  height: 60px;
  line-height: 50px;
  color: whitesmoke;
  font-size: 15px;
  font-family: "楷体";
  background: rgb(102, 96, 98);
}
.goodmodal {
  width: 100vw;
  height: 75%;
}
.price {
  background: green;
  color: whitesmoke;
  font-size: 1.1rem;
  /*#f4f4f4;*/
  width: 60px;
}
</style>

<template>
  <div class="mainBox">
    <div class="topBox">
      <div class="topLeftBox"></div>
      <div class="topRightBox"> {{ currentGoodsType.GoodsTypeName }} {{ currentGoodsType.GoodsTypeNameEng }}</div>
    </div>
    <div class="centerBox">
      <div class="leftBox">
        <div v-for="(type, index) in GoodsTypes"
             :key="type.GoodsTypeName"
             class="leftBoxItem"
             :class="{ current: currentIndex === index }"
             @click="selectType(type, index)">
          <div style="height:20px">{{ type.GoodsTypeName }}</div>
          <div style="height:20px">{{ type.GoodsTypeNameEng}}</div>
        </div>
      </div>
      <div class="rightBox">
        <div v-for="good in goods"
             :key="good.ID"
             @click="show(good)"
             class="goodCard">
          <div class="goodimgdiv">
            <img :src="imgSmall(good.ID)"
                 class="goodimgsmall"
                 :onerror="emptyGoodImg"
                 alt />
          </div>
          <div class="footer">
            <div style="display: flex;flex-direction: column;">
              <div style="height:20px">{{ good.GoodsName }}</div>
              <div style="height:20px">{{ good.GoodsPY }}</div>
            </div>
            <div class="price">￥{{ good.Price }}</div>
          </div>
        </div>
      </div>
    </div>
    <modal name="goodModal"
           adaptive='true'
           width="100%"
           height="100%"
           pivotX=0
           pivotY=0>
      <div class="goodmodal"
           @click="$modal.hide('goodModal')">
        <img :src="img(goodSelect.ID)"
             :onerror="emptyGoodImg"
             alt
             width="100%"
             height="100%" />
      </div>
      <div>
        <div style="width:80%">
          <div style="font-family: '黑体';font-size: 2.1rem;text-align:center;">{{goodSelect.GoodsName}} ￥{{ goodSelect.Price }}/{{ goodSelect.Unit }}</div>
        </div>
        <div style="height:18px"></div>
        <p style="width:80vw;padding-left:10vw">{{goodSelect.GoodsIntroduction}}</p>
      </div>
    </modal>
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
      goodSelect: {},
      foods: [],
      GoodsTypes: [],
      emptyGoodImg: 'this.src="' + require('../assets/nopic.gif') + '"'
    }
  },
  mounted () {
    this.loadFoods()
  },
  methods: {
    show (good) {
      this.goodSelect = good
      this.$modal.show('goodModal')
    },
    imgSmall (id) {
      return window.g.baseUrl + '/imggoods/small/' + id + '.jpg'
    },
    img (id) {
      return window.g.baseUrl + '/imggoods/' + id + '.jpg'
    },
    loadFoods () {
      let apiURL = '/WebServiceEx.asmx/Moon_GetLocalGoods'
      Util.ajax.get(apiURL).then(res => {
        this.foods = res.data
        this.getTypes()
        this.selectType(this.GoodsTypes[0], 0)
      })
    },
    selectType (type, index) {
      this.currentIndex = index
      this.currentGoodsType = type
      this.goods = this.foods.filter(f => f.GoodsTypeName === type.GoodsTypeName)
    },
    getTypes () {
      let arr = this.foods.map(f => { return { GoodsTypeName: f.GoodsTypeName, GoodsTypeNameEng: f.GoodsTypeNameEng } })
      this.GoodsTypes = this.quChong(arr)
    },
    quChong (arr) {
      const res = new Map()
      return arr.filter((a) => !res.has(a.GoodsTypeName) && res.set(a.GoodsTypeName, 1))
    }
  }
}
</script>
