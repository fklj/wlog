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
    let self = this
    wx.getUserInfo({
      success: function (res) {
        let nickName = JSON.parse(res.rawData).nickName
        wx.showModal({
          title: `确认发布 ${nickName}的日程`,
          content: `发布后所有人都可以应用你的日程模板，但是不会看到你的活动记录`,
          success: function () {
            self.doPublish(self, `${nickName}的日程`)
          }
        })
      }
    })
  },
  doPublish: function (self, name) {
    let habits = {}
    for (let hid in getApp().data.habits) {
      let habit = getApp().data.habits[hid]
      if (!habit.deleted) {
        habits[habit.id] = habit
      }
    }
    wx.request({
      url: 'https://vitalog.cn/s/vlog/templates',
      method: 'POST',
      data: {
        name,
        habits
      },
      header: {
        cookie: wx.getStorageSync('koa:sess') + ';' + wx.getStorageSync('koa:sess.sig')
      },
      success: function (res) {
        log.info('published')
        wx.showToast({
          title: '发布完成',
          icon: 'success',
          duration: 1000
        })
      }
    })

  }
})
