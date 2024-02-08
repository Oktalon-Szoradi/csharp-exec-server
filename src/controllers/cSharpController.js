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
  if (isNullOrWhitespace(user)) {
    console.log('No user provided: ', user)
    res.status(400).json({ error: 'No user provided' })
    return
  }

  const data = await model.runCSharp(code, user)

  if (data.timedOut) {
    res.status(408).json(data)
    return
  }
  if (data.exitCode !== 0) {
    res.status(400).json(data)
    return
  }
  res.json(data)
}
