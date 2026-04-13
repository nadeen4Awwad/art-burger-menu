import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

/**
 * Get public URL for a file in Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within the bucket
 * @returns {string} Public URL
 */
export function getStorageUrl(bucket, path) {
  if (!supabase || !path) return ''
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl || ''
}

/**
 * Upload a file to Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Desired file path
 * @param {File} file - File object to upload
 * @returns {Promise<{url: string, error: any}>}
 */
export async function uploadFile(bucket, path, file) {
  if (!supabase) return { url: '', error: 'Supabase not configured' }
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: true,
    })

  if (error) return { url: '', error }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return { url: urlData?.publicUrl || '', error: null }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket
 * @param {string} path
 */
export async function deleteFile(bucket, path) {
  if (!supabase || !path) return
  const cleanPath = path.includes('/storage/v1/object/public/')
    ? path.split('/storage/v1/object/public/' + bucket + '/')[1]
    : path
  if (cleanPath) {
    await supabase.storage.from(bucket).remove([cleanPath])
  }
}
