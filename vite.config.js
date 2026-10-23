import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function imageUploadPlugin() {
  const handler = (req, res, next) => {
    const url = req.url ? req.url.split('?')[0] : ''
    if (req.method !== 'POST' || (url !== '/api/upload-image' && url !== '/api/upload')) {
      return next()
    }

    const chunks = []
    let totalLength = 0

    req.on('data', (chunk) => {
      chunks.push(chunk)
      totalLength += chunk.length
    })

    req.on('end', () => {
      try {
        const rawBody = Buffer.concat(chunks, totalLength).toString('utf-8')
        const data = JSON.parse(rawBody)
        const { image, fileName, name } = data

        if (!image) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ success: false, error: 'No image data provided' }))
        }

        // Determine image format and extract base64 data
        let ext = 'jpg'
        let base64Content = image

        const match = image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/)
        if (match) {
          const mimeSubtype = match[1].toLowerCase()
          if (mimeSubtype.includes('png')) ext = 'png'
          else if (mimeSubtype.includes('webp')) ext = 'webp'
          else if (mimeSubtype.includes('gif')) ext = 'gif'
          else if (mimeSubtype.includes('svg')) ext = 'svg'
          else ext = 'jpg'
          base64Content = match[2]
        } else if (image.includes(';base64,')) {
          base64Content = image.split(';base64,')[1]
        }

        const buffer = Buffer.from(base64Content, 'base64')

        // Ensure public/imgs directory exists
        const publicImgsDir = path.resolve(__dirname, 'public', 'imgs')
        if (!fs.existsSync(publicImgsDir)) {
          fs.mkdirSync(publicImgsDir, { recursive: true })
        }

        // Generate sanitized unique file name
        const cleanOriginalName = (fileName || name || 'gift_product')
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .toLowerCase()
          .slice(0, 35)

        const uniqueFileName = `${cleanOriginalName || 'gift'}_${Date.now()}.${ext}`
        const filePath = path.join(publicImgsDir, uniqueFileName)

        fs.writeFileSync(filePath, buffer)
        console.log(`[Image Upload] Saved image to: ${filePath}`)

        const publicUrl = `/imgs/${uniqueFileName}`

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({
          success: true,
          url: publicUrl,
          fileName: uniqueFileName,
          savedTo: filePath
        }))
      } catch (err) {
        console.error('[Image Upload] Error processing upload:', err)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ success: false, error: err.message }))
      }
    })
  }

  return {
    name: 'image-upload-middleware',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imageUploadPlugin()],
})
