import { useState, useEffect  } from 'react'
import { useRouter } from 'next/router'
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import AddLessonForm from '../../../../forms/AddLessonForm'
import axios from 'axios'
import { Avatar, Tooltip, Button, Modal } from 'antd'
import { EditOutlined, CheckOutlined, UploadOutlined } from "@ant-design/icons"
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'

const CourseView = () => {
  const [course, setCourse] = useState({})
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: {},
  })
  const [uploading, setUploading] = useState(false)
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video')

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    loadCourse()
  }, [slug])

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`)
    setCourse(data)
  }

  const handleAddLesson = e => {
    e.preventDefault()
    console.log(values)
  }

  const handleVideo = async e => {
    try {
      const file = e.target.files[0]
      setUploadButtonText(file.name)
      setUploading(true)
      const videoData = new FormData()
      videoData.append('video', file)
      // send video as form data with progress bar to backend
      const { data } = await axios.post('/api/course/video-upload', videoData, {
        onUploadProgress: e => {
          setProgress(Math.round((100 * e.loaded) / e.total))
        }
      })
      console.log(data)
      setValues({ ...values, video: data })
      setUploading(false)
    } catch (error) {
      console.log(error)
      setUploading(false)
      toast.error('Video Upload Failed')
    }
  }

  const handleVideoRemove = async () => {
    try {
      setUploading(true)
      const { data } = await axios.post('/api/course/video-remove', values.video)
      setValues({ ...values, video: {} })
      setUploading(false)
      setUploadButtonText('Upload Another Video')
    } catch (error) {
      console.log(error)
      setUploading(false)
      toast.error('Failed to remove video')
    }
  }

  return (
    <InstructorRoute>
      <div className="container-fluid pt-4">
        {course && (
          <div className="media row">
            <div className="col d-flex">
              <div className="pt-3 p-4">
              <Avatar
                className="media-object media-left"
                size={88}
                src={course.image ? course.image.Location : "/course.png"}
              />
              </div>

              <div className="media-body media-right text-center">
                <h5 className="text-primary text-center pl-5 pt-4">{course.name}</h5>
                <p className="media-text">
                  {course.lessons && course.lessons.length} Lessons Completed
                </p>
                <p className="media-text middle" style={{ fontSize: "1rem" }}>
                  {course.category}
                </p>
              </div>


              <div className="d-flex media-right pt-4 p-4">
                <Tooltip color="#FDBF06" title="Edit">
                  <Button ghost>
                    <EditOutlined style={{ cursor: 'pointer' }} className="h5 text-warning" />
                  </Button>
                </Tooltip>
                <Tooltip color="#3F9A6F" className="ml-3" title="Publish">
                  <Button ghost>
                    <CheckOutlined style={{ cursor: 'pointer' }} className="h5 text-success pull-right" />
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div className="row">
              <div className="col m-3" style={{ fontSize: '1.2rem' }}>
                <ReactMarkdown children={course.description} />
              </div>
            </div>
            <div className="row">
              <Button
                className="col-md-6 offset-md-3 text-center"
                icon={<UploadOutlined className="align-top pt-1" />}
                type="primary"
                size="large"
                shape="round"
                onClick={() => setVisible(true)}>
                Add Lesson
              </Button>
            </div>
            <Modal onCancel={() => setVisible(false)} className="text-center text-uppercase" title="+ Add Lesson" centered visible={visible} footer={null}>
              <AddLessonForm
                values={values}
                setValues={setValues}
                uploading={uploading}
                handleAddLesson={handleAddLesson}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
               />
            </Modal>
          </div>
        )}
      </div>
    </InstructorRoute>
  )
}

export default CourseView
