import User from '../models/user'
import Course from '../models/course'
import queryString from 'query-string'
const stripe = require('stripe')(process.env.STRIPE_SECRET)

export const makeInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec()
    // check for stripe account_id, if none create one
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: 'express' })
      user.stripe_account_id = account.id
      user.save()
    }
    // create link for onboarding process
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: 'account_onboarding',
    })
    // pre-fill info (email), send response to frontend
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    })
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`)
  } catch (error) {
    console.log('make instructor Error: ', error)
  }
}

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec()
    const account = await stripe.account.retrieve(user.stripe_account_id)

    if (!account.charges_enabled) {
      return res.status(401).send('Unauthorized account')
    } else {
      const statusUpdated = await User.findByIdAndUpdate(user._id, {
        stripe_seller: account,
        $addToSet: { role: 'Instructor' },
      }, { new: true }).select('-password').exec()
      res.json(statusUpdated)
    }
  } catch (error) {
    console.log(error)
  }
}

export const currentInstructor = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select('-password').exec()
    if (!user.role.includes('Instructor')) {
      return res.sendStatus(403)
    } else {
      res.json({ secure: true })
    }
  } catch (error) {
    console.log(error)
  }
}

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 }).exec()
    res.json(courses)
  } catch (error) {
    console.log(error)
  }
}
