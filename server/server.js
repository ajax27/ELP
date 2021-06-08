import express from 'express'
import cors from 'cors'
import { readdirSync } from 'fs'
import mongoose from 'mongoose'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'

const csrfProtection = csrf({ cookie: true })

const morgan = require('morgan')
require('dotenv').config()

const app = express()

// DB connect
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
.then(() => console.log('DB Connected'))
.catch(error => console.log(error))

// middleware
app.use(cookieParser())
app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(morgan('dev'))

// routes
readdirSync('./routes').map(r => app.use('/api', require(`./routes/${r}`)))

app.use(csrfProtection)
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server listening on port: ${port} :)`))
