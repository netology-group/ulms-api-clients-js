import { v4 as uuid4 } from 'uuid'

class MQTTRPCService {
  constructor (mqttClient, topicIn, topicOut, codec, methods) {
    this._codec = codec
    this._handlerMap = {}
    this._incomingRequestMap = {}
    this._mqtt = mqttClient
    this._methods = methods
    this._requestStorage = {}
    this._topicIn = topicIn
    this._topicOut = topicOut

    this._addSubscription()
  }

  _addSubscription () {
    this._mqtt.attachRoute(this._topicIn, this._handleMessageEvent.bind(this))
    this._mqtt.subscribe(this._topicIn)
  }

  _removeSubscription () {
    this._mqtt.detachRoute(this._topicIn)
    this._mqtt.unsubscribe(this._topicIn)
  }

  _handleMessageEvent (topicParams, topic, message, packet) {
    const payload = this._codec.decode(message)
    const { properties } = packet
    const { correlationData, userProperties: { label, method, status, type } } = properties

    if (type === 'response' && correlationData) {
      if (Number(status) >= 200 && Number(status) < 300) {
        this._processResponse('resolve', correlationData, payload)
      } else {
        this._processResponse('reject', correlationData, payload)
      }
    } else if (type === 'request' && method && correlationData) {
      this._processIncomingRequest(properties, payload)
    } else if (type === 'event' && typeof label === 'string') {
      this._processNotification(label, payload)
    } else {
      // do nothing
    }
  }

  _processIncomingRequest (properties, payload) {
    const { correlationData, responseTopic, userProperties: { method } } = properties
    const handler = this._handlerMap[method]

    if (handler && !this._incomingRequestMap[correlationData]) {
      this._incomingRequestMap[correlationData] = true

      const result = handler(payload)
      const properties = {
        correlationData,
        userProperties: {
          local_timestamp: Date.now().toString(),
          status: '200',
          type: 'response'
        }
      }

      this._mqtt.publish(responseTopic, this._codec.encode(result), { properties })
    }
  }

  _processRequest (method, params) {
    const id = uuid4()
    const properties = {
      correlationData: id,
      responseTopic: this._topicIn,
      userProperties: {
        local_timestamp: Date.now().toString(),
        method,
        type: 'request'
      }
    }

    const payload = this._codec.encode(params)

    this._mqtt.publish(this._topicOut, payload, { properties }, (error) => {
      if (error) {
        this._processResponse('reject', id, error)
      }
    })

    return new Promise((resolve, reject) => {
      this._requestStorage[id] = {
        payload,
        resolve,
        reject
      }
    })
  }

  _processResponse (action, id, response) {
    const request = this._requestStorage[id]

    if (request) {
      if (action === 'resolve') {
        request.resolve(response)
      } else {
        request.reject(response)
      }

      delete this._requestStorage[id]
    } else {
      // do nothing
    }
  }

  _processNotification (method, params) {
    const methodHandler = this._methods[method]

    if (methodHandler && typeof methodHandler === 'function') {
      methodHandler(params)
    }
  }

  send (method, params) {
    return this._processRequest(method, params)
  }

  register (method, handler) {
    if (!this._handlerMap[method]) {
      this._handlerMap[method] = handler
    } else {
      throw new Error(`Method ${method} is already registered`)
    }
  }

  unregister (method) {
    if (this._handlerMap[method]) {
      delete this._handlerMap[method]
    } else {
      throw new Error(`Method ${method} was not registered`)
    }
  }

  destroy () {
    this._removeSubscription()

    this._handlerMap = {}
    this._incomingRequestMap = {}
    this._requestStorage = {}
  }
}

export { MQTTRPCService }