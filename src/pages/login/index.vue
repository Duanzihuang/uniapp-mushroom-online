<template>
  <view class="login-container">
    <image class="logo" src="/static/images/logo@2x.png" alt />
    <text class="title">蘑菇在线</text>
    <image class="login-tips" src="/static/images/login_tips@2x.png" alt />
    <button open-type="getUserInfo" @getuserinfo="wxLogin" plain class="wx-login-button">
      <image class="wx-login-img" src="/static/images/wx_login@2x.png" alt />
    </button>
    <text @click="phoneLogin" class="phone-login">手机号登录</text>
    <text class="bottom-tip">Copyright © 2019 蘑菇在线</text>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import { fetch } from '../../utils/fetch'
import loginMixin from '../../mixins/login'
export default Vue.extend({
  mixins:[loginMixin],
  methods: {
    // 跳转到手机号登录页面
    phoneLogin() {
      uni.navigateTo({
        url: '/pages/phone-login/index'
      })
    },
    // 选择微信登录
    goToWxLogin() {},
    // 微信登录
    wxLogin(e) {
      if (e.mp.detail.errMsg === 'getUserInfo:fail auth deny') {
        return
      }
      // 获取登录的code
      uni.login({
        success: async ({ code }) => {
          const res = await fetch({
            url: 'user/wxlogin',
            method: 'POST',
            tip: '登录中...',
            isNeedAuth: false,
            data: {
              code,
              nickname: e.mp.detail.userInfo.nickName,
              avatar: e.mp.detail.userInfo.avatarUrl
            }
          })

          // 调用混入中的方法
          this['loginHandle'](res)
        }
      })
    }
  }
})
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo {
    margin-top: 180rpx;
    width: 212rpx;
    height: 212rpx;
  }
  .title {
    color: #333333;
    font-size: 24px;
    margin-top: 20rpx;
  }
  .login-tips {
    margin-top: 30rpx;
    height: 34rpx;
    width: 292rpx;
    position: relative;
  }
  .wx-login-button {
    margin-top: 200rpx;
    width: 568rpx;
    height: 98rpx;
    padding: 0;
    border: none;
  }
  .wx-login-img {
    // margin-top:200rpx;
    width: 568rpx;
    height: 98rpx;
  }
  .phone-login {
    margin-top: 40rpx;
    color: #333333;
    font-size: 15px;
  }
  .bottom-tip {
    color: #a8a8a8;
    font-size: 10px;
    position: absolute;
    bottom: 40rpx;
  }
}
.wx-login-container {
  position: relative;
  .wx-login-tip1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 450rpx;
    padding-top: 50rpx;
    img {
      width: 198rpx;
      height: 198rpx;
    }
    p {
      color: #bebebe;
      margin-top: 50rpx;
      font-size: 13px;
    }
  }
  .wx-login-tip1-cover {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 500rpx;
    background: rgba(0, 0, 0, 1);
    opacity: 0.16;
  }
}
</style>
