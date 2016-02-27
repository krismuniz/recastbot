'use strict'
const request = require('request')

module.exports = function (api_token, text) {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'POST',
      url: 'https://api.recast.ai/request?text=' + encodeURI(text),
      headers: {
        'Authorization': 'Token ' + api_token.trim()
      }
    }

    request(options, (err, res, body) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}
