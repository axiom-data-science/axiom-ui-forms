import { type IValueType, type IFormValues } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
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

export function updateUrlParam (param: string, value?: string | boolean | number | null): void {
  const u = new URL(window.location.href)
  if (value === null || value === undefined) {
    u.searchParams.delete(param)
  } else {
    u.searchParams.set(param, String(value))
  }
  window.history.replaceState({}, ***REMOVED******REMOVED***, u.toString())
}

export function getQueryParam (param: string): string | null {
  const u = new URL(window.location.href)
  return u.searchParams.get(param)
}

export function typeToFormValues (m: any = {}): IFormValues {
  return Object.fromEntries(Object.keys(m).map(k => {
    return [String(k), m[k] as IValueType]
  }))
}
