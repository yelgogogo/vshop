<template>
  <el-container>
    <el-header>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click='clearCart'>全部删除</el-button>
    </el-header>
    <el-main height="auto">
      <el-table size="mini" highlight-current-row :data="cartData" style="width: 100%">
        <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
        <el-table-column prop="GoodsName" label="品名" min-width="60"></el-table-column>
        <el-table-column type="expand" label="做法要求" width="80">
          <template slot-scope="scope">
            <el-tag
              :key="tag"
              v-for="tag in scope.row.RemarkOptions"
              :disable-transitions="false"
              :type='scope.row.GoodsRemarks.indexOf(tag) === -1 ? "info" : ""'
              @click="handleClick(tag, scope.row)"
            >{{tag}}</el-tag>
            <el-tag
              :key="tag"
              v-for="tag in scope.row.closableRemarks"
              :disable-transitions="false"
              closable
              @close="handleClose(tag, scope.row)"
            >{{tag}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 备注</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Price" label="单价(元)" min-width="80"></el-table-column>
        <el-table-column label="数量" min-width="100">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              :value="scope.row.GoodsCount"
              @change="handleGoodsCountChange(scope, $event)"
              :min="1"
              :max="10"
              label="描述文字"
            ></el-input-number>
          </template>
        </el-table-column>
        <!-- <el-table-column label="小计(元)" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.Price * scope.row.GoodsCount }}</span>
          </template>
        </el-table-column>-->
        <el-table-column fixed="right" label="操作" min-width="160">
          <template slot-scope="scope">
            <el-button
              @click="changeIsPack(scope, $event)"
              :type="scope.row.IsPack?'primary':''"
              size="mini"
              round
              icon="el-icon-bell"
            >等叫</el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index)"
              type="danger"
              size="mini"
              round
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button type="primary" size="mini" @click="backToMenu">继续点菜</el-button>
      <el-button type="success" size="mini" @click="backToMenu">下单</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import Bus from "../libs/bus.js";
export default {
  data() {
    return {
      cartData: [],
      inputVisible: false,
      inputValue: "",
      options: ["不辣", "微辣", "中辣", "麻辣"]
    };
  },

  mounted() {
    Bus.$on("onCartChange", x => {
      this.cartData = x;
      this.cartData = this.cartData.map(item => {
        return Object.assign({}, item, {
          RemarkOptions: this.options,
          closableRemarks: [],
          inputVisible: false,
          inputValue:''
        })
      })
      console.log(x);
    });
  },

  methods: {
    deleteRow(index) {
      this.cartData.splice(index, 1);
    },

    clearCart(){
      this.cartData = []
    },

    handleGoodsCountChange(scope, value) {
      scope.row.GoodsCount = value;
    },

    backToMenu() {
      this.$router.push({ name: "Menu" });
      setTimeout(() => {
        Bus.$emit("onCartChange", this.cartData);
      }, 100);
    },

    changeIsPack(scope, value) {
      scope.row.IsPack = !scope.row.IsPack;
    },

    handleClose(tag, row) {
      row.closableRemarks.splice(row.closableRemarks.indexOf(tag), 1);
    },

    handleClick(tag, row){
      // console.log(row)
      if(row.GoodsRemarks.indexOf(tag)===-1){
        row.GoodsRemarks.push(tag)
      }
      else{
        row.GoodsRemarks.splice(row.GoodsRemarks.indexOf(tag), 1)
      }
    },

    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(row) {
      let inputValue = row.inputValue;
      if (inputValue) {
        row.closableRemarks.push(inputValue);
      }
      row.inputVisible = false;
      row.inputValue = "";
    }
  }
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  /* text-align: center; */
  line-height: 60px;
}

.el-header{
  text-align: right;
  background-color: rgb(173, 117, 41)
}
.el-footer{
  background-color: rgb(165, 97, 33);
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

body > .el-container {
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

.el-tag + .el-tag {
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
