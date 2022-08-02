<template>
  <div>
    <el-dialog title :visible.sync="isOpen" width="1000px" append-to-body @close="cancel">
      <el-radio-group class="button" v-model="tabPosition">
        <el-radio-button label="1">游戏记录</el-radio-button>
        <el-radio-button label="2">流水</el-radio-button>
        <el-radio-button label="3">钱包</el-radio-button>
      </el-radio-group>

      <el-form ref="form" class="form" :model="form" label-width="140px" disabled>
        <div class="left">
          <el-form-item label="手机区号" prop="areaCode">
            <el-input :value="form.areaCode|| '-'" placeholder />
            <!-- <span class="label">{{ form.areaCode || "-"}}</span> -->
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder />
          </el-form-item>
          <el-form-item label="用户名" prop="account">
            <el-input v-model="form.account" placeholder />
          </el-form-item>
          <!-- <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" />
          </el-form-item>-->
          <el-form-item label="USDT总额" prop="usdtAmount">
            <el-input v-model="form.usdtAmount" placeholder />
          </el-form-item>
          <el-form-item label="TRX总额" prop="trxAmount">
            <el-input v-model="form.trxAmount" placeholder />
          </el-form-item>
          <el-form-item label="设备码" prop="deviceCode">
            <el-input v-model="form.deviceCode" placeholder />
          </el-form-item>
          <el-form-item label="平台" prop="platform">
            <el-input v-model="form.platform" placeholder />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" placeholder />
          </el-form-item>
          <el-form-item label="用户备注" prop="noteName">
            <el-input v-model="form.noteName" placeholder />
          </el-form-item>

          <el-form-item label="一级代理人数" prop="level1Person">
            <el-input :value="form.level1Person||0.00" placeholder />
          </el-form-item>
          <el-form-item label="二级代理人数" prop="level2Person">
            <el-input :value="form.level2Person||0.00" placeholder />
          </el-form-item>
          <el-form-item label="三级代理人数" prop="level3Person">
            <el-input :value="form.level3Person||0.00" placeholder />
          </el-form-item>
          <el-form-item label="总代理人数" prop="sumNumber">
            <el-input :value="form.sumNumber||0.00" placeholder />
          </el-form-item>
          <el-form-item label="返佣赔率" prop="promoteOdds">
            <el-input v-model="form.promoteOdds" placeholder />
          </el-form-item>
          <el-form-item label="分享返佣赔率" prop="sharePromoteOdds">
            <el-input v-model="form.sharePromoteOdds" placeholder />
          </el-form-item>

          <el-form-item label="TRC地址" prop="hashAddressTrx">
            <el-input v-model="form.hashAddressTrx" placeholder />
          </el-form-item>
          <el-form-item label="TRC转换地址" prop="hashTransAddressTrx">
            <el-input v-model="form.hashTransAddressTrx" placeholder />
          </el-form-item>
        </div>
        <div class="line"></div>
        <div class="right">
           <el-form-item label="是否在线" prop="online">
            <el-select v-model="form.online" placeholder>
              <el-option
                v-for="dict in dict.type.online"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邀请码" prop="invitationCode">
            <el-input v-model="form.invitationCode" placeholder />
          </el-form-item>
          <el-form-item label="上级邀请码" prop="fatherInvitationCode">
            <el-input v-model="form.fatherInvitationCode" placeholder />
          </el-form-item>
           <el-form-item label="USDT远程总额" prop="usdt_remote_amount">
            <el-input v-model="form.usdt_remote_amount" placeholder />
          </el-form-item>
          <el-form-item label="TRX远程总额" prop="trx_remote_amount">
            <el-input v-model="form.trx_remote_amount" placeholder />
          </el-form-item>
          <!-- <el-form-item label="今日投注金额" prop="head">
            <el-input v-model="form.head" placeholder />
          </el-form-item>-->
          <el-form-item label="今日TRX投注金额">
            <el-input :value="form.trx_bet_amount||0.00" placeholder />
          </el-form-item>
          <el-form-item label="今日USDT投注金额">
            <el-input :value="form.usdt_bet_amount||0.00" placeholder />
          </el-form-item>
          <el-form-item label="今日TRX充值金额">
            <el-input :value="form.trx_in_amount||0.00" placeholder />
          </el-form-item>
          <el-form-item label="今日USDT充值金额">
            <el-input :value="form.usdt_in_amount||0.00" placeholder />
          </el-form-item>
          <el-form-item label="今日TRX提现金额">
            <el-input :value="form.trx_out_mount||0.00" placeholder />
          </el-form-item>
          <el-form-item label="今日USDT提现金额">
            <el-input :value="form.usdt_out_mount||0.00" placeholder />
          </el-form-item>

          <el-form-item label="用户状态" prop="status">
            <el-select v-model="form.status" placeholder>
              <el-option
                v-for="dict in dict.type.user_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="注册时间" prop="registerTime">
            <el-date-picker
              clearable
              v-model="form.registerTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="账户绑定时间" prop="bindTime">
            <el-date-picker
              clearable
              v-model="form.bindTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="注册IP" prop="registerIp">
            <el-input v-model="form.registerIp" placeholder />
          </el-form-item>
          <el-form-item label="IP地址" prop="ipAddr">
            <el-input v-model="form.ipAddr" placeholder />
          </el-form-item>
          <el-form-item label="登录时间" prop="loginTime">
            <el-date-picker
              clearable
              v-model="form.loginTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="登录IP" prop="loginIp">
            <el-input v-model="form.loginIp" placeholder />
          </el-form-item>
          <!-- <el-form-item label="用户备注" prop="noteName">
            <el-input v-model="form.noteName" placeholder />
          </el-form-item>-->
          <el-form-item label="飞机ID" prop="tgId">
            <el-input v-model="form.tgId" placeholder />
          </el-form-item>
          <el-form-item label="飞机账号" prop="tgAccount">
            <el-input v-model="form.tgAccount" placeholder />
          </el-form-item>
        </div>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import { getHashUserService } from '@/api/hash-user/HashUserService'
export default {
  dicts: ['online', 'user_status'],
  data() {
    return {
      form: {},
      isOpen: this.open,
      tabPosition: -1,
    }
  },
  props: ["id", "open"],
  mounted() {
    getHashUserService(this.id).then(response => {
      console.log(response)
      this.form = response.data
    })
  },
  watch: {
    tabPosition(news, old) {
      console.log(news, old)
      if (news == 1) { this.handleGame() }
      if (news == 2) { this.handleWallet() }
      if (news == 3) { this.toWallet() }
    }
  },
  methods: {
    cancel() {
      this.$emit("close", true)
    },
    handleGame() {
      this.$router.push({ path: "/hash-game/record", query: { userId: this.form.id } })
    },
    handleWallet() {
      this.$router.push({ path: "/wallet/walletTurnover", query: { userId: this.form.id } })
    },
    toWallet() {
      this.$router.push({ path: "/wallet/management", query: { userId: this.form.id } })
    },
  }
}
</script>
<style  lang="scss" scoped>
::v-deep .el-dialog__body {
  padding-top: 0px;
  // display: none;
}
.button {
  margin-left: 50px;
  margin-bottom: 10px;
}
.form {
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: row;
  overflow-y: auto;

  .left,
  .right {
    width: 49%;
    height: 100%;
  }

  .line {
    width: 1px;
    margin-left: 10px;
    height: 100vh;
    background: gainsboro;
  }
}

::v-deep .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  border-color: #dfe4ed;
  color: #1890ff !important;
  cursor: not-allowed;

  .el-input__icon:after {
    content: none;
    height: 100%;
    width: 0;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
