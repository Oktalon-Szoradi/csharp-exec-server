/* eslint-disable no-unused-vars */
import colors from 'colors'

const errorHandler = (err, req, res, next) => {
  console.log(`ERROR ====> ${err.stack}`.bgRed.white)
  res.status(500).send('The server has encountered an error')
}

const notFoundHandler = (req, res, next) => {
  console.log(`NOT FOUND ====> ${req.originalUrl}`.bgBlue.black)
  res.status(404).send('The ressource was not found in this server')
  next()
}

export { errorHandler, notFoundHandler }
