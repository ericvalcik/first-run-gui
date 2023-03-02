import { NodeResponse } from '@/service/types'
import axios from 'axios'

const API_URL = 'http://localhost:28945'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const SXApiService = {
  search: async () => {
    await axios.get(`${API_URL}/search`)
  },
  // Returns all handles
  node: async (): Promise<NodeResponse> => {
    const response = await axios.get(`${API_URL}/node`)
    return {
      handle: response.data.handle as string,
      name: response.data.ident.name as string
    }
  },
  getVarValue: async (handle: string, path: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/get?handle=${handle}&path=${path}`)
    return response.data.value
  },
  setVarValue: async (handle: string, path: string, value: any) => {
    await axios.get(`${API_URL}/set?handle=${handle}&path=${path}&value=${value}`)
  },
  run: async (handle: string, speed: number) => {
    await axios.get(`${API_URL}/exec?handle=${handle}&path=run&arg1=${speed}`)
  },
  exec: async (
    handle: string,
    command: string,
    arg1: string | undefined = undefined,
    arg2: string | undefined = undefined
  ) => {
    let url = `${API_URL}/exec?handle=${handle}&path=${command}`
    if (arg1) {
      url += `&arg1=${arg1}`
    }
    if (arg2) {
      url += `&arg2=${arg2}`
    }
    await axios.get(url)
  },
  reboot: async (handle: string): Promise<NodeResponse> => {
    await axios.get(`${API_URL}/exec?handle=${handle}&path=reboot&timeout=1000`)
    await sleep(15000)
    await SXApiService.search()
    return SXApiService.node()
  }
}
