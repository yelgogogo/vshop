<template>
  <el-container>
    <el-header>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="openModal(undefined)">全部删除</el-button>
    </el-header>
    <el-main height="auto">
      <el-table size="mini" highlight-current-row :data="cartData" row-key='ID' style="width: 100%">
        <el-table-column prop="DisplayOrder" label="分类" min-width="24" sortable>
            <template slot-scope="scope">{{GoodsTypesDict[scope.row.DisplayOrder]}}</template>
          
        </el-table-column>
        <el-table-column prop="GoodsName" label="品名" min-width="60" sortable></el-table-column>
        <el-table-column type="expand" label="做法要求" width="80">
          <template slot-scope="scope">
            <el-tag :key="tag" v-for="tag in scope.row.GoodsOptions" :disable-transitions="false" :type="scope.row.GoodsRemarks.indexOf(tag) === -1 ? 'info' : ''"
              @click="handleClick(tag, scope.row)">{{tag}}</el-tag>
            <el-tag :key="tag" v-for="tag in scope.row.closableRemarks" :disable-transitions="false" closable @close="handleClose(tag, scope.row)">{{tag}}</el-tag>
            <el-input class="input-new-tag" placeholder="+ 备注" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"></el-input>
            <!-- <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 备注</el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="Price" label="单价(元)" min-width="80" sortable></el-table-column>
        <el-table-column label="数量" min-width="90" sortable :sort-method="sortGoodsCount">
          <template slot-scope="scope">
            <el-input-number size="mini" :value="scope.row.GoodsCount" @change="handleGoodsCountChange(scope, $event)" :min="0" label="描述文字"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="小计(元)" width="90" sortable :sort-method="sortSubTotal">
          <template slot-scope="scope">
            <span>{{ scope.row.Price * scope.row.GoodsCount }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="160">
          <template slot-scope="scope">
            <el-button @click="isWait(scope.row, $event)" :type="scope.row.IsWaitCall?'primary':''" size="mini" round icon="el-icon-bell">等叫</el-button>
            <span class="del-btn" @click="openModal(scope.$index)">
              <i class="el-icon-delete"></i>
            </span>
            <span class="up-btn" @click="prepose(scope.$index)">
              <i v-if="scope.$index!==0" class="el-icon-sort-up"></i>
            </span>
            <span @click="postpose(scope.$index)" class="down-btn">
              <i v-if="scope.$index!==cartData.length-1" class="el-icon-sort-down"></i>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>确定删除吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteRow">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="下单" :visible.sync="dialogFormVisible">
        <el-form :model="form" :label-width="formLabelWidth" size="mini">
          <el-form-item label="工号">
            <el-input v-model="form.userNo" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="台号">
            <el-input v-model="form.roomName" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="mini" :loading="submit" type="primary" @click="submitOrder">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-button type="primary" size="mini" @click="backToMenu">继续点单</el-button>
      <div style="float:right">
        <!-- <el-tag>￥{{totalPrice}}</el-tag> -->
        <span style="color:white; padding-right:10px">总价：￥{{totalPrice}}</span>
        <el-button type="success" size="mini" @click="placeOrder">下单</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
  import Bus from '../libs/bus.js'
  import Util from "../libs/utils.js";
  const qs = require('qs')
  export default {
    data() {
      return {
        cartData: [],
        GoodsTypesDict: window.GoodsTypesDict,
        submit: false,
        dialogVisible: false,
        curentRowIndex: 0,
        dialogFormVisible: false,
        form: {
          userNo: '',
          password: '',
          roomName: ''
        },
        formLabelWidth: '60px'
      }
    },

    computed: {
      totalPrice() {
        let result = this.cartData.reduce((prev, current) => {
          return prev + current.Price * 100 * current.GoodsCount
        }, 0)
        return result / 100
      }
    },

    mounted() {
      Bus.$on('onCartChange', x => {
        this.cartData = x
        this.cartData = this.cartData.map(item => {
          return Object.assign({}, item, {
            closableRemarks: [],
            inputVisible: false,
            inputValue: ''
          })
        })
        console.log(x)
      })
    },

    methods: {
      orderSuccess() {
        this.$message({
          message: '下单成功',
          duration: 5000,
          type: 'success'
        })
        this.form.userNo = ''
        this.form.password = ''
        this.form.roomName = ''
        this.cartData = []
      },
      submitOrder() {
        if (
          !this.form.userNo ||
          !this.form.password ||
          !this.form.roomName
        ) {
          return
        }
        this.submit = true
        const SubmitGoods = this.cartData.map(c => {
          let {ID, Price, Unit, GoodsCount, GoodsRemarks, IsWaitCall} = c
          return {GoodsID: ID, Price, Unit, GoodsCount, IsWaitCall: IsWaitCall? true: false, GoodsRemarks}
        })

        const submitObj = { ...this.form, SubmitGoods}
        console.log(submitObj)
        let apiURL = "/WebServiceEx.asmx/Moon_Add_Orders";
        Util.ajax.post(apiURL, qs.stringify({
              submitMobile: JSON.stringify(submitObj)
            })
        // , {
        //     headers: {
        //       'Content-Type':'application/x-www-form-urlencoded'
        //     }
        //   }
          ).then(res => {
            this.submit = false
            if (!res.data.Success) {
              this.$message({
                message: res.data.ErrorMsg,
                duration: 5000,
                type: 'error'
              })
              return
            }
            this.dialogFormVisible = false
            this.orderSuccess()
        })
      },
      placeOrder() {
        if (this.cartData.length === 0) {
          return
        }
        this.dialogFormVisible = true
      },

      openModal(rowIndex) {
        this.dialogVisible = true
        this.currentRowIndex = rowIndex
        console.log(rowIndex)
      },

      deleteRow() {
        this.dialogVisible = false
        if (this.curentRowIndex!==undefined) {
          this.cartData.splice(this.currentRowIndex, 1)
        } else {
          this.cartData = []
        }
      },

      prepose(rowIndex) {
        let cartData = this.cartData.slice(0)
        let temp = cartData[rowIndex - 1]
        cartData[rowIndex - 1] = cartData[rowIndex]
        cartData[rowIndex] = temp
        this.cartData = cartData
      },

      postpose(rowIndex) {
        let cartData = this.cartData.slice(0)
        let temp = cartData[rowIndex + 1]
        cartData[rowIndex + 1] = cartData[rowIndex]
        cartData[rowIndex] = temp
        this.cartData = cartData
      },

      sortGoodsCount(a, b) {
        return a.GoodsCount - b.GoodsCount
      },

      sortSubTotal(a, b) {
        return a.Price * a.GoodsCount - b.Price * b.GoodsCount
      },

      clearCart() {
        this.cartData = []
      },

      handleGoodsCountChange(scope, value) {
        scope.row.GoodsCount = value
      },

      backToMenu() {
        this.$router.push({ name: 'Menu' })
        setTimeout(() => {
          Bus.$emit('onCartChange', this.cartData)
        }, 100)
      },

      isWait(row, value) {
        row.IsWaitCall = !row.IsWaitCall
      },

      handleClose(tag, row) {
        row.closableRemarks.splice(row.closableRemarks.indexOf(tag), 1)
      },

      handleClick(tag, row) {
        // console.log(row)
        if (row.GoodsRemarks.indexOf(tag) === -1) {
          row.GoodsRemarks.push(tag)
        } else {
          row.GoodsRemarks.splice(row.GoodsRemarks.indexOf(tag), 1)
        }
      },

      handleInputConfirm(row) {
        let inputValue = row.inputValue
        if (inputValue) {
          row.closableRemarks.push(inputValue)
          row.GoodsRemarks.push(inputValue)
        }
        row.inputValue = ''
      }
    }
  }
</script>

<style scoped>
  .del-btn {
    color: #f56c6c;
    width: 20px;
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }

  .up-btn {
    color: #409eff;
    width: 20px;
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }

  .down-btn {
    color: #409eff;
    width: 20px;
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }

  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    /* text-align: center; */
    line-height: 60px;
  }

  .el-header {
    text-align: right;
    background-color: rgb(173, 117, 41);
  }

  .el-footer {
    background-color: rgb(165, 97, 33);
  }

  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  body>.el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .el-input-number--mini {
    width: 100px;
  }

  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>