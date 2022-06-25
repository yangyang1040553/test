<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      <!-- <el-form-item label="唯一id" prop="id"><el-input v-model="queryParams.id" placeholder="请输入唯一id" clearable @keyup.enter.native="handleQuery" /></el-form-item> -->
      <!-- <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>-->
      <el-form-item label="权重值" prop="weight">
        <el-input
          v-model="queryParams.weight"
          placeholder="请输入权重值"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动菜单" prop="activity">
        <el-select v-model="queryParams.activity" placeholder="请选择是否活动菜单" clearable>
          <el-option
            v-for="dict in dict.type.is_activity"
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
          v-hasPermi="['hash-game:gameMenu:add']"
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
          v-hasPermi="['hash-game:gameMenu:edit']"
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
          v-hasPermi="['hash-game:gameMenu:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-game:gameMenu:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="gameMenuList"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      height="600"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="唯一id" align="center" prop="id" />
      <el-table-column label="菜单名称" align="center" prop="menuName" />
      <el-table-column label="权重值" align="center" prop="weight" />
      <el-table-column label="是否活动菜单" align="center" prop="activity">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_activity" :value="scope.row.activity" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hash-game:gameMenu:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.activity != 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hash-game:gameMenu:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改游戏菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="100px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="权重值" prop="weight">
          <el-input
            v-model="form.weight"
            placeholder="请输入权重值"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </el-form-item>
        <el-form-item v-if="isEdit" label="活动菜单" prop="activity">
          <el-select v-model="form.activity" placeholder="请选择是否活动菜单" :disabled="form.activity == 1">
            <el-option
              v-for="dict in dict.type.is_activity"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认图标" prop="unSelectedAddr">
          <UploadVue :index="1" :url="form.unSelectedAddr" @setImageUrl="setImageUrl" />
        </el-form-item>
        <el-form-item label="选中图标" prop="selectedAddr" style="margin-top:160px;">
          <UploadVue :index="2" :url="form.selectedAddr" @setImageUrl="setImageUrl" />
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
import { listGameMenu, getGameMenu, delGameMenu, addGameMenu, updateGameMenu } from '@/api/hash-game/gameMenu'
import UploadVue from '../../components/upload/Upload.vue'
export default {
  name: 'GameMenu',
  dicts: ['is_activity'],
  components: { UploadVue },
  data() {
    return {
      isEdit: false,
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
      // 游戏菜单表格数据
      gameMenuList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        menuName: null,
        weight: null,
        activity: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        weight: [{ required: true, message: '权重值不能为空', trigger: 'blur' }],
        activity: [{ required: true, message: '添加的时候要进行判定不能为空', trigger: 'change' }],
        selectedAddr: [{ required: true, message: '请选择默认状态图标', trigger: 'change' }],
        unSelectedAddr: [{ required: true, message: '请选择选中状态图标', trigger: 'change' }],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    tableRowClassName({
      row,
      rowIndex,
    }) {
      if (row.activity == 1) {
        return 'green'
      }
      return 'red'
    },
    setImageUrl(param) {
      console.log("url==", param)
      if (param.index == 1) {
        this.form.unSelectedAddr = param.url
      } else {
        this.form.selectedAddr = param.url
      }
    },
    /** 查询游戏菜单列表 */
    getList() {
      this.loading = true
      listGameMenu(this.queryParams).then(response => {
        this.gameMenuList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        menuName: null,
        weight: null,
        activity: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.isEdit = false
      this.reset()
      this.open = true
      this.title = '添加游戏菜单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isEdit = true
      this.reset()
      const id = row.id || this.ids
      getGameMenu(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改游戏菜单'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGameMenu(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addGameMenu(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除游戏菜单编号为"' + ids + '"的数据项？')
        .then(function () {
          return delGameMenu(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => { })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'hash-game/gameMenu/export',
        {
          ...this.queryParams
        },
        `gameMenu_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style scoped>
.form {
  height: 60vh;
}
</style>