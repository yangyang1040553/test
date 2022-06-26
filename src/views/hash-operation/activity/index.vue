<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="活动类型" prop="id">
        <el-select v-model="queryParams.id" placeholder="请选择活动类型" clearable>
          <el-option
            v-for="dict in dict.type.operation_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否开启" prop="isOpen">
        <el-select v-model="queryParams.isOpen" placeholder="请选择是否开启" clearable>
          <el-option
            v-for="dict in dict.type.is_open"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-operation:activity:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hash-operation:activity:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hash-operation:activity:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-operation:activity:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      height="600"
      :data="activityList"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="活动类型" align="center" prop="id">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.operation_type" :value="scope.row.id" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="配置数据" align="center" prop="json" /> -->
      <el-table-column label="是否开启" align="center" prop="isOpen">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_open" :value="scope.row.isOpen" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime || "-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime || "-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-operation:activity:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-operation:activity:remove']"
          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改运营活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="from">
        <el-form-item label="是否开启" prop="isOpen">
          <el-select v-model="form.isOpen" placeholder="请选择是否开启" clearable>
            <el-option
              v-for="dict in dict.type.is_open"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配置数据" prop="json">
          <div class="box" v-for="(item,index) in jsonArray" :key="index">
            <div class="box-lable">{{keyText}}</div>
            <el-input
              class="input-text"
              oninput="value=value.replace(/[^\d\.]/g,'')"
              v-model="item.key"
              type="text"
              placeholder="请输入内容"
            />
            <div class="box-lable">{{valueText}}</div>
            <el-input
              class="input-text"
              oninput="value=value.replace(/[^\d\.]/g,'')"
              v-model="item.value"
              type="text"
              placeholder="请输入内容"
            />
            <el-select
              class="input-text"
              v-model="item.walletType"
              placeholder="请选择是钱包类型"
              clearable
              prop="walletType"
            >
              <el-option
                v-for="dict in dict.type.wallet_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            <div class="add global-bg-blue" @click="addJson">+</div>
            <div class="reduce global-bg-red" @click="reduceJson(index)">-</div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listActivity, getActivity, delActivity, addActivity, updateActivity } from "@/api/hash-operation/activity";

export default {
  name: "Activity",
  dicts: ['operation_type', 'is_open', 'wallet_type'],
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
      // 运营活动表格数据
      activityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      jsonArray: [],
      keyText: '',
      valueText: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        isOpen: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        isOpen: [{ required: true, message: '请选择是否开启', trigger: 'blur' }],
        walletType: [{ required: true, message: '请选择活动类型', trigger: 'blur' }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    tableRowClassName({
      row,
      rowIndex,
    }) {
      if (row.isOpen == 1) {
        return 'green'
      }
      return 'red'
    },
    addJson() {
      this.jsonArray.push({})
    },
    reduceJson(index) {
      if (this.jsonArray.length > 1) {
        this.jsonArray.splice(index, 1)
      }
    },
    /** 查询运营活动列表 */
    getList() {
      this.loading = true;
      listActivity(this.queryParams).then(response => {
        this.activityList = response.rows;
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
        id: null,
        json: null,
        isOpen: null,
        createTime: null,
        updateTime: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加运营活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getActivity(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改运营活动";
        this.jsonArray = JSON.parse(response.data.json)
        if (id == 1) {
          this.keyText = '累计'
          this.valueText = '奖励'
        } else if (id == 2) {
          this.keyText = '亏损'
          this.valueText = '赠送'
        } else if (id == 3) {
          this.keyText = '次数'
          this.valueText = '奖励'
        }
        else if (id == 4) {
          this.keyText = '连赢'
          this.valueText = '奖励'
        }
        else if (id == 5) {
          this.keyText = '累计'
          this.valueText = '奖励'
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.json = JSON.stringify(this.jsonArray)
          if (this.form.id != null) {
            updateActivity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addActivity(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除运营活动编号为"' + ids + '"的数据项？').then(function () {
        return delActivity(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-operation/activity/export', {
        ...this.queryParams
      }, `activity_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style  lang="scss" scoped>
.box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;

  .box-lable {
    height: 32px;
    width: 100px;
    display: flex;
    justify-content: center;
    line-height: 32px;
  }
  .input-text {
    margin-right: 20px;
    min-width: 100px;
  }

  .add,
  .reduce {
    width: 32px;
    min-width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 32px;
    height: 32px;
    border-radius: 90px;
    color: white;
    font-weight: 900;
    margin-right: 10px;
  }
}

.from {
  // display: flex;
  // flex: 1;
  height: 60vh;
}
</style>
