import express from 'express'
import asyncHandler from 'express-async-handler'

import * as controller from '../controllers/cSharpController.js'

const router = express.Router()

router.post('/', asyncHandler(controller.runCSharp))

export default router
