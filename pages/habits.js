//daily.js
const log = require('../utils/log.js')

Page({
  data: {
    habits: []
  },
  onLoad: function () {
    let habits = Object.values(wx.getStorageSync('habits')) || []
    habits = habits.filter(h => !h.deleted)
    this.setData({
      habits
    })
    log.info('habits', habits)
  },
  nav: function (event) {
    log.info('redirect', event.currentTarget.dataset.dest)
    wx.redirectTo({
      url: event.currentTarget.dataset.dest
    })
  }
})
