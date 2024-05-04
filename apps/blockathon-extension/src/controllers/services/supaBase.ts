import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database

const SUPABASE_URL = 'https://ubzlvapjnyprfbxiwcta.supabase.co'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViemx2YXBqbnlwcmZieGl3Y3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4MDE1MDksImV4cCI6MjAzMDM3NzUwOX0.7pt_6Culzy9JhZFJqpktWYXLz70D1Xs3v5zUtzwF9jw'

const supabase = createClient(SUPABASE_URL, ANON_KEY)

export const createRewardAddress = async (address:string) => {
  try {
    const { data, error } = await supabase
      .from('reward')
      .insert([
        { address, point: null }
      ])
      .select()
  } catch (e) {
    console.log('err', e)
    return null
  }
}

export const updateRewardPoint = async ({ address, point } : {address: string, point: number}) => {
  try {
    const { data: currentItem } = await supabase.from('reward').select().eq('address', address)

    console.log('currentAddress', currentItem)

    const { data, error } = await supabase
      .from('reward')
      .update({ point: currentItem[0].point + point })
      .eq('address', address)
      .select()
    console.log('data', data)
  } catch (e) {
    console.log('err', e)
    return null
  }
}

export const fetchRewardData = async () => {
  try {
    const { data: reward, error } = await supabase
      .from('reward')
      .select()
    if (reward) {
      console.log('data', reward)
      return reward
    }
  } catch (e) {
    console.log('err', e)
    return null
  }
}

export default supabase
