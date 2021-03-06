import express from 'express'
import formidable from 'express-formidable'

const router = express.Router()

import { requireSignin, isInstructor } from '../middlewares'
import {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  addLesson,
  updateCourse,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse } from '../controllers/course'

router.post('/course/upload-image', requireSignin, uploadImage)
router.post('/course/remove-image', requireSignin, removeImage)
router.post('/course', requireSignin, isInstructor, create)
router.post('/course/video-upload/:instructorId', requireSignin, formidable(), uploadVideo)
router.post('/course/video-remove/:instructorId', requireSignin, removeVideo)
router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson)

router.put('/course/:slug', requireSignin, updateCourse)
router.put('/course/publish/:courseId', requireSignin, publishCourse)
router.put('/course/unpublish/:courseId', requireSignin, unpublishCourse)
router.put('/course/lesson/:slug/:instructorId', requireSignin, updateLesson)
router.put('/course/:slug/:lessonId', requireSignin, removeLesson)


router.get('/course/:slug', read)

module.exports = router
