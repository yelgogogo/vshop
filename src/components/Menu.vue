<template>
  <div class="mainBox">
    <div class="leftBox">
      <div
        v-for="(type,index) in GoodsTypes"
        :key="type" class="leftBoxItem"
        :class="{'current':currentIndex === index}"
        @click="selectType(type, index)">
        {{type}}
      </div>
    </div>
    <div class="rightBox">
        <div v-for="good in goods" :key="good.ID" class="goodCard">
          <img
            src="https://img.4008123123.com/resource/VersionP/phdi/288_224482.jpg"
            alt="" width="100" height="100">
          <div class="footer">
            <div>{{good.GoodsName}}</div>
            <div class="price">￥{{good.Price}}</div>
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
      goods: [],
      foods: [{'ID': 363, 'GoodsTypeName': '杞ギ', 'DisplayOrder': 12, 'GoodsName': '鑻忔墦姘�', 'GoodsCode': '101101', 'Price': 0.01, 'Unit': '鏀�', 'GoodsCount': 0, 'IsPack': false, 'GoodsRemarks': [], 'GoodsDetails': null}, {'ID': 364, 'GoodsTypeName': '杞ギ', 'DisplayOrder': 12, 'GoodsName': '骞插姘�', 'GoodsCode': '101102', 'Price': 0.01, 'Unit': '鏀�', 'GoodsCount': 0, 'IsPack': false, 'GoodsRemarks': [], 'GoodsDetails': null}, {'ID': 378, 'GoodsTypeName': '鏋滅洏', 'DisplayOrder': 13, 'GoodsName': '澶ф灉鐩�', 'GoodsCode': '101201', 'Price': 0.01, 'Unit': '浠�', 'GoodsCount': 0, 'IsPack': false, 'GoodsRemarks': [], 'GoodsDetails': null}, {'ID': 379, 'GoodsTypeName': '鏋滅洏', 'DisplayOrder': 13, 'GoodsName': '涓灉鐩�', 'GoodsCode': '101202', 'Price': 0.01, 'Unit': '浠�', 'GoodsCount': 0, 'IsPack': false, 'GoodsRemarks': [], 'GoodsDetails': null}],
      GoodsTypes: []
    }
  },
  mounted () {
    // this.getTypes()
    // this.selectType(this.GoodsTypes[0], 0)
    this.loadFoods()
  },
  methods: {
    loadFoods () {
      let apiURL = 'webserviceex.asmx/Moon_GetLocalGoods'
      Util.ajax.get(apiURL).then(res => {
        console.log(res)
        this.GoodsTypes = res.data.d
        this.getTypes()
        this.selectType(this.GoodsTypes[0], 0)
      })
    },
    selectType (type, index) {
      this.currentIndex = index
      this.goods = this.foods.filter(f => f.GoodsTypeName === type)
      console.log(type)
    },
    getTypes () {
      let arr = this.foods.map(f => f.GoodsTypeName)
      this.GoodsTypes = Array.from(new Set(arr))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainBox {
  display: flex;
}
.leftBox {
  width: 200px;
  display: flex;
  flex-direction: column;
}
.rightBox {
  flex:1;
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
