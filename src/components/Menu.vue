<template>
  <div class="mainBox">
    <div class="cart" @click="goToCart">
      <i class="icon ion-md-clipboard"></i>
    </div>
    <div class="topBox">
      <div class="topLeftBox"></div>
      <div
        class="topRightBox"
      >{{ currentGoodsType.GoodsTypeName }} {{ currentGoodsType.GoodsTypeNameEng }}</div>
    </div>
    <div class="centerBox">
      <div class="leftBox">
        <div
          v-for="(type, index) in GoodsTypes"
          :key="type.GoodsTypeName"
          class="leftBoxItem"
          :class="{ current: currentIndex === index }"
          @click="selectType(type, index)"
        >
          <el-badge
            :hidden="getBadgeNumber(type.GoodsTypeName) === 0"
            :value="getBadgeNumber(type.GoodsTypeName)"
            class="item"
          >
            <div style="height:20px">{{ type.GoodsTypeName }}</div>
            <div style="height:20px">{{ type.GoodsTypeNameEng}}</div>
          </el-badge>
        </div>
      </div>
      <div class="rightBox">
        <div v-for="good in goods" :key="good.ID" @click="show(good)" class="goodCard">
          <div class="goodimgdiv centerImg" v-bind:style="imgSmall(good.ID)"></div>
          <div class="footer">
            <div style="display: flex;flex-direction: column;">
              <div style="height:20px">{{ good.GoodsName }}</div>
              <div style="height:20px">{{ good.GoodsPY }}</div>
            </div>
            <div class="price">￥{{ good.Price }}</div>
            <div class="operationBox">
              <div class="operation" @click.stop="">
                <el-input-number size='mini' v-model="good.GoodsCount" @click.stop="" :min="0" label="描述文字"></el-input-number>
              </div>
              <!-- <div
                class="operation"
                @click.stop="goodOperation(good, -1)"
                v-if="good.GoodsCount > 0"
              >
                <i class="icon ion-ios-remove-circle-outline"></i>
              </div>
              <span style="margin: 0px 10px">{{ good.GoodsCount }}</span>
              <div class="operation" @click.stop="goodOperation(good, 1)">
                <i class="icon ion-ios-add-circle-outline"></i>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal name="goodModal" :adaptive="true" width="100%" height="100%" :pivotX="0" :pivotY="0">
      <div
        style="display:flex ;flex-direction:row;height:100%;background-color:#FAF9DE;"
        @click="$modal.hide('goodModal')"
      >
        <div class="centerImg" ref="goodModal" style="flex:3" v-bind:style="img(goodSelect.ID)"></div>
        <div style="flex:1">
          <div style="font-family: '黑体';font-size: 2.1rem;text-align:center;padding:10 0 0 0">
            <h4>{{goodSelect.GoodsName}}</h4>
            <b>￥{{ goodSelect.Price }}/{{ goodSelect.Unit }}</b>
          </div>
          <p
            style="padding:0 10px 0 10px;overflow:scroll;height:300px"
          >{{goodSelect.GoodsIntroduction}}</p>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Util from "../libs/utils.js";
import Bus from "../libs/bus.js";
export default {
  name: "Menu",
  data() {
    return {
      types: [1, 2, 3, 4, 5],
      currentIndex: 0,
      currentGoodsType: "",
      goods: [],
      goodSelect: {},
      foods: [],
      GoodsTypes: [],
      cartData: [],
      emptyGoodImg: 'this.src="' + require("../assets/nopic.gif") + '"'
    };
  },
  computed: {
    // cartData: function () {
    //   return this.goods.filter(g => g.GoodsCount > 0)
    // }
  },
  mounted() {
    this.loadFoods();
    Bus.$on("onCartChange", x => {
      this.cartData = x;
      console.log(x);
      // console.log("this.cartData", JSON.stringify(this.cartData));
    });
  },
  methods: {
    goodOperation(goods, v) {
      goods.GoodsCount = goods.GoodsCount + v;
    },
    getBadgeNumber(GoodsTypeName) {
      let goods = this.foods.filter(
        item => item.GoodsTypeName === GoodsTypeName
      );
      let total = 0;
      for (let item of goods) {
        total += item.GoodsCount;
      }
      return total;
    },
    goToCart() {
      this.$router.push({ name: "Cart" });
      setTimeout(() => {
        Bus.$emit("onCartChange", this.foods.filter(g => g.GoodsCount > 0));
      }, 100);
    },
    show(good) {
      this.goodSelect = good;
      this.$modal.show("goodModal");
      /* setTimeout(() => {
        console.log('goodModal2', this.$refs.goodModal.clientHeight, this.$refs.goodModal.clientWidth)
        alert(this.$refs.goodModal.clientHeight + ':' + this.$refs.goodModal.clientWidth)
      }, 100) */
    },
    imgSmall(id) {
      return {
        "background-image":
          "url(" + window.g.baseUrl + "/imggoods/small/" + id + ".jpg)"
      };
    },
    img(id) {
      return {
        "background-image":
          "url(" + window.g.baseUrl + "/imggoods/" + id + ".jpg)"
      };
    },
    loadFoods() {
      let apiURL = "/WebServiceEx.asmx/Moon_GetLocalGoods";
      Util.ajax.get(apiURL).then(res => {
        this.foods = res.data.map(g => {
          let findFood = this.cartData.find(c => c.ID === g.ID);
          if (findFood) {
            return {...findFood}
          }
          const GoodsOptions = g.GoodsRemarks
          const GoodsRemarks = []
          return {...g, GoodsRemarks, GoodsOptions}
        });
        console.log('this.foods', this.foods)
        this.getTypes();
        this.selectType(this.GoodsTypes[0], 0);
      });
    },
    selectType(type, index) {
      this.currentIndex = index;
      this.currentGoodsType = type;
      this.goods = this.foods.filter(
        f => f.GoodsTypeName === type.GoodsTypeName
      );
      window.goods = this.goods;
    },
    getTypes() {
      let arr = this.foods.map(f => {
        return {
          GoodsTypeName: f.GoodsTypeName,
          GoodsTypeNameEng: f.GoodsTypeNameEng
        };
      });
      this.GoodsTypes = this.quChong(arr);
      window.GoodsTypes = this.GoodsTypes;
    },
    quChong(arr) {
      const res = new Map();
      return arr.filter(
        a => !res.has(a.GoodsTypeName) && res.set(a.GoodsTypeName, 1)
      );
    }
  }
};
</script>

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
  height: 380px;
  margin: 2px;
  margin-bottom: 6px;
  background: rgb(102, 96, 98);
  display: flex;
  flex-direction: column;
}

.goodimgdiv {
  width: 25vw;
  height: 80%;
}

.footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row;
  padding-left: 20px;
  flex: 1;
  line-height: 50px;
  color: whitesmoke;
  font-size: 15px;
  font-family: "楷体";
  background: rgb(102, 96, 98);
}

.centerImg {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.price {
  background: green;
  color: whitesmoke;
  font-size: 1.1rem;
  /*#f4f4f4;*/
  width: 60px;
}

.cart {
  position: fixed;
  top: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  background: #369be9;
  color: #fff;
  border-radius: 50%;
  font-size: 40px;
  line-height: 60px;
  text-align: center;
}

.operationBox {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
}

.operation {
  font-size: 40px;
}

.el-badge {
  /* make badge align to the right */
  display: block;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

.el-input-number--mini {
  width: 100px;
}
</style>
