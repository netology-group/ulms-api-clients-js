/* eslint-disable camelcase */
import { Service } from './service.js'

class Event extends Service {
  /**
   * Events enum
   * @returns {{EVENT_CREATE: string, ROOM_ENTER: string, ROOM_LEAVE: string}}
   */
  static get events () {
    return {
      EVENT_CREATE: 'event.create',
      ROOM_ENTER: 'room.enter',
      ROOM_LEAVE: 'room.leave'
    }
  }

  /**
   * Create room
   * @param {String} audience
   * @param {[Number, Number]} time
   * @param {Object} tags
   * @returns {Promise}
   */
  createRoom (audience, time, tags) {
    const params = {
      audience,
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
   * List agents in room
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
   * Create event
   * @param room_id
   * @param {String} type
   * @param {Object|String|Number} data
   * @param {Object} eventParams
   * @returns {Promise}
   */
  createEvent (room_id, type, data, eventParams = {}) {
    const {
      is_claim,
      is_persistent,
      label,
      set
    } = eventParams
    const params = {
      data,
      is_claim,
      is_persistent,
      label,
      room_id,
      set,
      type
    }

    return this._rpc.send('event.create', params)
  }

  /**
   * List events
   * @param room_id
   * @param {Object} filterParams
   * @returns {Promise}
   */
  listEvent (room_id, filterParams = {}) {
    const {
      direction,
      label,
      last_occurred_at,
      limit,
      set,
      type
    } = filterParams
    const params = {
      direction,
      label,
      last_occurred_at,
      limit,
      room_id,
      set,
      type
    }

    return this._rpc.send('event.list', params)
  }

  /**
   * Read state
   * @param room_id
   * @param {String[]} sets
   * @param {Object} filterParams
   * @returns {Promise}
   */
  readState (room_id, sets, filterParams = {}) {
    const {
      limit,
      occurred_at
    } = filterParams
    const params = {
      limit,
      occurred_at,
      room_id,
      sets
    }

    return this._rpc.send('state.read', params)
  }
}

export { Event }
