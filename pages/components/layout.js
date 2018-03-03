const log = require('../../utils/log.js')

Component({
  properties: {
    title: {
      type: String,
      value: 'default title',
    },
    page: {
      type: String,
      value: '',
    }
  },
  data: {
  },
  methods: {
    nav: function (event) {
      log.info('redirect', event.target.dataset.dest)
      wx.redirectTo({
        url: event.target.dataset.dest
      })
    }
  },

})