import { type IAsset } from ***REMOVED***@/Admin/types***REMOVED***
import tokens from ***REMOVED***@/jwt-tokens.json***REMOVED***
const endpoints = {
  stage: {
    url: ***REMOVED***https://stage-data-packages-postgrest.svx.axds.co/***REMOVED***,
    bearer: tokens.stage
  },
  local: {
    url: ***REMOVED***http://localhost:3005/***REMOVED***,
    bearer: tokens.local
  }
}

const version = ***REMOVED***local***REMOVED***

export const addSchema = async (data: JSON): Promise<{ message: string }> => {
  return await postRequest(***REMOVED***asset_schema***REMOVED***, data)
}

export const addAsset = async (data: JSON): Promise<{ message: string }> => {
  return await postRequest(***REMOVED***asset***REMOVED***, data)
}

export const postRequest = async (table: string, data: JSON): Promise<{ message: string }> => {
  const { url, bearer } = endpoints[version]
  const r = await (await fetch(`${url.replace(/\/$/, ***REMOVED******REMOVED***)}/${table.replace(/^\//, ***REMOVED******REMOVED***)}`, {
    headers: {
      Authorization: `Bearer ${bearer}`,
      ***REMOVED***Content-Type***REMOVED***: ***REMOVED***application/json***REMOVED***,
      Prefer: ***REMOVED***resolution=merge-duplicates***REMOVED***
    },
    body: JSON.stringify(data),
    method: ***REMOVED***POST***REMOVED***
  })).text()
  return { message: r }
}

export async function getRequest<T> (table: string, query?: string | string[]): Promise<T> {
  const { url } = endpoints[version]
  const r = await (await fetch(`${url.replace(/\/$/, ***REMOVED******REMOVED***)}/${table.replace(/^\//, ***REMOVED******REMOVED***)}${query !== undefined ? `?${Array.isArray(query) ? query.join(***REMOVED***&***REMOVED***) : query}` : ***REMOVED******REMOVED***}`, {
  })).json()
  return r as T
}

export async function getAssets (query?: string): Promise<IAsset[]> {
  const r = await getRequest<IAsset[]>(***REMOVED***asset***REMOVED***, query)
  return r
}

export async function getAsset (query?: string): Promise<IAsset> {
  const r = await getRequest<IAsset[]>(***REMOVED***asset***REMOVED***, query)
  return r[0]
}
