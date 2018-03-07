//daily.js
const log = require('../utils/log.js')
const util = require('../utils/util.js')

Page({
  data: {
    templates: [],
    expanded: {}
  },
  onLoad: function () {
    let self = this
    let cookie = wx.getStorageSync('koa:sess') + ';' + wx.getStorageSync('koa:sess.sig')
    wx.request({
      url: 'https://vitalog.cn/s/vlog/templates',
      header: {
        cookie
      },
      success: function (res) {
        log.info('t', util.toEntries(res.data))
        self.setData({
          templates: util.toEntries(res.data)
        })
      }
    })
  },
  toggle: function (event) {
    let val = this.data.expanded[event.currentTarget.dataset.id] || false
    this.data.expanded[event.currentTarget.dataset.id] = !val
    this.setData({
      expanded: this.data.expanded
    })
  },
  use: function (event) {
    let habits = event.currentTarget.dataset.habits
    let myhabits = wx.getStorageSync('habits')
    for (let h of habits) {
      if (!(h.id in myhabits)) {
        h.order = Object.keys(myhabits).length
        myhabits[h.id] = h
      }
    }
    getApp().save()
    wx.navigateBack()
  }
})
