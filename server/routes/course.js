import express from 'express'
import formidable from 'express-formidable'

const router = express.Router()

import { requireSignin, isInstructor } from '../middlewares'
import { uploadImage, removeImage, create, read, uploadVideo, removeVideo } from '../controllers/course'

router.post('/course/upload-image', requireSignin, uploadImage)
router.post('/course/remove-image', requireSignin, removeImage)
router.post('/course', requireSignin, isInstructor, create)
router.post('/course/video-upload', requireSignin, formidable(), uploadVideo)
router.post('/course/video-remove', requireSignin, removeVideo)

router.get('/course/:slug', read)

module.exports = router
