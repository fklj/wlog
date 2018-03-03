const log = require('../../utils/log.js')

Component({
  properties: {
    left: {
      type: String,
      value: '',
    },
    right: {
      type: String,
      value: '',
    },
    allowLeft: {
      type: Boolean,
      value: true,
    },
    allowRight: {
      type: Boolean,
      value: true
    }
  },
  data: {
  },
  methods: {
    tapLeft: function () {
      this.triggerEvent('tapLeft')
    },
    tapRight: function () {
      this.triggerEvent('tapRight')
    }
  },

})