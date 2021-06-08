import AWS from 'aws-sdk'
import { nanoid } from 'nanoid'

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

