const BACKEND = 'http://176.126.166.10:8000'

export default async function handler(req, res) {
  // req.url preserves trailing slashes and query strings exactly as sent
  // Strip the leading /api prefix to get the backend path
  const backendPath = req.url.replace(/^\/api/, '')
  const targetUrl = `${BACKEND}${backendPath}`

  const headers = { 'Content-Type': 'application/json' }
  if (req.headers.authorization) headers['Authorization'] = req.headers.authorization

  const init = {
    method: req.method ?? 'GET',
    headers,
    redirect: 'follow',
  }

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    init.body = JSON.stringify(req.body)
  }

  try {
    const upstream = await fetch(targetUrl, init)
    const text = await upstream.text()
    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
    res.status(upstream.status).send(text)
  } catch {
    res.status(502).json({ detail: 'Backend unreachable' })
  }
}
