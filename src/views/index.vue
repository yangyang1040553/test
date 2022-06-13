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
            <span>
              在线用户
              <span class="global-text-red">{{total}}</span> 人
            </span>
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
            :page.sync="queryParams2.pageNum"
            :limit.sync="queryParams2.pageSize"
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
            <div ref="regionChart" style="height: 470px" />
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
import { listRegister } from "@/api/hash-statistical/regionRegister";

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
        pageSize: 20,
        orderByColumn: 'loginTime',
        isAsc: 'desc'
      },
      queryParams3: {
        pageNum: 1,
        pageSize: 30,
        region: null,
        regCount: null,
        orderByColumn: 'regCount',
        isAsc: 'desc'
      },
      registerList: []
    };
  },
  created() {
    // this.openLoading();
  },
  mounted() {
    this.getList();
    this.getLineChart()
  },
  methods: {
    handleUserInfo(row) {
      this.userId = row.id
      this.open = true
    },
    sortChange(val) {
      console.log(val)
      if (val.order && val.order == 'descending') {
        this.queryParams2.isAsc = 'desc'
      } else {
        this.queryParams2.isAsc = 'asc'
      }
      this.queryParams2.orderByColumn = val.prop && val.prop
      console.log(this.queryParams2)
      this.getList()
    },
    getLineChart() {
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
    },
    initRegionChart(labels, valuesCount) {
      this.lineChart = echarts.init(this.$refs.regionChart, "macarons");
      var option;
      const colors = ['#5470C6', '#91CC75', '#EE6666'];

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
          data: ['区域注册统计']
        },
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
            axisLabel: { interval: 1, rotate: 30 }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '区域注册统计',
            type: 'bar',
            data: valuesCount,
            label: {
              show: true,
              position: 'top'
            },
          },
        ]
      };
      this.lineChart.setOption(option);
    },
    /** 查缓存询信息 */
    getList() {
      this.loading = true
      console.log("查缓存询信息")
      listRedisOnLineList(this.queryParams2).then(response => {
        this.HashUserServiceList = response.rows
        this.total = response.total
        this.loading = false
      })
      listRegister(this.queryParams3).then(response => {
        this.registerList = response.rows;
        var labels = []
        var valuesCount = []
        if (this.registerList) {
          this.registerList.forEach(element => {
            labels.push(element.region)
            valuesCount.push(element.regCount)
          });
          console.log(labels,valuesCount)
          if (labels.length > 0) {
            this.initRegionChart(labels, valuesCount);
          }
        }
      });

    },
    initLineChart(labels, valuesActiveCount, valuesRegisterCount, valuesPromoteCount) {
      this.lineChart = echarts.init(this.$refs.lineChart, "macarons");
      // var chartDom = document.getElementById('lineChart');
      // var myChart = echarts.init(chartDom);
      var option;
      const colors = ['#5470C6', '#91CC75', '#EE6666'];
      // option = {
      //   color: colors,
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'cross'
      //     }
      //   },
      //   grid: {
      //     right: '10%'
      //   },
      //   toolbox: {
      //     feature: {
      //       dataView: { show: false, readOnly: false },
      //       restore: { show: false },
      //       saveAsImage: { show: false }
      //     }
      //   },
      //   legend: {
      //     data: ['活跃人数', '注册人数', '推广人数']
      //   },
      //   xAxis: [
      //     {
      //       type: 'category',
      //       axisTick: {
      //         alignWithLabel: true
      //       },
      //       // prettier-ignore
      //       data: labels
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value',
      //       name: '活跃人数',
      //       position: 'left',
      //       alignTicks: true,
      //       axisLine: {
      //         show: true,
      //         lineStyle: {
      //           color: colors[0]
      //         }
      //       },
      //       axisLabel: {
      //         formatter: '{value}'
      //       }
      //     },
      //     {
      //       type: 'value',
      //       name: '注册人数',
      //       position: 'right',
      //       alignTicks: true,
      //       offset: 80,
      //       axisLine: {
      //         show: true,
      //         lineStyle: {
      //           color: colors[1]
      //         }
      //       },
      //       axisLabel: {
      //         formatter: '{value}'
      //       }
      //     },
      //     {
      //       type: 'value',
      //       name: '推广人数',
      //       position: 'right',
      //       alignTicks: true,
      //       axisLine: {
      //         show: true,
      //         lineStyle: {
      //           color: colors[2]
      //         }
      //       },
      //       axisLabel: {
      //         formatter: '{value}'
      //       }
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '活跃人数',
      //       type: 'bar',
      //       data: valuesActiveCount,
      //       yAxisIndex: 0,
      //     },
      //     {
      //       name: '注册人数',
      //       type: 'bar',
      //       yAxisIndex: 1,
      //       data: valuesRegisterCount
      //     },
      //     {
      //       name: '推广人数',
      //       type: 'bar',
      //       yAxisIndex: 2,
      //       data: valuesPromoteCount
      //     }
      //   ]
      // };

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
          data: ['活跃人数', '注册人数', '推广人数']
        },
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
             axisLabel: { interval: 1, rotate: 30 }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '活跃人数',
            type: 'bar',
            data: valuesActiveCount,
            // markLine: {
            //   data: [{ type: 'average', name: 'Avg' }]
            // },
            label: {
              show: true,
              position: 'top'
            },
          },
          {
            name: '注册人数',
            type: 'bar',
            data: valuesRegisterCount,
            // markLine: {
            //   data: [{ type: 'average', name: 'Avg' }]
            // },
            label: {
              show: true,
              position: 'top'
            },
          },
          {
            name: '推广人数',
            type: 'bar',
            data: valuesPromoteCount,
            // markLine: {
            //   data: [{ type: 'average', name: 'Avg' }]
            // },
            label: {
              show: true,
              position: 'top'
            },
          }
        ]
      };

      this.lineChart.setOption(option);
    },
    // 打开加载层
    openLoading() {
      this.$modal.loading("正在加载缓存监控数据，请稍候！");
    },
  },
};
</script>
