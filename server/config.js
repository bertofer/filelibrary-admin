'use strict'
let configObj
if (process.env.NODE_ENV === 'production') {
  configObj = require('./config/production')
}
else configObj = require('./config/localdev')

module.exports = configObj
