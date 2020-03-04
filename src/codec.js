class Codec {
  constructor (encoder, decoder) {
    this._encoder = encoder
    this._decoder = decoder
  }

  encode (data) {
    return this._encoder(data)
  }

  decode (data) {
    return this._decoder(data)
  }
}

export { Codec }
