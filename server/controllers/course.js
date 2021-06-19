import AWS from 'aws-sdk'
import { nanoid } from 'nanoid'
import Course from '../models/course'
import { readFileSync } from 'fs'

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
}

const S3 = new AWS.S3(awsConfig)

export const uploadImage = async (req, res) => {
  // console.log(req.body)
  try {
    const { image } = req.body
    if (!image) return res.status(400).send('No Image!')
    // prepare image
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const type = image.split(';')[0].split('/')[1]
    const params = {
      Bucket: 'ajax27bucket',
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
    }
    // upload to AWS S3
    S3.upload(params, (error, data) => {
      if (error) {
        console.log(error)
        return res.sendStatus(400)
      }
      console.log(data)
      res.send(data)
    })
  } catch (error) {
    console.log(error)
  }
}

export const removeImage = async (req, res) => {
  try {
    const { image } = req.body
    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    }
    // request image deletion from AWS S3
    S3.deleteObject(params, (error, data) => {
      if (error) {
        console.log(error)
        res.sendStatus(400)
      }
      res.send({ secure: true })
    })
  } catch (error) {
    console.log(error)
  }
}

export const create = async (req, res) => {
  // console.log(req.body)
  // return
  try {
    const alreadyExists = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase())
    })
    if (alreadyExists) return res.status(400).send('Title already taken, try another')

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.user._id,
      ...req.body,
    }).save()
    res.json(course)
  } catch (error) {
    console.log(error)
    return res.status(400).send('Course creation failed, please try again')
  }
}

export const read = async (req, res) => {
  try {
    const course = await Course
      .findOne({ slug: req.params.slug })
      .populate('Instructor', '_id name')
      .exec()
    res.json(course)
  } catch (error) {
    console.log(error)
  }
}

export const uploadVideo = async (req, res) => {
  try {
    const { video } = req.files
    if (!video) return res.status(400).send('No video supplied')
    const params = {
      Bucket: 'ajax27bucket',
      Key: `${nanoid()}.${video.type.split('/')[1]}`,
      Body: readFileSync(video.path),
      ACL: 'public-read',
      ContentType: video.type,
    }
    // upload to S3
    S3.upload(params, (error, data) => {
      if (error) {
        console.log(error)
        res.statusCode(400)
      }
      res.send(data)
    })
  } catch (error) {
    console.log(error)
  }
}

export const removeVideo = async (req, res) => {
  try {
    const { Bucket, Key } = req.body
    const params = {
      Bucket,
      Key,
    }
    // request image deletion from AWS S3
    S3.deleteObject(params, (error, data) => {
      if (error) {
        console.log(error)
        res.sendStatus(400)
      }
      res.send({ secure: true })
    })
  } catch (error) {
    console.log(error)
  }
}

