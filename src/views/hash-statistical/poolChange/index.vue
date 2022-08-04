<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <!-- <el-form-item label="usdt金额" prop="usdtAmount">
        <el-input
          v-model="queryParams.usdtAmount"
          placeholder="请输入usdt金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="trx金额" prop="trxAmount">
        <el-input
          v-model="queryParams.trxAmount"
          placeholder="请输入trx金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"
        ></el-date-picker>
      </el-form-item>-->
      <!-- <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>-->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hash-statistical:poolChange:add']"
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
          v-hasPermi="['hash-statistical:poolChange:edit']"
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
          v-hasPermi="['hash-statistical:poolChange:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hash-statistical:poolChange:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-card>
      <div slot="header">
        <span>趋势</span>
      </div>
      <div class="el-table el-table--enable-row-hover el-table--medium">
        <div id="lineChart" ref="lineChart" style="height: 500px;margin-bottom:100px;" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { listPoolChange, getPoolChange, delPoolChange, addPoolChange, updatePoolChange } from "@/api/hash-statistical/poolChange";
import echarts from "echarts";
export default {
  name: "PoolChange",
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
      // 游戏奖金池变化表格数据
      poolChangeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      lineChart: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 1000,
        usdtAmount: null,
        trxAmount: null,
        createTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();

  },
  methods: {
    initLineChart(labels, trxList, usdtList) {
      this.lineChart = echarts.init(this.$refs.lineChart, "macarons");
      var option;
      const colors = ['#5470C6', '#91CC75'];
      var option = {
        color: colors,
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['TRX涨幅', "USDT涨幅"]
        },
        // visualMap: [
        //   {
        //     show: false,
        //     type: 'continuous',
        //     seriesIndex: 0,
        //     min: 0,
        //     max: 400
        //   },
        //   {
        //     show: false,
        //     type: 'continuous',
        //     seriesIndex: 1,
        //     dimension: 0,
        //     min: 0,
        //     max: labels.length - 1
        //   }
        // ],
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: labels,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: { interval: 0, rotate: 20 }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'TRX涨幅',
            type: 'line',
            data: trxList,
            // markLine: {
            //   data: [{ type: 'average', name: 'Avg' }]
            // },
            // label: {
            //   show: true,
            //   position: 'top'
            // },
          },

          {
            name: 'USDT涨幅',
            type: 'line',
            data: usdtList,
            // markLine: {
            //   data: [{ type: 'average', name: 'Avg' }]
            // },
            // label: {
            //   show: true,
            //   position: 'top'
            // },
          },
        ]
      };

      this.lineChart.setOption(option);
    },
    /** 查询游戏奖金池变化列表 */
    getList() {
      this.loading = true;
      listPoolChange(this.queryParams).then(response => {
        this.poolChangeList = response.rows;
        this.total = response.total;
        this.loading = false;


        // this.poolChangeList = this.poolChangeList.concat(this.poolChangeList)
        // this.poolChangeList = this.poolChangeList.concat(this.poolChangeList)
        // this.poolChangeList = this.poolChangeList.concat(this.poolChangeList)

        var labels = []
        var trxList = []
        var usdtList = []
        if (this.poolChangeList) {
          this.poolChangeList.forEach(element => {
            // labels.push(element.createTime)
            // labels.push("")
            trxList.push(element.trxAmount)
            usdtList.push(element.usdtAmount)
          });
          this.initLineChart(labels, trxList, usdtList);
        }



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
        usdtAmount: null,
        trxAmount: null,
        createTime: null
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
      this.title = "添加游戏奖金池变化";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPoolChange(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏奖金池变化";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePoolChange(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPoolChange(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除游戏奖金池变化编号为"' + ids + '"的数据项？').then(function () {
        return delPoolChange(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hash-statistical/poolChange/export', {
        ...this.queryParams
      }, `poolChange_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
