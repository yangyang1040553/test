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

      <el-col :span="8" class="card-box">
        <el-card style="height:735px;">
          <div slot="header">
            <span>统计报表</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div class="item">
              <div class="circle_red"></div>
              <dir class="lable">注册人数</dir>
              <dir class="value">{{indexData.register_count}} 人</dir>
            </div>
            <div class="item">
              <div class="circle_yellow"></div>
              <dir class="lable">首冲人数</dir>
              <dir class="value">{{indexData.recharge_count}} 人</dir>
            </div>
            <div class="item">
              <div class="circle_red"></div>
              <dir class="lable">投注单量</dir>
              <dir class="value">{{indexData.bet_count}} 注</dir>
            </div>
            <div class="item">
              <div class="circle_yellow"></div>
              <dir class="lable">投注人数</dir>
              <dir class="value">{{indexData.bet_persion_count}} 人</dir>
            </div>
            <div class="item">
              <div class="circle"></div>
              <dir class="lable">本月TRX盈利</dir>
              <dir class="value">
                <span class="trx">{{indexData.curr_trx_win_amount}} TRX</span>
              </dir>
            </div>

            <div class="item">
              <div class="circle"></div>
              <dir class="lable">本月TRX盈利占比</dir>
              <dir class="value">{{(indexData.curr_trx_win_rate*100).toFixed(2) ||'0'}}%</dir>
            </div>

            <div class="item">
              <div class="circle"></div>
              <dir class="lable">本月USDT盈利</dir>
              <dir class="value">
                <span class="usdt">{{indexData.curr_usdt_win_amount}} USDT</span>
              </dir>
            </div>

            <div class="item">
              <div class="circle"></div>
              <dir class="lable">本月USDT盈利占比</dir>
              <dir class="value">{{(indexData.curr_usdt_win_rate*100).toFixed(2)||'0'}}%</dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">上月TRX盈利</dir>
              <dir class="value">
                <span class="trx">{{indexData.pre_trx_win_amount||0}} TRX</span>
              </dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">上月TRX盈利占比</dir>
              <dir class="value">{{(indexData.pre_trx_win_rate*100).toFixed(2)||'0'}}%</dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">上月USDT盈利</dir>
              <dir class="value">
                <span class="usdt">{{indexData.pre_usdt_win_amount||0}} USDT</span>
              </dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">上月USDT盈利占比</dir>
              <dir class="value">{{(indexData.pre_usdt_win_rate*100).toFixed(2)||'0'}}%</dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">本月USDT最多盈利</dir>
              <dir class="value">
                <span class="usdt">{{indexData.maxUsdt||'0'}}USDT</span>
                <span v-if="indexData.maxUsdtGameId">/</span>
                <dict-tag :options="dict.type.game_list" :value="indexData.maxUsdtGameId" />
              </dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">本月USDT最多亏损</dir>
              <dir class="value">
                <span class="usdt">{{indexData.minUsdt||'0'}}USDT</span>
                <span v-if="indexData.minUsdtGameId">/</span>
                <dict-tag :options="dict.type.game_list" :value="indexData.minUsdtGameId" />
              </dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">本月TRX最多盈利</dir>
              <dir class="value">
                <span class="trx">{{indexData.maxTrx||'0'}}TRX</span>
                <span v-if="indexData.maxTrxGameId">/</span>
                <dict-tag :options="dict.type.game_list" :value="indexData.maxTrxGameId" />
              </dir>
            </div>
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">本月TRX最多亏损</dir>
              <dir class="value">
                <span class="trx">{{indexData.minTrx||'0'}}TRX</span>
                <span v-if="indexData.minTrxGameId">/</span>
                <dict-tag :options="dict.type.game_list" :value="indexData.minTrxGameId" />
              </dir>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8" class="card-box">
        <el-card style="height:735px;">
          <div slot="header">
            <span>出入款数据</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div class="item">
              <div class="circle_red"></div>
              <dir class="lable">今日USDT充值金额</dir>
              <dir class="value">
                <span class="usdt">{{currAmountData.usdt_paymount||'0'}}USDT</span>
              </dir>
            </div>
            <div class="item">
              <div class="circle_yellow"></div>
              <dir class="lable">今日TRX充值金额</dir>
              <dir class="value">
                <span class="trx">{{currAmountData.trx_paymount||'0'}}TRX</span>
              </dir>
            </div>
            <div class="item">
              <div class="circle_red"></div>
              <dir class="lable">今日充值单数/人数</dir>
              <dir
                class="value"
              >{{currAmountData.recharge_order_count||'0'}}单/{{currAmountData.recharge_count||'0'}}人</dir>
            </div>
            <div class="item">
              <div class="circle"></div>
              <dir class="lable">今日USDT转换金额</dir>
              <dir class="value">
                <span class="usdt">{{currAmountData.usdt_to_mount||'0'}}USDT</span>
              </dir>
            </div>

            <div class="item">
              <div class="circle"></div>
              <dir class="lable">今日TRX转换金额</dir>
              <dir class="value">
                <span class="trx">{{currAmountData.trx_to_mount||'0'}}TRX</span>
              </dir>
            </div>

            <div class="item">
              <div class="circle"></div>
              <dir class="lable">今日转换单数/人数</dir>
              <dir
                class="value"
              >{{currAmountData.transaction_count||'0'}}单/{{currAmountData.transaction_people_count||'0'}}人</dir>
            </div>
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">今日USDT/TRX出款</dir>
              <dir class="value">
                <span class="usdt">{{currAmountData.usdt_out_amount||'0'}}USDT</span>/
                <span class="trx">{{currAmountData.trx_out_amount||'0'}}TRX</span>
              </dir>
            </div>
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">今日出款单数/人数</dir>
              <dir
                class="value"
              >{{currAmountData.out_pay_count||'0'}}单/{{currAmountData.out_pay_people_count||'0'}}人</dir>
            </div>
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">人工入款单数/人数</dir>
              <dir
                class="value"
              >{{currAmountData.in_count_by_people||'0'}}单/{{currAmountData.in_people_count||'0'}}人</dir>
            </div>
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">人工出款单数/人数</dir>
              <dir
                class="value"
              >{{currAmountData.out_count_by_people||'0'}}单/{{currAmountData.out_people_count||'0'}}人</dir>
            </div>
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">人工入款USDT/TRX</dir>
              <dir class="value">
                <span class="usdt">{{currAmountData.in_usdt_amount||'0'}}USDT</span>/
                <span class="trx">{{currAmountData.in_trx_amount||'0'}}TRX</span>
              </dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">人工出款USDT/TRX</dir>
              <dir class="value">
                <span class="usdt">{{currAmountData.out_usdt_amount||'0'}}USDT</span>/
                <span class="trx">{{currAmountData.out_trx_amount||'0'}}TRX</span>
              </dir>
            </div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box">
        <el-card>
          <div slot="header">
            <span>活动</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">活动优惠USDT</dir>
              <dir class="value">
                <span class="usdt">{{indexActiveAmountData.usdt_active_amount}}USDT</span>
                /{{indexActiveAmountData.usdt_count}}人
              </dir>
            </div>
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">活动优惠TRX</dir>
              <dir
                class="value"
              >{{indexActiveAmountData.trx_active_amount}}TRX/{{indexActiveAmountData.trx_count}}人</dir>
            </div>
            <div class="item" v-for="(item,index) in indexActiveData" :key="index">
              <div class="circle_red"></div>
              <dir class="lable">{{item.label}}</dir>
              <dir class="value">
                <span class="usdt">{{item.usdt_amount||'0'}}USDT</span> |
                <span class="trx">{{item.trx_amount||'0'}}TRX</span>
              </dir>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box">
        <el-card>
          <div slot="header">
            <span>返佣</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div class="item">
              <div class="circle_red"></div>
              <dir class="lable">USDT返佣</dir>
              <dir class="value">
                <span
                  class="usdt"
                >{{indexActiveAmountData.usdt_game_amount+indexActiveAmountData.usdt_dl_amount}}USDT</span>
                /{{indexActiveAmountData.usdt_back_people_conut+indexActiveAmountData.usdt_dl_back_people_count}}人
              </dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">USDT游戏返佣</dir>
              <dir class="value">
                <span class="usdt">{{indexActiveAmountData.usdt_game_amount||0}}USDT</span>
                /{{indexActiveAmountData.usdt_back_people_conut||0}}人
              </dir>
            </div>
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">USDT代理返佣</dir>
              <dir class="value">
                <span class="usdt">{{indexActiveAmountData.usdt_dl_amount||0}}USDT</span>
                /{{indexActiveAmountData.usdt_dl_back_people_conut||0}}人
              </dir>
            </div>

            <div class="item">
              <div class="circle_red"></div>
              <dir class="lable">TRX返佣</dir>
              <dir class="value">
                <span
                  class="trx"
                >{{indexActiveAmountData.trx_game_amount+indexActiveAmountData.trx_dl_amount}}TRX</span>
                /{{indexActiveAmountData.trx_back_people_conut+indexActiveAmountData.trx_dl_back_people_count}}人
              </dir>
            </div>

            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">TRX游戏返佣</dir>
              <dir class="value">
                <span class="trx">{{indexActiveAmountData.trx_game_amount||0}}TRX</span>
                /{{indexActiveAmountData.trx_back_people_conut||0}}人
              </dir>
            </div>
            <div class="item">
              <div class="circle_blue"></div>
              <dir class="lable">TRX代理返佣</dir>
              <dir class="value">
                <span class="trx">{{indexActiveAmountData.trx_dl_amount||0}}TRX</span>
                /{{indexActiveAmountData.trx_dl_back_people_conut||0}}人
              </dir>
            </div>
            <div class="item"></div>
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
            ref="multipleTable"
          >
            <el-table-column label="用户名" align="center" prop="account" />
            <el-table-column label="平台" align="center" prop="platform" width="100" />
            <el-table-column label="用户昵称" align="center" prop="nickName" width="100">
              <template slot-scope="scope">
                <span
                  class="global-text-blue"
                  @click="handleUserInfo(scope.row)"
                >{{ scope.row.noteName? scope.row.noteName: scope.row.nickName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="登录时间" align="center" prop="loginTime" width="180" sortable></el-table-column>
            <el-table-column label="登录IP" align="center" prop="loginIp" />
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams2.pageNum"
            :limit.sync="queryParams2.pageSize"
            @pagination="getOnlineList"
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
import { getIndex, currAmountInfo, indexActive, selectCurrActiveAmount } from "@/api/hash-statistical/getIndex";

export default {
  name: "Server",
  dicts: ['game_list', 'operation_type'],
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
      },
      queryParams3: {
        pageNum: 1,
        pageSize: 30,
        region: null,
        regCount: null,
        orderByColumn: 'regCount',
        isAsc: 'desc'
      },
      registerList: [],
      indexData: {},
      currAmountData: {},
      indexActiveData: [],
      indexActiveAmountData: {},
    };
  },
  created() {
    // this.openLoading();
  },
  mounted() {
    // console.log(window.location)
    this.$refs.multipleTable.bodyWrapper.scrollTop = 0;
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
            axisLabel: { interval: 0, rotate: 30 }
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
    getOnlineList() {
      listRedisOnLineList(this.queryParams2).then(response => {
        this.HashUserServiceList = response.rows
        this.total = response.total
        this.loading = false
        window.scrollTo(0, document.documentElement.clientHeight)
        // window.scrollY(-document.documentElement.clientHeight)
      })
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
          if (labels.length > 0) {
            this.initRegionChart(labels, valuesCount);
          }
        }
      });

      getIndex().then(res => {
        this.indexData = { ...res.data }
      })
      currAmountInfo().then(res => {
        this.currAmountData = { ...res.data }
      })

      indexActive().then(res => {
        // this.indexActiveData = { ...res.data }
        var data = res.data
        var list = this.dict.type.operation_type
        list.map((el) => {
          // console.log(el)
          data.map((element) => {
            // console.log(elment)
            if (el.value == element.a_type) {
              if (!el.usdt_amount && element.wallet_type == 'USDT') {
                el.usdt_amount = element.amount || 0
              }
              if (!el.trx_amount && element.wallet_type == 'TRX') {
                el.trx_amount = element.amount || 0
              }
            }
          })
        })
        this.indexActiveData = list
        console.log(list)


      })
      selectCurrActiveAmount().then(res => {
        this.indexActiveAmountData = { ...res.data }
      })

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
            axisLabel: { interval: 0, rotate: 30 }
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
<style lang="scss" scoped>
.item {
  display: flex;
  height: 40px;
  line-height: 40px;
  flex-direction: row;
  align-items: center;

  .circle {
    width: 8px;
    height: 8px;
    background: greenyellow;
    border-radius: 45px;
  }

  .circle_blue {
    width: 8px;
    height: 8px;
    background: #4092ff;
    border-radius: 45px;
  }

  .circle_red {
    width: 8px;
    height: 8px;
    background: #ff40de;
    border-radius: 45px;
  }
  .circle_yellow {
    width: 8px;
    height: 8px;
    background: #ff8640;
    border-radius: 45px;
  }

  .lable {
    font-size: 14px;
    width: 200px;
    height: 22px;
    line-height: 22px;
    text-align: start;
  }

  .value {
    display: flex;
    flex: 1;
    height: 22px;
    line-height: 22px;
    justify-content: flex-end;
    align-items: center;
    color: rgb(129, 32, 32);
  }
}

.usdt {
  color: #4092ff;
}

.trx {
  color: #ff40de;
}
</style>