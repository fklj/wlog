//daily.js
const log = require('../utils/log.js')
const util = require('../utils/util.js')

Page({
  data: {
    templates: [],
    expanded: {},
    uid: 0
  },
  refresh: function () {
    let self = this
    let cookie = wx.getStorageSync('koa:sess') + ';' + wx.getStorageSync('koa:sess.sig')
    wx.request({
      url: 'https://vitalog.cn/s/vlog/templates',
      header: {
        cookie
      },
      success: function (res) {
        self.setData({
          templates: util.toEntries(res.data),
          uid: getApp().data.uid
        })
      }
    })
  },
  onLoad: function () {
   this.refresh()
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
    let myhabits = getApp().data.habits
    for (let h of habits) {
      if (!(h.id in myhabits) || myhabits[h.id].deleted) {
        h.order = Object.keys(myhabits).length
        myhabits[h.id] = h
      }
    }
    getApp().save()
    wx.navigateBack()
  },
  del: function (event) {
    let self = this
    let id = event.currentTarget.dataset.id
    let cookie = wx.getStorageSync('koa:sess') + ';' + wx.getStorageSync('koa:sess.sig')
    wx.request({
      url: `https://vitalog.cn/s/vlog/templates/${id}`,
      method: 'DELETE',
      header: {
        cookie
      },
      success: function (res) {
        log.info('t')
        self.refresh()
      }
    })
  }
})
