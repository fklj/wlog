//daily.js
const log = require('../utils/log.js')
const moment = require('../utils/moment.js')
const util = require('../utils/util.js')

Page({
  data: {
    habits: {},
    records: []
  },
  loadData: function () {
    let all = wx.getStorageSync('records')
    log.info('all', all)
    let habits = wx.getStorageSync('habits')
    let startOfDate = moment().startOf('day')
    let endOfDate = moment().endOf('day')

    let result = {}
    for (let hid in habits) {
      let habitRecords = all[hid]
      let activeRecords = []
      for (let t in habitRecords) {
        if (t > startOfDate && t < endOfDate) {
          activeRecords.push({key:t, value:habitRecords[t]})
        }
      }
      let h = habits[hid]
      if ((h && !h.deleted) || Object.keys(activeRecords).length > 0) {
        result[hid] = activeRecords
      }
    }
    this.setData({
      habits,
      records: util.toEntries(result)
    })
    log.info('records', result)
  },
  onLoad: function () {
    this.loadData()
  },
  newRecord: function (event) {
    log.info('event', event)
    let hid = event.target.dataset.hid
    let all = wx.getStorageSync('records') || {}
    let key = Date.now()
    let hrecords = all[hid] || {}
    hrecords[key] = 0
    all[hid] = hrecords
    wx.setStorageSync('records', all)
    this.loadData()
  },
  delRecord: function (event) {
    log.info('event', event)
    let hid = event.target.dataset.hid
    let key = event.target.dataset.key
    let all = wx.getStorageSync('records') || {}
    delete all[hid][key]
    wx.setStorageSync('records', all)
    this.loadData()
  },
  changeRecord: function (event, delta) {
    let hid = event.target.dataset.hid
    let key = event.target.dataset.key
    let all = wx.getStorageSync('records') || {}
    all[hid][key] += delta
    wx.setStorageSync('records', all)
    this.loadData()
  },
  plus: function (event) {
    log.info('plus', event)
    this.changeRecord(event, 1);
  },
  minus: function (event) {
    log.info('plus', event)
    this.changeRecord(event, -1);
  }
})
