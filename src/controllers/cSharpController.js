import * as model from '../models/cSharpModel.js'

const isNullOrWhitespace = str => {
  if (str == null) return true
  return str.replace(/\s/g, '').length < 1
}

export const runCSharp = async (req, res) => {
  const { code, user } = req.body

  console.log('req.body: ', req.body)

  if (isNullOrWhitespace(code)) {
    console.log('No code provided: ', code)
    res.status(400).json({ error: 'No code provided' })
    return
  }

  if (
    code.includes('while (true)') ||
    code.includes('while(true)') ||
    code.includes('for (;;)') ||
    code.includes('for(;;)')
  ) {
    res.status(400).json({ error: 'Infinite loop detected' })
    return
  }

  if (isNullOrWhitespace(user)) {
    console.log('No user provided: ', user)
    res.status(400).json({ error: 'No user provided' })
    return
  }

  let data
  try {
    data = await model.runCSharp(code, user)
  } catch (err) {
    res.status(400).json({ error: err.message })
    return
  }

  if (data.timedOut) {
    res.status(408).json(data)
    return
  }
  if (data.exitCode !== 0) {
    res.status(400).json(data)
    return
  }

  // Limit output to 1000 characters or 100 lines
  if (data.output.length > 512 || data.output.split('\n').length > 100) {
    data.output = data.output.slice(0, 512) + '...'
  }

  res.json(data)
}
