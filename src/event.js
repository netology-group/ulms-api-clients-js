/* eslint-disable camelcase */
import { Service } from './service.js'

class Event extends Service {
  /**
   * Change type enum
   * @returns {{ADDITION: string, MODIFICATION: string, REMOVAL: string}}
   */
  static get changeTypes () {
    return {
      ADDITION: 'addition',
      MODIFICATION: 'modification',
      REMOVAL: 'removal'
    }
  }

  /**
   * Events enum
   * @returns {{AGENT_UPDATE: string, EVENT_CREATE: string, ROOM_ENTER: string, ROOM_LEAVE: string}}
   */
  static get events () {
    return {
      AGENT_UPDATE: 'agent.update',
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
   * Update room
   * @param id
   * @param {Object} updateParams
   * @returns {Promise}
   */
  updateRoom (id, updateParams) {
    const { tags, time } = updateParams
    const params = {
      id,
      tags,
      time
    }

    return this._rpc.send('room.update', params)
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
   * Update agent in room (currently only ban or un-ban)
   * @param room_id
   * @param account_id
   * @param {Boolean} value
   * @returns {Promise}
   */
  updateAgent (room_id, account_id, value) {
    const params = {
      account_id,
      room_id,
      value
    }

    return this._rpc.send('agent.update', params)
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
      occurred_at,
      original_occurred_at
    } = filterParams
    const params = {
      limit,
      occurred_at,
      original_occurred_at,
      room_id,
      sets
    }

    return this._rpc.send('state.read', params)
  }

  /**
   * Create edition
   * @param room_id
   * @returns {Promise}
   */
  createEdition (room_id) {
    const params = {
      room_id
    }

    return this._rpc.send('edition.create', params)
  }

  /**
   * List editions
   * @param room_id
   * @param {Object} filterParams
   * @returns {Promise}
   */
  listEdition (room_id, filterParams = {}) {
    const { last_created_at, limit } = filterParams
    const params = {
      last_created_at,
      limit,
      room_id
    }

    return this._rpc.send('edition.list', params)
  }

  /**
   * Delete edition
   * @param id
   * @returns {Promise}
   */
  deleteEdition (id) {
    const params = {
      id
    }

    return this._rpc.send('edition.delete', params)
  }

  /**
   * Commit edition
   * @param id
   * @returns {Promise}
   */
  commitEdition (id) {
    const params = {
      id
    }

    return this._rpc.send('edition.commit', params)
  }

  /**
   * Create change
   * @param edition_id
   * @param type
   * @param event
   * @returns {Promise}
   */
  createChange (edition_id, type, event) {
    const params = {
      edition_id,
      event,
      type
    }

    return this._rpc.send('change.create', params)
  }

  /**
   * List changes
   * @param id
   * @param {Object} filterParams
   * @returns {Promise}
   */
  listChange (id, filterParams = {}) {
    const { last_created_at, limit } = filterParams
    const params = {
      id,
      last_created_at,
      limit
    }

    return this._rpc.send('change.list', params)
  }

  /**
   * Delete change
   * @param id
   * @returns {Promise}
   */
  deleteChange (id) {
    const params = {
      id
    }

    return this._rpc.send('change.delete', params)
  }
}

export { Event }
