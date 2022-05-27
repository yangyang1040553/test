<template>
  <div class="app-container">
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="daterangeRegisterTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-statistical:keepAlive:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hash-statistical:keepAlive:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hash-statistical:keepAlive:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-statistical:keepAlive:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-radio-group v-model="tabPosition">
          <el-radio-button label="1">七日留存</el-radio-button>
          <el-radio-button label="2">十五日留存</el-radio-button>
          <el-radio-button label="3">三十日留存</el-radio-button>
        </el-radio-group>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="keepAliveList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="注册时间" align="center" prop="registerTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registerTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册总数" align="center" prop="total" />
      <el-table-column label="登录总数" align="center" prop="loginCount" />
      <el-table-column label="次日留存" align="center" prop="one" />
      <el-table-column label="二日留存" align="center" prop="two" />
      <el-table-column label="三日留存" align="center" prop="three" />
      <el-table-column label="四日留存" align="center" prop="four" />
      <el-table-column label="五日留存" align="center" prop="five" />
      <el-table-column label="六日留存" align="center" prop="six" />
      <el-table-column label="七日留存" align="center" prop="seven" />
      <el-table-column label="八日留存" align="center" prop="eight" />
      <el-table-column label="九日留存" align="center" prop="nine" />
      <el-table-column label="十日留存" align="center" prop="ten" />
      <el-table-column label="十一日留存" align="center" prop="eleven" />
      <el-table-column label="十二日留存" align="center" prop="twelve" />
      <el-table-column label="十三日留存" align="center" prop="thirteen" />
      <el-table-column label="十四日留存" align="center" prop="fourteen" />
      <el-table-column label="十五日留存" align="center" prop="fifteen" />
      <el-table-column label="十六日留存" align="center" prop="sixteen" />
      <el-table-column label="十七日留存" align="center" prop="seventeen" />
      <el-table-column label="十八日留存" align="center" prop="eighteen" />
      <el-table-column label="十九日留存" align="center" prop="nineteen" />
      <el-table-column label="二十日留存" align="center" prop="twenty" />
      <el-table-column label="二十一日留存" align="center" prop="twentyOne" />
      <el-table-column label="二十二日留存" align="center" prop="twentyTwo" />
      <el-table-column label="二十三日留存" align="center" prop="twentyThree" />
      <el-table-column label="二十四日留存" align="center" prop="twentyFour" />
      <el-table-column label="二十五日留存" align="center" prop="twentyFive" />
      <el-table-column label="二十六日留存" align="center" prop="twentySix" />
      <el-table-column label="二十七日留存" align="center" prop="twentySeven" />
      <el-table-column label="二十八日留存" align="center" prop="twentyEight" />
      <el-table-column label="二十九日留存" align="center" prop="twentyNine" />
      <el-table-column label="三十日留存" align="center" prop="thirty" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-statistical:keepAlive:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-statistical:keepAlive:remove']"
          >删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listKeepAlive, getKeepAlive, delKeepAlive, addKeepAlive, updateKeepAlive } from "@/api/hash-statistical/keepAlive";

export default {
  name: "KeepAlive",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 留存分析表格数据
      keepAliveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      tabPosition: 1,
      // 三十日留存时间范围
      daterangeRegisterTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        registerTime: null,
        total: null,
        loginCount: null,
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        seven: null,
        eight: null,
        nine: null,
        ten: null,
        eleven: null,
        twelve: null,
        thirteen: null,
        fourteen: null,
        fifteen: null,
        sixteen: null,
        seventeen: null,
        eighteen: null,
        nineteen: null,
        twenty: null,
        twentyOne: null,
        twentyTwo: null,
        twentyThree: null,
        twentyFour: null,
        twentyFive: null,
        twentySix: null,
        twentySeven: null,
        twentyEight: null,
        twentyNine: null,
        thirty: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        total: [
          { required: true, message: "注册总数不能为空", trigger: "blur" }
        ],
        loginCount: [
          { required: true, message: "登录总数不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询留存分析列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeRegisterTime && '' != this.daterangeRegisterTime) {
        this.queryParams.params["beginRegisterTime"] = this.daterangeRegisterTime[0];
        this.queryParams.params["endRegisterTime"] = this.daterangeRegisterTime[1];
      }
      listKeepAlive(this.queryParams).then(response => {
        this.keepAliveList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        registerTime: null,
        total: null,
        loginCount: null,
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        seven: null,
        eight: null,
        nine: null,
        ten: null,
        eleven: null,
        twelve: null,
        thirteen: null,
        fourteen: null,
        fifteen: null,
        sixteen: null,
        seventeen: null,
        eighteen: null,
        nineteen: null,
        twenty: null,
        twentyOne: null,
        twentyTwo: null,
        twentyThree: null,
        twentyFour: null,
        twentyFive: null,
        twentySix: null,
        twentySeven: null,
        twentyEight: null,
        twentyNine: null,
        thirty: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeRegisterTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.registerTime)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加留存分析";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const registerTime = row.registerTime || this.ids
      getKeepAlive(registerTime).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改留存分析";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.registerTime != null) {
            updateKeepAlive(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKeepAlive(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const registerTimes = row.registerTime || this.ids;
      this.$modal.confirm('是否确认删除留存分析编号为"' + registerTimes + '"的数据项？').then(function () {
        return delKeepAlive(registerTimes);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-statistical/keepAlive/export', {
        ...this.queryParams
      }, `keepAlive_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss" scoped>
.my-input {
  width: 200px;
}

.label {
  margin-left: 10px;
  margin-right: 5px;
}

.div-rule {
  width: 100%;
  text-align: start;
}

::v-deep .el-radio-button__inner {
  padding: 8px 16px;
  margin-top: -2px;
}
</style>
