const log = require('./utils/log.js')

//app.js
App({
  saveSession: function(res) {
    let cookies = res.header['Set-Cookie']
    for (let cookie of cookies.split(',')) {
      for (let val of cookie.split(';')) {
        if (val.includes('koa:sess.sig')) {
          wx.setStorageSync('koa:sess.sig', val)
        } else if (val.includes('koa:sess')) {
          wx.setStorageSync('koa:sess', val)
        }
      }
    }
    // if (!wx.getStorageSync('habits')) {
      this.syncFromServer()
    // }
  },
  login: function() {
    let app = this
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: 'https://vitalog.cn/s/wx',
            data: { 'code': res.code  },
            method: 'POST',
            success: function (res) {
              app.saveSession(res)
            }
          })
        }
      },
      fail: res => {
        log.error('login fail', res)
      }
    })
  },
  onLaunch: function () {
    this.login()
  },
  syncToServer: function () {
    let cookie = wx.getStorageSync('koa:sess') + ';' + wx.getStorageSync('koa:sess.sig')
    this.data.updatedTime = Date.now()
    wx.request({
      url: 'https://vitalog.cn/s/vlog/data/0',
      method: 'POST',
      data: this.data,
      header: {
        cookie
      },
      success: function (res) {
        log.info('synced to server')
      }
    })
  },
  syncFromServer: function () {
    let app = this
    let cookie = wx.getStorageSync('koa:sess') + ';' + wx.getStorageSync('koa:sess.sig')
    wx.request({
      url: 'https://vitalog.cn/s/vlog/data/0',
      header: {
        cookie
      },
      success: function (res) {
        if (res.data) {
          app.data.habits = res.data.habits
          app.data.records = res.data.records
          wx.setStorageSync('habits', res.data.habits)
          wx.setStorageSync('records', res.data.records)
          for (let cb of app.callbacks) {
            cb()
          }
          wx.showToast({
            title: '同步数据完成',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  onHide: function () {
    this.syncToServer()
  },
  addCallback: function (cb) {
    this.callbacks.push(cb)
  },
  callbacks: [],
  data: {
    habits: wx.getStorageSync('habits') || {},
    records: wx.getStorageSync('records') || {}
  }
})