<template>
  <el-container>
    <el-header>
      <el-button icon="el-icon-bell" size="mini"></el-button>
    </el-header>
    <el-main height="auto">
      <el-table size="mini" highlight-current-row :data="cartData" style="width: 100%">
        <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
        <el-table-column prop="GoodsName" label="品名" width="80"></el-table-column>
        <el-table-column type="expand" label="做法要求" width="120">
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
            <!-- <el-select v-model="requirements" multiple="" placeholder="请选择">
              <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-option-group>
            </el-select>-->
          </template>
        </el-table-column>
        <el-table-column prop="Price" label="单价(元)" width="80"></el-table-column>
        <el-table-column label="数量" width="140">
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
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="12">
                <el-button
                  @click="changeIsPack(scope, $event)"
                  :type="scope.row.IsPack?'primary':''"
                  size="mini"
                  round
                  icon="el-icon-bell"
                >等叫</el-button>
              </el-col>
              <el-col :span="12">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tableData4)"
                  type="danger"
                  size="mini"
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
      <el-button type="primary" size="mini" @click="backToMenu">继续点菜</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import Bus from "../libs/bus.js";
export default {
  data() {
    return {
      cartData: [],
      wait: false,
      requirements: [],
      options: [
        {
          label: "辣度",
          options: [
            {
              value: "不辣",
              label: "不辣"
            },
            {
              value: "微辣",
              label: "微辣"
            },
            {
              value: "中辣",
              label: "中辣"
            },
            {
              value: "麻辣",
              label: "麻辣"
            }
          ]
        },
        {
          label: "是否加冰",
          options: [
            {
              value: "加冰",
              label: "加冰"
            },
            {
              value: "不加冰",
              label: "不加冰"
            }
          ]
        }
      ]
    };
  },

  mounted() {
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

    backToMenu() {
      this.$router.push({ name: "Menu" });
      setTimeout(() => {
        Bus.$emit("onCartChange", this.cartData);
      }, 100);
    },

    changeIsPack(scope, value) {
      scope.row.IsPack = !scope.row.IsPack;
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
</style>
