<style scoped>
.goBack {
  position: fixed;
  top: 40px;
  left: 40px;
  width: 60px;
  height: 60px;
  background: #369be9;
  color: #fff;
  border-radius: 50%;
  font-size: 40px;
  line-height: 60px;
}
.confirm {
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
}
.list {
  display: flex;
  flex-direction: column;
  width: 80vw;
}
.goodItem {
  display: flex;
  flex-direction: row;
  font-size: 36px;
  justify-content: space-between;
  align-items: center;
}
.mainBox {
  width: 100vw;
  height: 100vh;
  padding-top: 140px;
  padding-left: 40px;
  padding-right: 40px;
  box-sizing: border-box;
}
.goodName {
  width: 200px;
  text-align: left;
}

.goodPrice {
  width: 100px;
  text-align: right;
}

.goodUnit {
  width: 100px;
  text-align: left;
}

.goodCount {
  width: 100px;
  text-align: right;
}
.underlineBox {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}

.underline {
  width: 40px;
  margin-right: 20px;
  border-top: 2px #eee solid
}

.inputId {
  border: none;
  border-bottom: 2px #ddd solid;
  display: block;
  font-size: 80px;
  letter-spacing:20px;
  width: 100%;
}

.inputId:focus {
  border: none;
}

.idBox {
  width: 420px;
}
</style>
<template>
  <div class="mainBox">
    <div class="goBack" @click="goToMenu">
      <i class="icon ion-ios-arrow-back"></i>
    </div>
    <div class="confirm" @click="confirm">
        <i class="icon ion-md-checkmark"></i>
    </div>
    <div class="list">
      <div class="goodItem" v-for="good in cartData" :key="good.ID">
        <div class="goodName">{{good.GoodsName}}</div>
        <div class="goodPrice">￥{{good.Price}}</div>
        <div class="goodUnit">{{good.Unit}}</div>
        <div class="goodCount">{{good.GoodsCount}}</div>
        <div></div>
      </div>
      <div class="checkId">
        <div v-if="goodsOrdered">
          下单成功
        </div>
        <div v-else>
          请输入工号:
          <div class="idBox">
            <input type="text" maxlength="6" class="inputId" v-model="employeeID" placeholder="">
            <!-- <div class="underlineBox">
              <div class="underline" v-for="underline in [1,2,3,4,5,6]" :key=underline>
                &nbsp;
              </div>
            </div> -->
          </div>
          <div>
            <button @click="order">
              确认下单
            </button>
          </div>
        </div>
      </div>
    </div>
    <modal name="confirmModal"  width="40%" height="10%" >
        <div style="display:flex ;flex-direction:row;height:100%;background-color:#FAF9DE;">

        </div>
      </modal>
  </div>
</template>
<script>
import Bus from '../libs/bus.js'
import Util from '../libs/utils.js'
export default {
  name: 'Cart',
  data () {
    return {
      employeeID: '',
      goodsOrdered: false,
      cartData: [{'ID': 226, 'GoodsTypeName': '杯具破损赔偿（客人）', 'DisplayOrder': 19, 'GoodsName': '小子弹杯', 'GoodsCode': '102801', 'Price': 0.01, 'Unit': '个', 'GoodsCount': 2, 'IsPack': false, 'GoodsRemarks': [], 'GoodsDetails': null}, {'ID': 227, 'GoodsTypeName': '杯具破损赔偿（客人）', 'DisplayOrder': 19, 'GoodsName': '大子弹杯', 'GoodsCode': '102802', 'Price': 0.01, 'Unit': '个', 'GoodsCount': 2, 'IsPack': false, 'GoodsRemarks': [], 'GoodsDetails': null}, {'ID': 228, 'GoodsTypeName': '杯具破损赔偿（客人）', 'DisplayOrder': 19, 'GoodsName': '洛杯', 'GoodsCode': '102803', 'Price': 0.01, 'Unit': '个', 'GoodsCount': 3, 'IsPack': false, 'GoodsRemarks': [], 'GoodsDetails': null}]
    }
  },
  mounted () {
    Bus.$on('onCartChange', (x) => {
      this.cartData = x
    })
  },
  methods: {
    confirm () {
      this.$modal.show('confirmModal')
    },
    order () {
      console.log(this.employeeID)
      this.goodsOrdered = true
      let apiURL = '/WebServiceEx.asmx/Moon_Confirm'
      Util.ajax.post(apiURL, this.cartData).then(res => {
        this.goodsOrdered = true
        this.employeeID = ''
        this.cartData = []
      })
    },
    goToMenu () {
      this.$router.push('/')
      setTimeout(() => {
        Bus.$emit('onCartChange', this.cartData)
      }, 100)
    }
  }
}
</script>
