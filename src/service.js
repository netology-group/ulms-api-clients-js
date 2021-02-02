import EventEmitter from 'events'

import { Codec } from './codec.js'
import { MQTTRPCService } from './mqtt-rpc.js'

class Service {
  constructor (mqttClient, agentId, appName, appVersion = 'v1') {
    this._agentId = agentId
    this._appName = appName
    this._appVersion = appVersion
    this._topicIn = `agents/${this._agentId}/api/${this._appVersion}/in/${this._appName}`
    this._topicOut = `agents/${this._agentId}/api/${this._appVersion}/out/${this._appName}`
    this._topicPatternNotifications = `apps/${this._appName}/api/${this._appVersion}/rooms/+roomId/events`
    this._mqtt = mqttClient

    this._codec = new Codec(
      (data) => JSON.stringify(data),
      (data) => {
        let payload

        try {
          payload = JSON.parse(data.toString())
        } catch (error) {
          payload = {}
        }

        return payload
      }
    )
    this._ee = new EventEmitter()
    this._rpc = new MQTTRPCService(
      this._mqtt,
      this._topicIn,
      this._topicOut,
      this._codec,
      {}
    )

    this._mqtt.attachRoute(this._topicPatternNotifications, this._subMessageHandler.bind(this))
  }

  register (...args) {
    this._rpc.register(...args)
  }

  unregister (...args) {
    this._rpc.unregister(...args)
  }

  on (eventName, eventHandler) {
    this._ee.addListener(eventName, eventHandler)
  }

  off (eventName, eventHandler) {
    this._ee.removeListener(eventName, eventHandler)
  }

  setLabels (labels) {
    this._rpc.setLabels(labels)
  }

  clearLabels () {
    this._rpc.clearLabels()
  }

  _subMessageHandler (topicParams, topic, message, packet) {
    const payload = this._codec.decode(message)
    const { properties } = packet
    const { userProperties: { label, type } } = properties
    let event = null

    if (type === 'event' && payload !== undefined) {
      event = {
        type: label,
        data: payload
      }

      this._ee.emit(event.type, event)
    } else {
      // do nothing
    }
  }

  destroy () {
    this._mqtt.detachRoute(this._topicPatternNotifications)
    this._ee.removeAllListeners()
    this._rpc.destroy()
  }
}

export { Service }
