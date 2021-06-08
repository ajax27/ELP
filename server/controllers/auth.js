import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
}

const SES = new AWS.SES(awsConfig)

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    // validate
    if (!name) return res.status(400).send('Name is required!')

    if (!password || password.length < 6) {
      return res.status(400).send('Password is required and needs to be over 6 characters long!')
    }

    let userExists = await User.findOne({ email }).exec()
    if (userExists) return res.status(400).send('Email is already taken!')

    const passwordHashed = await hashPassword(password)
    const user = new User({ name, email, password: passwordHashed })
    await user.save()
    // console.log('User Saved', user)
    return res.json({ ok: true })
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error', error.message)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).exec()
    if (!user) return res.status(400).send('User not found')
    const match = await comparePassword(password, user.password)
    if (!match) return res.status(400).send('Wrong Password')
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    user.password = undefined
    res.cookie('token', token, {
      httpOnly: true,
      // secure: true, // https
    })
    res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error', error.message)
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token')
    return res.json({ message: 'You have successfully signed out' })
  } catch (error) {
    console.log(error)
  }
}

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec()
    console.log('Current User: ', user)
    return res.json({ secure: true })
  } catch (error) {
    console.log(error)
  }
}

export const sendEmail = async (req, res) => {
  // console.log('Sent Email using AWS')
  // res.json({ secure: true })
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: ['ajax27dev@gmail.com'],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <html>
              <h1>Link To Password Reset</h1>
              <p>Please use the following link to reset your password.</p>
            </html>
          `
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Password Reset Link'
      }
    }
  }

  const emailSent = SES.sendEmail(params).promise()

  emailSent.then(data => {
    console.log(data)
    res.json({ secure: true })
  })
  .catch(error => {
    console.log(error)
  })
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const shortCode = nanoid(6).toUpperCase()
    const user = await User.findOneAndUpdate({ email }, { passwordResetCode: shortCode })
    if (!user) return res.status(400).send('User email not found')

    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <html>
                <h1>Reset Password</h1>
                <p>Use code to reset your password</p>
                <h2 style="color: purple">${shortCode}</h2>
                <p><i>If you encounter any problems please reach me via <em>www.ajax27.com</em></i></p>
              </html>
            `
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: "Reset Password",
        },
      },
    }
    const emailSent = SES.sendEmail(params).promise()
    emailSent.then(data => {
      console.log(data)
      res.json({ secure: true })
    }).catch(error => {
      console.log(error)
    })
  } catch (error) {
    console.log(error)
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body
    // console.table({ email, code, newPassword })
    const passwordHashed = await hashPassword(newPassword)
    const user = User.findOneAndUpdate(
      { email, passwordResetCode: code },
      { password: passwordHashed, passwordResetCode: '' }).exec()
    res.json({ secure: true })
  } catch (error) {
    console.log(error)
    return res.status(400).send('Something broke, please try again!')
  }
}
