import express from 'express'

const router = express.Router()

import { requireSignin } from '../middlewares'
import { uploadImage, removeImage } from '../controllers/course'

router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

module.exports = router
