import express from 'express'

const router = express.Router()

import { requireSignin } from '../middlewares'
import {
  currentUser,
  register,
  login,
  logout,
  sendEmail,
  forgotPassword,
  resetPassword } from '../controllers/auth'

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

router.get('/logout', logout)
router.get('/current-user', requireSignin, currentUser)
router.get('/send-email', sendEmail)

module.exports = router
