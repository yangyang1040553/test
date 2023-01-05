<template>
  <div class="app-container">
   
  </div>
</template>

<script>
import { getCache } from "@/api/monitor/cache";
import echarts from "echarts";
import UserInfoDialog from "./components/dialog/UserInfoDialog.vue";

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
        pageSize: 20,
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
  },
  methods: {
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
