import { type IAsset } from '@/Admin/types'
import tokens from '@/jwt-tokens.json'
const endpoints = {
  stage: {
    url: 'https://stage-data-packages-postgrest.svx.axds.co/',
    bearer: tokens.stage
  },
  local: {
    url: 'http://localhost:3005/',
    bearer: tokens.local
  }
}

const version = 'local'

export const addSchema = async (data: JSON): Promise<{ message: string }> => {
  return await postRequest('asset_schema', data)
}

export const addAsset = async (data: JSON): Promise<{ message: string }> => {
  return await postRequest('asset', data)
}

export const postRequest = async (table: string, data: JSON): Promise<{ message: string }> => {
  const { url, bearer } = endpoints[version]
  const r = await (await fetch(`${url.replace(/\/$/, '')}/${table.replace(/^\//, '')}`, {
    headers: {
      Authorization: `Bearer ${bearer}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify(data),
    method: 'POST'
  })).text()
  return { message: r }
}

export async function getRequest<T> (table: string, query?: string | string[]): Promise<T> {
  const { url } = endpoints[version]
  const r = await (await fetch(`${url.replace(/\/$/, '')}/${table.replace(/^\//, '')}${query !== undefined ? `?${Array.isArray(query) ? query.join('&') : query}` : ''}`, {
  })).json()
  return r as T
}

export async function getAssets (query?: string): Promise<IAsset[]> {
  const r = await getRequest<IAsset[]>('asset', query)
  return r
}

export async function getAsset (query?: string): Promise<IAsset> {
  const r = await getRequest<IAsset[]>('asset', query)
  return r[0]
}
