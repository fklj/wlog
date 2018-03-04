//daily.js
const log = require('../utils/log.js')
const moment = require('../utils/moment.js')
const util = require('../utils/util.js')

Page({
  data: {
    habits: {},
    records: [],
    date: moment(Date.now()).endOf('day').unix() * 1000,
    title: '',
    left: '',
    right: ''
  },
  prevDate: function () {
    this.updateDate(this.data.date - 3600 * 24 * 1000)
  },
  nextDate: function () {
    this.updateDate(this.data.date + 3600 * 24 * 1000)
  },
  updateDate: function (date) {
    this.setData({date})
    this.loadData()
  },
  loadData: function () {
    const days = '日一二三四五六'
    let day = moment(this.data.date).day().valueOf()
    // log.info(this.data.date)
    this.setData({
      title: moment(this.data.date).format('YYYY年MM月DD日'),
      left: '周' + days[(day + 6 ) % 7],
      right: this.data.date > Date.now() ? '' : '周' + days[(day + 1 ) % 7]
    })
    let all = wx.getStorageSync('records')
    // log.info('all', all)
    let habits = wx.getStorageSync('habits')
    let startOfDate = moment(this.data.date).startOf('day')
    let endOfDate = moment(this.data.date).endOf('day')

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
    // wx.clearStorage()
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
  },
  headerTapLeft: function (event) {
    this.updateDate(this.data.date - 3600 * 24 * 1000)
  },
  headerTapRight: function (event) {
    this.updateDate(this.data.date + 3600 * 24 * 1000)
  },
  toggle: function (event) {
    log.info('toggle', event)
    let hid = event.target.dataset.hid
    let all = wx.getStorageSync('records') || {}
    let hrecords = all[hid] || {}
    let keys = Object.keys(hrecords).filter(k => k > this.data.date - 1000 * 3600 * 24 && k <= this.data.date)
    let key = (keys === []) ? this.data.date : keys[0]
    hrecords[key] = !(hrecords[key] || false)
    all[hid] = hrecords
    wx.setStorageSync('records', all)
    this.loadData()
  },
  nav: function (event) {
    log.info('redirect', event.currentTarget.dataset.dest)
    wx.redirectTo({
      url: event.currentTarget.dataset.dest
    })
  }
})
