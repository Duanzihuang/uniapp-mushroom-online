<template>
  <div class="mp-circle-container">
    <canvas
      class="mp-circle"
      :style="{width:width+'px',height:height+'px'}"
      :canvas-id="'canvas-'+canvasId"
    ></canvas>
  </div>
</template>

<script lang="javascript">
export default {
  data() {
    return {
      myForegroundColor: 'B4D66E'
    }
  },
  props: {
    canvasId: {
      type: Number
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    backgroundColor: {
      type: String,
      default: '#f3f3f3'
    },
    foregroundColor: {
      type: String,
      default: '#B4D66E'
    },
    lineWidth: {
      type: Number,
      default: 5
    },
    progress: {
      type: Number,
      default: 100
    }
  },
  updated() {
    this.myForegroundColor = this.foregroundColor
    this.drawProgress()
  },
  onReady() {
    this.drawProgress()
  },
  methods: {
    // 绘制进度
    drawProgress() {
      if (this.progress <= 30) {
        this.myForegroundColor = '#ff0000'
      } else if (this.progress > 30 && this.progress < 50) {
        this.myForegroundColor = '#FF783B'
      } else {
        this.myForegroundColor = '#B4D66E'
      }
      // canvas
      const ctx = uni.createCanvasContext('canvas-' + this.canvasId)
      // 绘制背景色
      ctx.beginPath()
      ctx.setStrokeStyle(this.backgroundColor)
      ctx.setLineWidth(this.lineWidth)
      // 绘制圆
      ctx.arc(
        this.width / 2 + this.lineWidth / 2,
        this.height / 2 + this.lineWidth / 2,
        this.width / 2 - this.lineWidth,
        0,
        2 * Math.PI,
        true
      )
      ctx.stroke()
      // ctx.restore()
      // 绘制前景色
      ctx.beginPath()
      ctx.setStrokeStyle(this.myForegroundColor)
      ctx.setLineWidth(this.lineWidth)
      ctx.setLineCap('round')
      ctx.arc(
        this.width / 2 + this.lineWidth / 2,
        this.height / 2 + this.lineWidth / 2,
        this.width / 2 - this.lineWidth,
        -0.5 * Math.PI,
        (this.progress / 100) * 2 * Math.PI - 0.5 * Math.PI,
        false
      )
      ctx.stroke()
      // ctx.restore()
      // 绘制文字
      ctx.beginPath()
      ctx.setFillStyle(this.myForegroundColor)
      // ctx.setFontSize(12)
      const font_size = 12
      ctx.font = font_size + 'px Helvetica'
      // // 获取文字的宽度
      // const text_width = ctx.measureText(parseInt(this.progress)+'%').width
      // ctx.fillText(parseInt(this.progress)+'%',this.width / 2 - text_width / 2,this.height / 2 + font_size / 2)
      if (this.progress >= 99) {
        ctx.fillText(
          this.progress + '%',
          this.width / 2 - 13,
          this.height / 2 + 6
        )
      } else {
        ctx.fillText(
          this.progress + '%',
          this.width / 2 - 10,
          this.height / 2 + 6
        )
      }
      // 绘制
      ctx.draw()
      // 动画重绘
      // requestAnimationFrame(() => {
      //   // 清除之前的绘制
      //   ctx.clearRect(0, 0, this.width, this.height)
      //   // 计算进度
      //   if (this.speed < this.progress) {
      //     this.speed += 1
      //   }
      // })
    }
  }
}
</script>

<style scoped>
.mp-circle-container {
  position: relative;
}
.mp-circle {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}
</style>