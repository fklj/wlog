//daily.js
const log = require('../utils/log.js')

Page({
  data: {
    habits: []
  },
  refresh: function () {
    log.info('refresh habits')
    let habits = Object.values(getApp().data.habits)
    habits = habits.filter(h => !h.deleted)
    this.setData({
      habits
    })
  },
  onLoad: function () {
    getApp().addCallback(this.refresh)
  },
  onShow: function () {
    this.refresh()
  },
  nav: function (event) {
    log.info('navigateTo', event.currentTarget.dataset.dest)
    wx.navigateTo({
      url: event.currentTarget.dataset.dest
    })
  },
  publish: function (event) {
    wx.showModal({
      title: 'test',
      content: 'cc',
    })
  }
})
