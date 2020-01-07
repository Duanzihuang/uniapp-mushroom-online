<template>
  <view class="container">
    <view class="star-bg">
      <image
        @click="star(index)"
        v-for="(item,index) in 5"
        :key="item"
        src="/static/images/star_empty@2x.png"
        alt
      />
    </view>
    <view class="star">
      <image
        @click="star(index)"
        v-for="(item,index) in myScore"
        :key="item"
        src="/static/images/star_fill@2x.png"
        alt
      />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      default: 5
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      myScore: 0
    }
  },
  onReady() {
    this.myScore = this.score
  },
  methods: {
    star(index) {
      if (this.readonly) return
      this.myScore = index + 1
      // 传递选择的分数给父组件
      this.$emit('changeScore', this.myScore)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
}
.star,
.star-bg {
  float: left;
  display: flex;
  height: 50rpx;
  align-items: center;
  image {
    width: 38rpx;
    height: 36rpx;
  }
}
.star {
  position: absolute;
  top: 0;
  left: 0;
}
</style>