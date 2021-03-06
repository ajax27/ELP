import AWS from 'aws-sdk'
import { nanoid } from 'nanoid'
import Course from '../models/course'
import slugify from 'slugify'
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

export const updateCourse = async (req, res) => {
  try {
    const { slug } = req.params
    const course = await Course.findOne({ slug }).exec()
    console.log(req.user._id)
    console.log(course.instructor)
    if (req.user._id != course.instructor) {
      return res.status(400).send('Unauthorized')
    }
    const updated = await Course.findOneAndUpdate({ slug }, req.body, { new: true }).exec()
    res.json(updated)
  } catch (error) {
    console.log(error)
    return res.status(400).send(error.message)
  }
}

export const read = async (req, res) => {
  try {
    const course = await Course
      .findOne({ slug: req.params.slug })
      .populate('instructor', '_id name')
      .exec()
    res.json(course)
  } catch (error) {
    console.log(error)
  }
}

export const uploadVideo = async (req, res) => {
  try {
    // console.log('req.user._id: ', req.user._id)
    // console.log('req.params.instructorId: ', req.params.instructorId)
    if (req.user._id !== req.params.instructorId) {
      return res.status(400).send('Unauthorized')
    }
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
    if (req.user._id !== req.params.instructorId) {
      return res.status(400).send('Unauthorized')
    }
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

export const addLesson = async (req, res) => {
  try {
    const { slug, instructorId } = req.params
    const { title, content, video } = req.body
    if (req.user._id !== instructorId) {
      return res.status(400).send('Unauthorized')
    }
    const updated = await Course.findOneAndUpdate({ slug }, {
      $push: { lessons: { title, content, video, slug: slugify(title) } }
    }, { new: true }).populate('instructor', '_id name').exec()
    res.json(updated)
  } catch (error) {
    console.log(error)
    return res.status(400).send('Failed to add lesson')
  }
}

export const removeLesson = async (req, res) => {
  try {
    const { slug, lessonId } = req.params
    const course = await Course.findOne({ slug }).exec()
    if (req.user._id != course.instructor) {
      return res.status(400).send('Unauthorized')
    }
    const deletedCourse = await Course.findByIdAndUpdate(course._id, {
      $pull: { lessons: { _id: lessonId } },
    }).exec()
    res.json({ secure: true })
  } catch (error) {
    console.log(error)
  }
}

export const updateLesson = async (req, res) => {
  try {
    const { slug } = req.params
    const { _id, title, content, video, free_preview } = req.body
    // find post
    const course = await Course.findOne({ slug })
      .select("instructor")
      .exec()
    // is owner?
    if (req.user._id != course.instructor._id) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.updateOne(
      { "lessons._id": lessonId },
      {
        $set: {
          "lessons.$.title": title,
          "lessons.$.content": content,
          "lessons.$.video": video,
          "lessons.$.free_preview": free_preview,
        },
      }
    ).exec();
    console.log("updated => ", updated);
    res.json({ secure: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Update lesson failed");
  }
}

export const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await Course.findById(courseId).select('instructor').exec()
    if (req.user._id != course.instructor._id) {
      return res.status(400).send("Unauthorized");
    }
    const updated = await Course.findByIdAndUpdate(courseId, { published: true }, { new: true }).exec()
    res.json(updated)
  } catch (error) {
    console.log(error)
    return res.status(400).send*'Failed to publish course'
  }
}

export const unpublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await Course.findById(courseId).select('instructor').exec()
    if (req.user._id != course.instructor._id) {
      return res.status(400).send("Unauthorized");
    }
    const updated = await Course.findByIdAndUpdate(courseId, { published: false }, { new: true }).exec()
    res.json(updated)
  } catch (error) {
    console.log(error)
    return res.status(400).send*'Failed to unpublish course'
  }
}

