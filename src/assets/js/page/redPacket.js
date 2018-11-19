/**
 * Created by ChengZheLin on 2018/11/15.
 * Features: redPacket
 */

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(root)
    })
  } else if (typeof exports === 'object') {
    module.exports = factory
  } else {
    root.RedPacket = factory(root)
  }
})(this, function (root) {
  'use strict'

  function randomNumber (min, max) {
    var ran = Math.random() * (max - min + 1) + min
    return parseFloat(ran.toFixed(2))
  }

  function RedPacket (ele, opt) {
    if (!ele) { return console.error('未指定舞台。') }
    this.ele = /^#/.test(ele) ?
      document.getElementById(ele.replace(/#/, '')) :
      document.getElementsByClassName(ele.replace(/\./, ''))[0]

    if (!this.ele) { return console.error('未找到元素。') }

    this.opt = opt || {}

    // 创建新的盒子
    var newEle = document.createElement('div')
    newEle.className = 'red-packet'
    newEle.style.width = '100%'
    newEle.style.height = '100%'
    // newEle.style.position = 'relative'
    this.ele.appendChild(newEle);
    this.ele = newEle

    // 存放当前红包位置
    this._RED_PACKET_BOX = []
    // 存放定时器
    this._TIME = null
  }

  RedPacket.prototype = {
    createElement: function () {
      var ele = document.createElement('div')
      ele.className = 'red-pack-item ' + this.opt.addClass
      return ele
    },

    itemAppend: function(item) {
      var ele = item.ele

      ele.style.left = item.x + 'px'
      ele.style.top = item.y + 'px'

      this.ele.appendChild(ele);
    },

    generateRedPack: function (val, cb) {
      // 获取基本信息
      this.boxInfo = {
        width: this.ele.offsetWidth,
        height: this.ele.offsetHeight
      }

      // 设置单元格
      var density = val || this.opt.density || 100

      // 设置速度
      var speed = this.opt.speed || 4

      // 循环长度
      var len = this.boxInfo.width / density

      for (var i = 0; i < len; i++) {
        var item = {
          ele: this.createElement(),
          x: randomNumber(i * density, (i+1) * density),
          y: randomNumber(-density, 0),
          speed: randomNumber(speed - 0.2, speed + 0.2)
        }

        this.itemAppend(item)
        this._RED_PACKET_BOX.push(item)
      }

      // 保存红包长度
      this.renPackLen = this._RED_PACKET_BOX.length

      if (typeof cb === 'function') cb()
    },

    // 红包长度
    renPackLen: 0,
    movePos: 0,
    isRedPack: false,
    // 移动红包
    move: function () {
      var that = this
      this._TIME = setInterval(function () {
        var len = that.renPackLen
        that.movePos += that.opt.speed
        that.isRedPack = true
        for (var i = 0; i < len; i++) {
          var item = that._RED_PACKET_BOX[i]
          var speed = item.speed
          var ele = item.ele

          item.x = item.x - (speed / 6)
          item.y = item.y + speed

          ele.style.left = item.x + 'px'
          ele.style.top = item.y + 'px'

          if (item.y >= that.boxInfo.height) {
            ele.parentNode.removeChild(ele);
            that._RED_PACKET_BOX.splice(i, 1)
            that.renPackLen--
            i--
            len--
          }
        }

        if (that.movePos >= that.opt.density) {
          that.generateRedPack()
          that.movePos = 0
        }

      }, 1000 / 60)
    },

    // 启动
    start: function (cb) {
      var that = this
      if (!this.isStop) {
        this.destroy()
        this.ele.style.display = 'block';
        this.generateRedPack(null, function () {
          that.move()
        })
      } else {
        this.isStop = false
        this.move()
      }

      if (typeof cb === 'function') { cb() }
    },

    // 停止定时器
    isStop: false,
    stop: function () {
      clearInterval(this._TIME)
      this._TIME = null
      this.isStop = true
    },

    // 销毁所有
    destroy: function () {
      clearInterval(this._TIME)
      this._TIME = null
      this.isStop = true
      this._RED_PACKET_BOX = []
      this.ele.innerHTML = ''
      this.movePos = 0
      this.renPackLen = 0
      this.ele.style.display = 'none';
      this.isStop = false
      this.isRedPack = false
    }
  }

  return RedPacket
});
