'use strict'
const request = require('request')

module.exports = function (api_token, text) {
  return new Promise((resolve, reject) => {
    let params = {
      method: 'POST',
      url: `https://api.recast.ai/v1/request?text=${encodeURI(text)}`,
      headers: {
        'Authorization': `Token ${api_token.trim()}`
      }
    }

    request(params, (err, res, body) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}
