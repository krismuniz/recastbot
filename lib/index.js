'use strict'
const processText = require('./api_request')

function RecastBot (api_token) {
  this.process = function (text) {
    const intents = new Processor()
    const args = Array.prototype.slice.call(arguments)
    let matched = false
    args.shift()

    processText(api_token, text)
      .then((res) => {
        if (res.results && res.results.intents && res.results.intents.length > 0) {
          args.unshift(res.results)
          let intentName = res.results.intents[0]

          if (intents._handlers[intentName]) {
            matched = true

            intents._handlers[intentName].forEach((handler) => {
              handler.apply(this, args)
            })
          } else if (intents._any) {
            matched = true
            intents._any.apply(this, args)
          }
        } else if (res.results.error || !res.results) {
          matched = true

          if (intents._error) {
            args.unshift(new Error(`[Recast.AI API]: ${res.message}`))
            intents._error.apply(this, args)
          } else {
            console.error(`[Recast.AI API]: ${res.message}`)
          }
        }

        if (!matched && intents._unhandled) {
          args.unshift(res.results)
          intents._unhandled.apply(this, args)
        }
      })
      .catch((err) => {
        args.unshift(err)

        if (intents._error) {
          intents._error.apply(this, args)
        } else {
          // If there is no error handling, log silently
          console.error(`[RecastBot]: ${err.message}`)
        }
      })

    return intents
  }
}

function Processor () {
  this._handlers = {}
  this._unhandled = null
  this._any = null
  this._error = null

  this.setHandlers = (handlers) => {
    for (let intentName in handlers) {
      if (handlers.hasOwnProperty(intentName)) {
        this.hears(intentName, handlers[intentName])
      }
    }

    return this
  }

  this.hears = (intentName, handlerFn) => {
    const handler = handlerFn

    if (!this._handlers[intentName]) {
      this._handlers[intentName] = [handler]
    } else {
      this._handlers[intentName].push(handler)
    }

    return this
  }

  this.otherwise = (handlerFn) => {
    this._unhandled = handlerFn
    return this
  }

  this.any = (handlerFn) => {
    this._any = handlerFn
    return this
  }

  this.fails = (handlerFn) => {
    this._error = handlerFn
    return this
  }
}

module.exports = function (api_token) {
  return new RecastBot(api_token)
}
