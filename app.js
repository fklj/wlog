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
    this.syncFromServer()
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
              let cookie = wx.getStorageSync('koa:sess') + ';' + wx.getStorageSync('koa:sess.sig')
              wx.request({
                url: 'https://vitalog.cn/s/status',
                header: {
                  cookie
                },
                success: function (res) {
                  app.data.uid = res.data.uid
                  log.info('uid=', app.data.uid)
                }
              })
            }
          })
        }
      },
      fail: res => {
        log.error('login fail', res)
      }
    })
  },
  organizeHabits: function () {
    let habits = this.data.habits
    let keys = Object.keys(habits)
    keys.sort((a,b) => habits[a].order - habits[b].order)
    let idx = 0
    keys.forEach(key => {
      habits[key].order = idx ++
    })
  },
  onLaunch: function () {
    this.login()
    this.organizeHabits()
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
        log.info('remote updated time:', new Date(res.data.updatedTime))
        if (res.data && res.data.updatedTime > app.data.updatedTime) {
          log.info('update local data')
          app.data.habits = res.data.habits
          app.data.records = res.data.records
          app.save()
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
    records: wx.getStorageSync('records') || {},
    updatedTime: wx.getStorageSync('updatedTime') || 0
  },
  save: function () {
    this.data.updatedTime = Date.now()
    wx.setStorageSync('habits', this.data.habits)
    wx.setStorageSync('records', this.data.records)
    wx.setStorageSync('updatedTime', this.data.updatedTime)
  }
})