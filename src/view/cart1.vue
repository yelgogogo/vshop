<template>
  <el-container>
    <el-header>
      <el-button icon="el-icon-bell"></el-button>
    </el-header>
    <el-main height="auto">
      <el-table :data="cartData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="GoodsName" label="品名" width="180"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left">
              <el-form-item label="做法要求">
                <el-select placeholder="请选择">
                  <el-option
                    v-for="(item, index) in props.GoodsRemarks"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="Price" label="单价(元)" width="180"></el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <el-input-number
              :value="scope.row.GoodsCount"
              @change="handleGoodsCountChange(scope, $event)"
              :min="1"
              :max="10"
              label="描述文字"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="小计(元)">
          <template slot-scope="scope">
            <span>{{ scope.row.Price * scope.row.GoodsCount }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="12">
                <el-button type="wait?'':'primary'" size="small" round icon="el-icon-bell">等叫</el-button>
              </el-col>
              <el-col :span="12">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tableData4)"
                  type="danger"
                  size="small"
                  round
                  icon="el-icon-delete"
                ></el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button type="primary" @click='backToMenu'>继续点菜</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import Bus from "../libs/bus.js";
export default {
  data() {
    return {
      cartData: [],
      wait: true
    };
  },

  mounted() {
    console.log(this.$router.params);
    Bus.$on("onCartChange", x => {
      this.cartData = x;
      console.log(x);
    });
  },

  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },

    handleGoodsCountChange(scope, value) {
      scope.row.GoodsCount = value;
      // console.log(value)
    },

    backToMenu(){
      setTimeout(() => {
        Bus.$emit('onCartChange', this.cartData)
      }, 100)
    }
  }
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

/* .el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
} */

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
</style>
