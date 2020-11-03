Component({
  properties: {
    score: {
      type: Number,
      value: 10,
      observer: function(val) {
        this.drawCircle(val)
      }
    },
    color: {
      type: String,
      value: '#1FBBBC'
    }
  },

  data: {
  },

  methods: {
    rpx2px(rpx) {
      const info = wx.getSystemInfoSync()
      return rpx * info.windowWidth / 750
    },

    drawProgressbg() {
      // 使用 wx.createContext 获取绘图上下文 context
      var ctx = wx.createCanvasContext('canvasProgressbg', this)
      ctx.setLineWidth(this.rpx2px(10))// 设置圆环的宽度
      ctx.setStrokeStyle('#F0F0F0') // 设置圆环的颜色
      ctx.setLineCap('round') // 设置圆环端点的形状
      ctx.beginPath()//开始一个新的路径
      ctx.arc(this.rpx2px(80), this.rpx2px(80), this.rpx2px(70), 0, 2 * Math.PI, false)
      //设置一个原点(110,110)，半径为100的圆的路径到当前路径
      ctx.stroke()//对当前路径进行描边
      ctx.draw()
    },

    drawCircle(score) {
      var context = wx.createCanvasContext('canvasProgress', this)
        
      context.setLineWidth(this.rpx2px(10))
      context.setStrokeStyle(this.data.color)
      context.setLineCap('round')
      context.beginPath()
      // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
      context.arc(this.rpx2px(80), this.rpx2px(80), this.rpx2px(70), -Math.PI / 2, score / 50 * Math.PI - Math.PI / 2, false)
      context.stroke()
      context.draw()
    },
  },
  
  attached() {
    // 第二种方式通过组件的生命周期函数执行代码
    this.drawProgressbg()
    this.drawCircle(this.data.score) 
  }
})