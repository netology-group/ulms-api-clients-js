/* eslint-disable camelcase */
import { Codec } from './codec.js'

class Telemetry {
  constructor (mqttClient, agentId, appName, appVersion = 'v1') {
    this._agentId = agentId
    this._appName = appName
    this._appVersion = appVersion
    this._labels = {}
    this._publishQoS = 1
    this._topicOut = `agents/${this._agentId}/api/${this._appVersion}/out/${this._appName}`
    this._mqtt = mqttClient

    this._codec = new Codec(
      (data) => JSON.stringify(data),
      _ => _
    )
  }

  send (params) {
    if (!this._mqtt.connected) {
      return
    }

    const properties = {
      userProperties: {
        label: 'metric.create',
        local_timestamp: Date.now().toString(),
        type: 'event',
        ...this._labels
      }
    }

    this._mqtt.publish(this._topicOut, this._codec.encode(params), { properties, qos: this._publishQoS })
  }

  setLabels (labels) {
    const {
      app_audience,
      app_label,
      app_version,
      scope
    } = labels

    this._labels = {
      ...(app_audience !== undefined && { app_audience }),
      ...(app_label !== undefined && { app_label }),
      ...(app_version !== undefined && { app_version }),
      ...(scope !== undefined && { scope })
    }
  }

  clearLabels () {
    this._labels = {}
  }

  destroy () {
    this.clearLabels()
  }
}

export { Telemetry }
