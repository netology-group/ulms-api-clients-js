/* eslint-disable camelcase */
import { Service } from './service.js'

class Conference extends Service {
  /**
   * Conference events enum
   * @returns {{ROOM_CLOSE: string, ROOM_ENTER: string, ROOM_LEAVE: string, ROOM_OPEN: string, RTC_STREAM_UPDATE: string}}
   */
  static get events () {
    return {
      ROOM_CLOSE: 'room.close',
      ROOM_ENTER: 'room.enter',
      ROOM_LEAVE: 'room.leave',
      ROOM_OPEN: 'room.open',
      RTC_STREAM_UPDATE: 'rtc_stream.update'
    }
  }

  /**
   * Conference intents enum
   * @returns {{INTENT_READ: string, INTENT_WRITE: string}}
   */
  static get intents () {
    return {
      INTENT_READ: 'read',
      INTENT_WRITE: 'write'
    }
  }

  /**
   * Create room
   * @param {String} audience
   * @param {[Number, Number]} time
   * @param {String} backend
   * @param {Number} reserve
   * @param {Object} tags
   * @returns {Promise}
   */
  createRoom (audience, time, backend, reserve, tags) {
    const params = {
      audience,
      backend,
      reserve,
      tags,
      time
    }

    return this._rpc.send('room.create', params)
  }

  /**
   * Read room
   * @param id
   * @returns {Promise}
   */
  readRoom (id) {
    const params = {
      id
    }

    return this._rpc.send('room.read', params)
  }

  /**
   * Update room
   * @param id
   * @param {String} audience
   * @param {[Number, Number]} time
   * @returns {Promise}
   */
  updateRoom (id, audience, time) {
    const params = {
      audience,
      id,
      time
    }

    return this._rpc.send('room.update', params)
  }

  /**
   * Delete room
   * @param id
   * @returns {Promise}
   */
  deleteRoom (id) {
    const params = {
      id
    }

    return this._rpc.send('room.delete', params)
  }

  /**
   * Enter room
   * @param id
   * @returns {Promise}
   */
  enterRoom (id) {
    const params = {
      id
    }

    return this._rpc.send('room.enter', params)
  }

  /**
   * Leave room
   * @param id
   * @returns {Promise}
   */
  leaveRoom (id) {
    const params = {
      id
    }

    return this._rpc.send('room.leave', params)
  }

  /**
   * List agent
   * @param room_id
   * @param {Object} filterParams
   * @returns {Promise}
   */
  listAgent (room_id, filterParams = {}) {
    const { limit, offset } = filterParams
    const params = {
      limit,
      offset,
      room_id
    }

    return this._rpc.send('agent.list', params)
  }

  /**
   * Create RTC
   * @param room_id
   * @returns {Promise}
   */
  createRtc (room_id) {
    const params = {
      room_id
    }

    return this._rpc.send('rtc.create', params)
  }

  /**
   * Read RTC
   * @param id
   * @returns {Promise}
   */
  readRtc (id) {
    const params = {
      id
    }

    return this._rpc.send('rtc.read', params)
  }

  /**
   * List RTC
   * @param room_id
   * @param {Object} filterParams
   * @returns {Promise}
   */
  listRtc (room_id, filterParams = {}) {
    const { limit, offset } = filterParams
    const params = {
      limit,
      offset,
      room_id
    }

    return this._rpc.send('rtc.list', params)
  }

  /**
   * Connect to RTC
   * @param {String} id
   * @param {String} handle_id
   * @param {Object} optionParams
   * @param {string} [intent=read] optionParams.intent - Intent to connect to RTC ('read' or 'write')
   * @param {string} [label] optionParams.label - An arbitrary label to mark the stream. Required only with intent = 'write'.
   * @returns {Promise}
   */
  connectRtc (id, handle_id, optionParams = {}) {
    const params = {
      handle_id,
      id
    }

    const { intent = Conference.intents.INTENT_READ, label } = optionParams

    if (intent) params.intent = intent
    if (label) params.label = label

    return this._rpc.send('rtc.connect', params)
  }

  /**
   * List RTC stream
   * @param room_id
   * @param {Object} filterParams
   * @returns {Promise}
   */
  listRtcStream (room_id, filterParams = {}) {
    const {
      limit,
      offset,
      rtc_id,
      time
    } = filterParams
    const params = {
      limit,
      offset,
      room_id,
      rtc_id,
      time
    }

    return this._rpc.send('rtc_stream.list', params)
  }

  /**
   * Create RTC signal
   * @deprecated
   * @param {String} handle_id
   * @param {Object} jsep
   * @param {String} label
   * @returns {Promise}
   */
  createRtcSignal (handle_id, jsep, label) {
    const params = {
      jsep,
      handle_id,
      label
    }

    return this._rpc.send('rtc_signal.create', params)
  }

  /**
   * Create signal
   * @param {String} room_id
   * @param {Object} jsep
   * @returns {Promise}
   */
  createSignal (room_id, jsep) {
    const params = {
      jsep,
      room_id
    }

    return this._rpc.send('signal.create', params)
  }

  /**
   * Create 'trickle' signal
   * @param {String} handle_id
   * @param {Object} jsep
   * @returns {Promise}
   */
  createTrickleSignal (handle_id, jsep) {
    const params = {
      handle_id,
      jsep
    }

    return this._rpc.send('signal.trickle', params)
  }

  /**
   * Update signal
   * @param {String} handle_id
   * @param {Object} jsep
   * @returns {Promise}
   */
  updateSignal (handle_id, jsep) {
    const params = {
      handle_id,
      jsep
    }

    return this._rpc.send('signal.update', params)
  }

  /**
   * Send broadcast message
   * @param room_id
   * @param {Object} data
   * @param {String} label
   * @returns {Promise}
   */
  sendBroadcastMessage (room_id, data, label) {
    const params = {
      data,
      label,
      room_id
    }

    return this._rpc.send('message.broadcast', params)
  }

  /**
   * Send unicast message
   * @param room_id
   * @param agent_id
   * @param {Object} data
   * @returns {Promise}
   */
  sendUnicastMessage (room_id, agent_id, data) {
    const params = {
      agent_id,
      data,
      room_id
    }

    return this._rpc.send('message.unicast', params)
  }
}

export { Conference }
