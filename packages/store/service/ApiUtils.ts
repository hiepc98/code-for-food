import { BaseAdapter } from './BaseAPI'

export {}

export async function postRecord (params: any) {
  // eslint-disable-next-line no-useless-catch
  try {
    const res = BaseAdapter.post('record/log', params)
    return res
  } catch (e) {
    throw e
  }
}
