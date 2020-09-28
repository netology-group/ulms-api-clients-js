export class MQTTRPCServiceError extends Error {
  constructor (params) {
    super(params)

    this.name = 'MQTTRPCServiceError'
  }
}

export class TimeoutError extends Error {
  constructor (params) {
    super(params)

    this.name = 'TimeoutError'
  }
}
