const log = require('../../utils/log.js')

Component({
  properties: {
    record: {
      type: String,
      value: 0,
    },
    habit: {
      type: Object,
      value: null,
    }
  },
  data: {
  },
  methods: {
    plus: function () {
      this.triggerEvent('plus')
    },
    minus: function () {
      this.triggerEvent('minus')
    }
  },

})