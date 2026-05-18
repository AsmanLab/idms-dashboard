const BACKEND = 'http://176.126.166.10:8000'

export default async function handler(req, res) {
  const segments = Array.isArray(req.query.path)
    ? req.query.path
    : [req.query.path].filter(Boolean)

  const targetUrl = new URL(`${BACKEND}/${segments.join('/')}`)

  // Forward any query params except the catch-all 'path' param
  Object.entries(req.query).forEach(([k, v]) => {
    if (k !== 'path') targetUrl.searchParams.set(k, String(v))
  })

  const headers = { 'Content-Type': 'application/json' }
  if (req.headers.authorization) headers['Authorization'] = req.headers.authorization

  const init = {
    method: req.method ?? 'GET',
    headers,
    redirect: 'follow', // follow 301s from FastAPI server-side, never expose to browser
  }

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    init.body = JSON.stringify(req.body)
  }

  try {
    const upstream = await fetch(targetUrl.toString(), init)
    const text = await upstream.text()
    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
    res.status(upstream.status).send(text)
  } catch {
    res.status(502).json({ detail: 'Backend unreachable' })
  }
}
