<template>
  <view class="pay-container">
    <view class="order-info">
      <image :src="cover_image_url" alt />
      <view class="name">
        <text>{{title}}</text>
        <text>永久观看</text>
      </view>
      <view class="price">￥{{price}}</view>
    </view>
    <view class="pay-style">
      <view>支付方式</view>
      <view class="wx-pay">
        <image src="/static/images/wx_pay_logo@2x.png" alt />
        <view class="name">
          <text>微信支付</text>
          <text>微信安全支付</text>
        </view>
        <image class="select-image" src="/static/images/selected@2x.png" alt />
      </view>
    </view>
    <text class="tip">注：该订单不支持退款、提交订单则表示您同意《用户付款协议》</text>
    <view class="bottom">
      <view class="content">
        <text>实付金额</text>
        <text>￥{{price}}</text>
        <image @click="orderAndPay" class="pay" src="/static/images/wx_pay@2x.png" alt />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { fetch } from '../../utils/fetch'
export default {
  data() {
    return {
      title: '',
      price: '',
      cover_image_url: ''
    }
  },
  onLoad(options: any) {
    this['course_id'] = options.id
    this['title'] = options.title
    this['price'] = options.price
    // https://blog.csdn.net/weixin_34044273/article/details/92374658
    this['cover_image_url'] = options.cover_image_url
  },
  methods: {
    orderAndPay() {
      // 创建订单
      this.createOrder()
    },
    // 下单
    async createOrder() {
      const res = await fetch({
        url: 'order/create',
        method: 'POST',
        data: {
          course_id: this['course_id'],
          price: this['price']
        }
      })

      if (res.data.status === 0) {
        // 模拟支付
        // this.payOrder(res.data.order_id)

        // 微信支付
        this.wxPayOrder(res.data.order_number)
      }
    },
    // 模拟支付
    async payOrder(order_id) {
      const res = await fetch({
        url: 'order/pay',
        method: 'POST',
        data: {
          order_id
        }
      })

      if (res.data.status === 0) {
        uni.showToast({
          title: '支付成功', //提示的内容,
          icon: 'success', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {
            uni.navigateBack()
          }
        })
      }
    },
    // 微信支付
    async wxPayOrder(order_number) {
      const res = await fetch({
        url: 'pay/req_unifiedorder',
        method: 'POST',
        data: {
          order_number
        }
      })

      // 处理订单已经支付的情况
      if (res.data.payorder.result_code === 'FAIL') {
        uni.showToast({
          title: res.data.payorder.err_code_des, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {
            setTimeout(() => {
              // 返回播放页面去播放
              uni.navigateBack()
            }, 2000)
          }
        })

        return
      }

      if (res.data.status === 0) {
        uni.requestPayment({
          timeStamp: res.data.payorder.timeStamp,
          nonceStr: res.data.payorder.nonceStr,
          package: res.data.payorder.package,
          signType: res.data.payorder.signType,
          paySign: res.data.payorder.paySign,
          success: async res => {
            const res2 = await fetch({
              url: 'order/wxpaysuccess',
              method: 'POST',
              data: {
                order_number
              }
            })
            if (res2.data.status === 0) {
              uni.showToast({
                title: '支付成功', //提示的内容,
                image: '/static/images/success.png', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {
                  setTimeout(() => {
                    // 返回播放页面去播放
                    uni.navigateBack()
                  }, 2000)
                }
              })
            }
          },
          fail: ({ errMsg }) => {
            if (errMsg === 'requestPayment:fail cancel') {
              uni.showToast({
                title: '您取消了支付', //提示的内容,
                image: '/static/images/error.png', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              })
            } else {
              uni.showToast({
                title: '支付失败', //提示的内容,
                image: '/static/images/error2.png', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pay-container {
  height: 100%;
  width: 750rpx;
  .order-info {
    background-color: #ffffff;
    display: flex;
    width: 750rpx;
    height: 272rpx;
    align-items: center;
    border-bottom: 1px solid #f6f6f6;
    image {
      padding-left: 32rpx;
      width: 300rpx;
      height: 200rpx;
    }
    .name {
      align-self: flex-start;
      margin-top: 30rpx;
      margin-left: 30rpx;
      flex: 1;
      text:nth-child(1) {
        margin-top: 20rpx;
        color: #343434;
        font-size: 19px;
        display: block;
        font-weight: bolod;
      }
      text:nth-child(2) {
        margin-top: 20rpx;
        color: #a8a8a8;
        font-size: 12px;
      }
    }
    .price {
      align-self: flex-end;
      margin-bottom: 30rpx;
      color: #ee3939;
      font-size: 16px;
      font-weight: bold;
      padding-right: 32rpx;
    }
  }
  .pay-style {
    width: 750rpx;
    height: 410rpx;
    background-color: #ffffff;
    view:nth-child(1) {
      padding-left: 32rpx;
      height: 100rpx;
      line-height: 100rpx;
      border-bottom: 1px solid#F6F6F6;
      color: #343434;
      font-size: 16px;
    }
    .wx-pay {
      height: 200rpx;
      align-items: center;
      display: flex;
      // justify-content: space-between;
      image:nth-child(1) {
        padding-left: 32rpx;
        width: 38rpx;
        height: 34rpx;
      }
      .select-image {
        width: 36rpx;
        height: 36rpx;
        align-content: flex-end;
        padding-right: 32rpx;
      }
      .name {
        flex: 1;
        margin-left: 40rpx;
        text:nth-child(1) {
          color: #333333;
          display: block;
          font-size: 16px;
        }
        text:nth-child(2) {
          color: #a8a8a8;
          font-size: 11px;
          margin-top: 10rpx;
        }
      }
    }
  }
  .tip {
    position: absolute;
    color: #dbdbdb;
    width: 750rpx;
    text-align: center;
    font-size: 10px;
    bottom: 280rpx;
  }
  .bottom {
    width: 750rpx;
    height: 214rpx;
    position: fixed;
    bottom: 0;
    .content {
      align-items: center;
      display: flex;
      height: 214rpx;
      background-color: #fff;
      text:nth-child(1) {
        padding-left: 32rpx;
        color: #a2a2a2;
        font-size: 12px;
      }
      text:nth-child(2) {
        color: #ee3939;
        font-size: 20px;
        margin-left: 20rpx;
        font-weight: bold;
      }
      .pay {
        margin-left: 80rpx;
        width: 328rpx;
        height: 92rpx;
      }
    }
  }
}
</style>

