/**
 * 图片上传端点（R2）
 * 约束：最多 5 张，单张 <= 3MB，仅 image/*
 */
import { Hono } from 'hono'
import type { AppContext } from '../../types/env'
import { ModuleError, ERROR_CODES } from '../../../../shared/types/errors'

const uploadRoute = new Hono<AppContext>()

uploadRoute.post('/', async (c) => {
  try {
    const contentType = c.req.header('Content-Type') || ''
    if (!contentType.startsWith('multipart/form-data')) {
      throw new ModuleError('Invalid content type', ERROR_CODES.VALIDATION_ERROR, 400)
    }

    const formData = await c.req.formData()
    const files = formData.getAll('files')
    if (!files || files.length === 0) {
      throw new ModuleError('No files provided', ERROR_CODES.VALIDATION_ERROR, 400)
    }
    if (files.length > 5) {
      throw new ModuleError('Too many files (max 5)', ERROR_CODES.VALIDATION_ERROR, 400)
    }

    const keys: string[] = []
    const nowPrefix = Date.now()
    for (let i = 0; i < files.length; i++) {
      const file: any = files[i]
      if (!file || typeof file.arrayBuffer !== 'function') {
        throw new ModuleError('Invalid file', ERROR_CODES.VALIDATION_ERROR, 400)
      }
      if (!file.type.startsWith('image/')) {
        throw new ModuleError('Only image files allowed', ERROR_CODES.VALIDATION_ERROR, 400)
      }
      if (file.size > 3 * 1024 * 1024) {
        throw new ModuleError('File too large (<=3MB)', ERROR_CODES.VALIDATION_ERROR, 400)
      }

      const arrayBuffer = await file.arrayBuffer()
      const key = `feedback/${nowPrefix}_${i}_${crypto.randomUUID()}`
      if (!c.env['BUCKET']) {
        throw new ModuleError('R2 bucket is not bound', ERROR_CODES.INTERNAL_ERROR, 500)
      }
      await (c.env['BUCKET'] as any).put(key, arrayBuffer, {
        httpMetadata: { contentType: file.type },
      })
      keys.push(key)
    }

    return c.json({ success: true, data: { keys }, timestamp: new Date().toISOString() })
  } catch (error) {
    if (error instanceof ModuleError) throw error
    throw new ModuleError('Upload failed', ERROR_CODES.INTERNAL_ERROR, 500)
  }
})

export { uploadRoute }

