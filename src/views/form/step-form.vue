<template>
  <div class="main-container">
    <el-card
      :body-style="{padding: '5px'}"
      shadow="hover"
    >
      <el-steps
        :active="activeStep"
        align-center
        finish-status="success"
        class="steps-wrapper"
      >
        <el-step title="填写转账信息" />
        <el-step title="确认转账信息" />
        <el-step title="完成" />
      </el-steps>
    </el-card>
    <el-card
      :body-style="{padding: '5px'}"
      shadow="hover"
      class="margin-top-xs"
    >
      <div class="title text-center padding">
        <el-link
          type="primary"
          :underline="false"
          class="text-xxl"
        >{{ activeStep === 1 || activeStep === 2 ? '请填写转账信息' : '转账结果' }}</el-link>
      </div>
      <AccountInfo
        v-if="activeStep === 1"
        @next-step="next"
      />
      <PasswordInfo
        v-if="activeStep === 2"
        :account-info="accountInfo"
        @next-step="activeStep++"
        @pre-step="activeStep--"
      />
      <ResultInfo
        v-if="activeStep === 3"
        :account-info="accountInfo"
        @pre-step="activeStep = 1"
      />
    </el-card>
  </div>
</template>

<script>
import AccountInfo from './components/AccountInfo';
import PasswordInfo from './components/PasswordInfo';
import ResultInfo from './components/ResultInfo';
export default {
  name: 'StepForm',
  components: { AccountInfo, PasswordInfo, ResultInfo, },
  data() {
    return {
      activeStep: 1,
      accountInfo: {},
    };
  },
  methods: {
    next(accountInfo) {
      if (this.activeStep === 1) {
        this.accountInfo = accountInfo;
        this.activeStep += 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-step__title {
  font-size: 14px;
}
@media screen and (max-width: 768px) {
  .steps-wrapper {
    width: 100%;
    margin: 0 auto;
  }
}
@media screen and (min-width: 768px) {
  .steps-wrapper {
    width: 60%;
    margin: 0 auto;
  }
}
</style>
