<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>趋势</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div id="lineChart" ref="lineChart" style="height: 360px" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>在线用户</span>
          </div>
          <el-table
            v-loading="loading"
            @sort-change="sortChange"
            :data="HashUserServiceList"
            height="420"
          >
            <!-- <el-table-column label="用户id" align="center" prop="id" /> -->
            <!-- <el-table-column label="用户类型" align="center" prop="userType" /> -->
            <!-- <el-table-column label="手机区号" align="center" prop="areaCode" sortable /> -->
            <!-- <el-table-column label="手机号" align="center" prop="phone" sortable /> -->
            <el-table-column label="用户名" align="center" prop="account" />
            <!-- <el-table-column label="密码" align="center" prop="password" /> -->
            <!-- <el-table-column label="设备码" align="center" prop="deviceCode" /> -->
            <el-table-column label="平台" align="center" prop="platform" width="100" />
            <el-table-column label="用户昵称" align="center" prop="nickName" width="100">
              <template slot-scope="scope">
                <span
                  class="global-text-blue"
                  @click="handleUserInfo(scope.row)"
                >{{ scope.row.nickName }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="头像" align="center" prop="head" width="300" /> -->
            <!-- <el-table-column label="用户状态" align="center" prop="status">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.user_status" :value="scope.row.status" />
              </template>
            </el-table-column>-->
            <!-- <el-table-column label="是否在线" align="center" prop="online">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.online" :value="scope.row.online" />
              </template>
            </el-table-column>-->
            <!-- <el-table-column label="邀请码" align="center" prop="invitationCode" /> -->
            <!-- <el-table-column label="上级邀请码" align="center" prop="fatherInvitationCode" width="100" /> -->
            <!-- <el-table-column label="注册时间" align="center" prop="registerTime" width="180" sortable></el-table-column> -->
            <!-- <el-table-column label="账户绑定时间" align="center" prop="bindTime" width="180" sortable></el-table-column> -->
            <!-- <el-table-column label="注册ip" align="center" prop="registerIp" /> -->
            <el-table-column label="登录时间" align="center" prop="loginTime" width="180" sortable></el-table-column>
            <el-table-column label="登录ip" align="center" prop="loginIp" />
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>占比</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="usedmemory" style="height: 420px" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <UserInfoDialog v-if="open" :open="open" :id="this.userId" @close="open=false" />
  </div>
</template>

<script>
import { getCache } from "@/api/monitor/cache";
import { listStatisticalOperation } from "@/api/hash-statistical/statisticalOperation";
import { listRedisOnLineList } from "@/api/hash-statistical/statisticalRedis";
import echarts from "echarts";
import UserInfoDialog from "./components/dialog/UserInfoDialog.vue";

export default {
  name: "Server",
  components: {
    UserInfoDialog
  },
  data() {
    return {
      open: false,
      userId: null,
      // 统计命令信息
      commandstats: null,
      // 使用内存
      usedmemory: null,
      lineChart: null,
      loading: true,
      // cache信息
      cache: [],
      HashUserServiceList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 30,
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'loginTime',
        isAsc: 'desc'
      }
    };
  },
  created() {
    // this.openLoading();
  },
  mounted() {
    this.getList();
  },
  methods: {

    handleUserInfo(row) {
      this.userId = row.id
      this.open = true
    },
    sortChange(val) {
      console.log(val)
      if (val.order && val.order == 'descending') {
        this.queryParams.isAsc = 'desc'
      } else {
        this.queryParams.isAsc = 'asc'
      }
      this.queryParams.orderByColumn = val.prop && val.prop
      console.log(this.queryParams)
      this.getList()
    },
    /** 查缓存询信息 */
    getList() {
      this.loading = true
      console.log("查缓存询信息")
      listStatisticalOperation(this.queryParams).then(response => {

        var list = response.rows;
        var labels = []
        var valuesActiveCount = []
        var valuesRegisterCount = []
        var valuesPromoteCount = []
        if (list) {
          list.forEach(element => {
            labels.push(element.id)
            valuesActiveCount.push(element.activeCount)
            valuesRegisterCount.push(element.registerCount)
            valuesPromoteCount.push(element.promoteCount)
          });
          this.initLineChart(labels, valuesActiveCount, valuesRegisterCount, valuesPromoteCount);
        }
      })
      listRedisOnLineList(this.queryParams2).then(response => {
        this.HashUserServiceList = response.rows
        this.total = response.total
        this.loading = false
      })

      // getCache().then((response) => {
      //   this.cache = response.data;
      //   this.$modal.closeLoading();

      //   this.commandstats = echarts.init(this.$refs.commandstats, "macarons");
      //   this.commandstats.setOption({
      //     tooltip: {
      //       trigger: "item",
      //       formatter: "{a} <br/>{b} : {c} ({d}%)",
      //     },
      //     series: [
      //       {
      //         name: "命令",
      //         type: "pie",
      //         roseType: "radius",
      //         radius: [15, 95],
      //         center: ["50%", "38%"],
      //         data: response.data.commandStats,
      //         animationEasing: "cubicInOut",
      //         animationDuration: 1000,
      //       },
      //     ],
      //   });
      //   this.usedmemory = echarts.init(this.$refs.usedmemory, "macarons");
      //   this.usedmemory.setOption({
      //     tooltip: {
      //       formatter: "{b} <br/>{a} : " + this.cache.info.used_memory_human,
      //     },
      //     series: [
      //       {
      //         name: "峰值",
      //         type: "gauge",
      //         min: 0,
      //         max: 1000,
      //         detail: {
      //           formatter: this.cache.info.used_memory_human,
      //         },
      //         data: [
      //           {
      //             value: parseFloat(this.cache.info.used_memory_human),
      //             name: "内存消耗",
      //           },
      //         ],
      //       },
      //     ],
      //   });
      // });
    },
    initLineChart(labels, valuesActiveCount, valuesRegisterCount, valuesPromoteCount) {
      this.lineChart = echarts.init(this.$refs.lineChart, "macarons");
      // var chartDom = document.getElementById('lineChart');
      // var myChart = echarts.init(chartDom);
      var option;
      const colors = ['#5470C6', '#91CC75', '#EE6666'];
      option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },
        toolbox: {
          feature: {
            dataView: { show: false, readOnly: false },
            restore: { show: false },
            saveAsImage: { show: false }
          }
        },
        legend: {
          data: ['活跃人数', '注册人数', '推广人数']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            // prettier-ignore
            data: labels
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '活跃人数',
            position: 'right',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '注册人数',
            position: 'right',
            alignTicks: true,
            offset: 80,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '推广人数',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '活跃人数',
            type: 'bar',
            data: valuesActiveCount,
            yAxisIndex: 0,
          },
          {
            name: '注册人数',
            type: 'bar',
            yAxisIndex: 1,
            data: valuesRegisterCount
          },
          {
            name: '推广人数',
            type: 'bar',
            yAxisIndex: 2,
            data: valuesPromoteCount
          }
        ]
      };

      option && this.lineChart.setOption(option);
    },
    // 打开加载层
    openLoading() {
      this.$modal.loading("正在加载缓存监控数据，请稍候！");
    },
  },
};
</script>
