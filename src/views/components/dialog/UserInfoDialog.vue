<template>
  <div>
    <el-dialog title="用户详情" :visible.sync="isOpen" width="1000px" append-to-body @close="cancel">
      <el-form ref="form" class="form" :model="form" label-width="120px">
        <div class="left">
          <el-form-item label="手机区号" prop="areaCode">
            <el-input v-model="form.areaCode" placeholder="" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="" />
          </el-form-item>
          <el-form-item label="用户名" prop="account">
            <el-input v-model="form.account" placeholder="" />
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
            <el-input v-model="form.deviceCode" placeholder="" />
          </el-form-item>
          <el-form-item label="平台" prop="platform">
            <el-input v-model="form.platform" placeholder="" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" placeholder="" />
          </el-form-item>
          <el-form-item label="一级代理人数" prop="level1Person">
            <el-input v-model="form.level1Person" placeholder="" />
          </el-form-item>
          <el-form-item label="二级代理人数" prop="level2Person">
            <el-input v-model="form.level2Person" placeholder="" />
          </el-form-item>
          <el-form-item label="三级代理人数" prop="level3Person">
            <el-input v-model="form.level3Person" placeholder="" />
          </el-form-item>
          <el-form-item label="总代理人数" prop="sumNumber">
            <el-input v-model="form.sumNumber" placeholder="" />
          </el-form-item>
        </div>
        <div class="line"></div>
        <div class="right">
          <el-form-item label="头像" prop="head">
            <el-input v-model="form.head" placeholder="" />
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-select v-model="form.status" placeholder="">
              <el-option
                v-for="dict in dict.type.user_status"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否在线" prop="online">
            <el-select v-model="form.online" placeholder="">
              <el-option
                v-for="dict in dict.type.online"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邀请码" prop="invitationCode">
            <el-input v-model="form.invitationCode" placeholder="" />
          </el-form-item>
          <el-form-item label="上级邀请码" prop="fatherInvitationCode">
            <el-input v-model="form.fatherInvitationCode" placeholder="" />
          </el-form-item>
          <el-form-item label="注册时间" prop="registerTime">
            <el-date-picker
              clearable
              v-model="form.registerTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="账户绑定时间" prop="bindTime">
            <el-date-picker
              clearable
              v-model="form.bindTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="注册ip" prop="registerIp">
            <el-input v-model="form.registerIp" placeholder="" />
          </el-form-item>
          <el-form-item label="登录时间" prop="loginTime">
            <el-date-picker
              clearable
              v-model="form.loginTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择登录时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="登录ip" prop="loginIp">
            <el-input v-model="form.loginIp" placeholder="" />
          </el-form-item>
          <el-form-item label="IP地址" prop="ipAddr">
            <el-input v-model="form.ipAddr" placeholder />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button @click="cancel">取 消</el-button>
      </div>
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
      isOpen: this.open
    }
  },
  props: ["id", "open"],
  mounted() {
    getHashUserService(this.id).then(response => {
      console.log(response)
      this.form = response.data
    })
  },
  methods: {
    cancel() {
      this.$emit("close", true)
    }
  }
}
</script>
<style  lang="scss" scoped>
.form {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;

  .left,
  .right {
    width: 49%;
    height: 100%;
  }

  .line {
    width: 1px;
    margin-left: 10px;
    height: 70vh;
    background: gainsboro;
  }
}
</style>