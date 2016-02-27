# recastbot
[![Code-Style:Standard](https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square)](http://standardjs.com/)
[![License:MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](http://opensource.org/licenses/MIT)

`recastbot` helps you build applications that understand natural language using [Recast.AI's](https://recast.ai) *Natural Language Processing & Understanding API*.

## Features
#### Semantic Interface
Handle intents using expressive words such as `hears`, `fails`, `any`, and `otherwise` to make your code meaningful and readable.

#### Platform-agnostic
You can integrate `recastbot` anywhere. It does not make any assumptions about frameworks or platforms.

## Use cases

`recastbot` is useful for building conversational interfaces. Some examples include chatbots (e.g. Slack, Twitter bots, HipChat bots), virtual assistants, cross-platform conversational interfaces, and many more.

#### Quick Example: a *WeatherBot*
```js
import RecastBot from 'recastbot'
const ai = new RecastBot(API_TOKEN)

ai.process(textToProcess, userData, respondFn)
  .hears('weather', (res, userData, respondFn) => {
    if (res.sentences[0] && res.sentences[0].entities) {
      let entities = res.sentences[0].entities

      // defaults...
      let location = userData.location
      let datetime = 'today'

      // get entities from Recast.AI
      if (entities.location) location = entities.location[0].value
      if (entities.datetime) time = entities.datetime[0].value

      // get weather status as {string}
      let weather = getWeather(location, datetime)

      // send response to user
      respondFn('The weather in ' + location + ' ' + datetime + ' is ' + weather)
    } else {
      // ask user for time and place
      respondFn('Hi, ' + userData.firstName + '! Weather? where?')
    }
  })
  .hears('greetings', (res, userData, respondFn) => {
    respondFn('Hello, ' + userData.firstName + '!')
  })
  .otherwise((res, userData, respondFn) => {
    respondFn('Sorry, I didn\'t get that... ')
  })
  .fails((err) => {
    respondFn('Sorry, there was an error. Try again later.')
    console.error(err.message)
  })
```
> Input: `"How is the weather in San Juan today?"`

> Output: `"The weather in San Juan is cloudy, 77ºC, 79% humidity"`

## Requirements

To use `recastbot` you need to [sign up to Recast.AI](https://recast.ai/signup) and create a *Recast.AI app*. This allows you to make API requests from your application/bot.

This documentation assumes that you know how Recast.AI works. See the [Recast.AI docs](https://man.recast.ai) for more information.

**Note**: Recast.AI is currently (as of the writing of this document) in private beta. That means you won't have immediate access to the API; be patient.

## Installation

Installing `recastbot` is as simple as installing any other [npm](https://npmjs.com) module:

```shell
$ npm install recastbot --save
```

## Usage

#### Initialization

First, you need to initialize a new RecastBot instance with your `API_TOKEN` and store it somewhere (`ai` is a good name for it, but you can call it whatever you want):
```js
// ES6+
import RecastBot from 'recastbot'
const ai = new RecastBot(API_TOKEN)
```
```js
// or, in ES5
var RecastBot = require('recastbot')
var ai = new RecastBot(APITOKEN)
```
#### Process a string

When you have your RecastBot instance ready, you can process a string using the `.process()` method. This method should be called for each string you process.

`.process()` returns an object with several methods that allow you to register handlers for each intent, catch API errors, handle any event at once, and catch unhandled intents.

The first parameter is the string to be processed and the remaining arguments will be passed to the handlers you register for each intent.

```js
import RecastBot from 'recastbot'
const ai = new RecastBot(API_TOKEN)
// ...
let bot = ai.process(text, optArgument1, ...optArgumentN)
```

#### Register intent handlers

```js
bot.hears(intentName, handlerFn)
```

Use the `.hears()` method to register an intent handler. The first argument is the name of the intent and the second argument is the handler (a callback function). The handler function is called when the specified intent is matched.

One or more arguments are passed to the callback function: the first one is always the response from Recast.AI and the rest (if any) are the ones passed through `.process()`

Real-world Example:
```js
// ...
let bot = ai.process('Hi, RecastBot!', userData, respondFn)

bot.hears('greetings', (response, userData, respondFn) => {
  // handler function for 'greetings' intent
  respondFn('Hello, ' + userData.firstName + '!')
})
```

In the example above, we passed three arguments to `.process()`, the first one is used by the Recast.AI API and the last two are used in the handler function passed to `.hears()`:

1. `'Hi, RecastBot!'` {string} [required]: The text to be processed
2. `userData` {object} [arbitrary; optional]: The user's data (used in the handler function)
3. `respondFn` {function} [arbitrary; optional]: The function that will be used to respond back to the user (also used in the handler function)

#### Catch unhandled intents

```js
bot.otherwise(handlerFn)
```
When the intent does not match any handlers, the `.otherwise()` method is called. The `.otherwise()` method works the same way as `.hears()` but with a small difference: it takes only a handler (callback function). The handler function is called when no handler function was provided for that intent or when no intents were registered.

Real-world Example:
```js
// ...
let bot = ai.process('Open the pod bay doors.', userData, respondFn)

bot.hears('greetings', (response, userData, respondFn) => {
  respondFn('Hello, ' + userData.firstName + '!')
})

bot.otherwise((response, userData, respondFn) => {
  respondFn('I\'m sorry, ' + userData.firstname + ' I don\'t understand.')
})
```

#### Catching errors

```js
bot.fails(errorHandlerFn)
```

When an error with the Recast.AI API occurs, the method `.fails()` is called. The `.fails()` method takes a callback function as an argument. When an error occurs, it calls your defined callback function. It passes a `new Error()` object along with the additional methods passed through `.process()`.

Example:
```js
ai.process('Hi', userData, respondFn)
  .hears('greeting', greetingFn)
  .otherwise(otherwiseFn)
  .fails((err, userData, respondFn) => {
    console.error(err.message)
    respondFn('There is a problem with my brain. Please try again later.')
  })
```

#### Chaining

You can chain multiple methods to make your code look simpler and meaningful. This is useful because it allows you visualize how data flows through different handler functions.

```js
ai.process('Hi, RecastBot!', userData, respondFn)
  .hears('greetings', (response, userData, respondFn) => {
    respondFn('Hello, ' + userData.firstName + '!')
  })
  .otherwise((response, userData, respondFn) => {
    respondFn('Sorry,' + userData.firstname + ' I do not understand')
  })
  .fails((err, userData, respondFn) => {
    console.error(err.message)
    respondFn('There is a problem with my brain. Please try again later.')
  })
```

#### For the lazy

###### Register handlers in bulk
If you prefer an alternate way for registering handler functions for your intents in bulk, you can use the `.setHandlers()` method. This method takes an object containing the handler functions and registers each of them for you. Make sure your object's properties match your app's intent names.

```js
const myHandlers = {
  'greetings': (response, userData, respondFn) => {
    respondFn('Hello, ' + userData.firstName + '!')
  },
  'get status': (response, userData, respondFn) => {
    respondFn('I\'m feeling great :)')
  }
}

ai.process('How are you?', userData, respondFn)
  .setHandlers(myHandlers)
  .fails((err, userData, respondFn) => {
    respondFn('There is a problem with my brain. Please try again later.')
    console.error(err.message)
  })
```

## Contributing

#### Bug Reports & Feature Requests

Something does not work as expected or perhaps you think this module needs a feature? Please [open an issue](https://github.com/krismuniz/slash-command/issues/new) using GitHub's [issue tracker](https://github.com/krismuniz/slash-command/issues).

#### Developing

Pull Requests (PRs) are welcome. Make sure you follow the same basic stylistic conventions as the original code (i.e. ["JavaScript standard code style"](http://standardjs.com))

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

**Copyright (c) 2016 [Kristian Muñiz](https://www.krismuniz.com)**

## Acknowledgements
Inspired by Mike Brevoort's [`witbot`](https://github.com/BeepBoopHQ/witbot): an adaptation of [Wit](https://wit.ai) – a NLP service similar to [Recast.AI](https://recast.ai)

**I am not affiliated in any way to Recast.AI and this is not an official library.**
