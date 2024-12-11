import { decode, encode } from ***REMOVED***cbor-x***REMOVED***

export function jsonToBase64<T = JSON> (json: T): string {
  const buffer = encode(json)
  // https://github.com/hildjj/cbor2/blob/ef0e9f710a2a1c1be7c6c8c3b3665998b51921bc/web/src/encode.js#L15
  const binString = Array.from(buffer, byte => String.fromCodePoint(byte)).join(***REMOVED******REMOVED***)
  return btoa(binString)
}

export function base64ToJson<T = JSON> (base64: string): T {
  const decodedBinString = atob(base64)
  const decodedBuffer = new Uint8Array(decodedBinString.split(***REMOVED******REMOVED***).map(char => char.codePointAt(0) as number))
  return decode(decodedBuffer) as T
}
