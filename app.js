import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import testRoute from './src/routes/test.js'
import cSharpRoute from './src/routes/cSharpRoutes.js'

dotenv.config()

const dirname = path.resolve()

const app = express()

app.use(morgan('dev'))
app.use(cors())

app.use(express.static(path.join(dirname, '/public')))

app.use(express.json())

app.use('/test', testRoute)
app.use('/runcsharp', cSharpRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log('server running'))
