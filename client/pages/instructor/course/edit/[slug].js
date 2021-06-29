import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Avatar, List, Tooltip, Button, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import CourseCreateForm from '../../../../forms/CourseCreateForm'
import UpdateLessonForm from '../../../../forms/UpdateLessonForm'
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import Resizer from 'react-image-file-resizer'
import { useRouter } from 'next/router'

const { Item } = List

const CourseEdit = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    category: '',
    price: '9.99',
    uploading: false,
    paid: true,
    lessons: [],
    loading: false,
  })
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState('')
  const [uploadImageText, setUploadImageText] = useState('Upload Image')
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState({})
  const [uploadVideoText, setUploadVideoText] = useState('Upload Video')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    loadCourse()
  }, [slug])

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(`/api/course/${slug}`)
      if (data) setValues(data)
      if (data && data.image) setImage(data.image)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleImage = e => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setUploadImageText(file.name)
    setValues({ ...values, loading: true })
    
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async uri => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        })
        console.log('Image Uploaded', data)
        setImage(data)
        setValues({ ...values, loading: false })
      } catch (error) {
        console.log(error)
        setValues({ ...values, loading: false })
        toast.error('Image upload failed, please try again with the right format')
      }
    })
  }

  const handleImageRemove = async () => {
    try {
    setValues({ ...values, loading: true })
    const res = await axios.post('/api/course/remove-image', { image })
    setImage({})
    setPreview('')
    setUploadImageText('Upload Image')
    setValues({ ...values, loading: false })
  } catch (error) {
    console.log(error)
    setValues({ ...values, loading: false })
    toast.error('Image upload failed, please try again with the right format')
  }
}

  const handleSubmit = async e => {
    e.preventDefault()
    // console.log(values)
    try {
      const { data } = await axios.put(`/api/course/${slug}`, { ...values, image, })
      toast.success('Course Updated')
      // router.push('/instructor')
    } catch (error) {
      console.log(error)
      toast.error(error.response.data)
    }
  }

  const handleDrag = (e, index) => {
    e.dataTransfer.setData('itemIndex', index)
  }

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData('itemIndex')
    const targetItemIndex = index
    let allLessons = values.lessons
    let movingItem = allLessons[movingItemIndex] // targeted item to drag
    allLessons.splice(movingItemIndex, 1)  // remove one item from index
    allLessons.splice(targetItemIndex, 0, movingItem)  // push target item

    setValues({ ...values, lessons: [...allLessons] })
    const { data } = await axios.put(`/api/course/${slug}`, { ...values, image, })
    toast.success('Lessons rearranged successfully')
  }

  const handleDelete = async index => {
    const answer = window.confirm('Are you sure you want to delete this lesson?')
    if (!answer) return
    let allLessons = values.lessons
    const removed = allLessons.splice(index, 1)
    setValues({ ...values, lessons: allLessons })
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`)
  }

  /**
   * lesson update functions
   */

  const handleVideo = () => {}

  const handleLessonUpdate = () => {}

  return (
    <InstructorRoute>
      <h1 className="p-5 bg-light jumbo mb-4 text-center">Update Course</h1>
      <div className="pt-3 pb-3">
      <h2 className="page-header">Course Details</h2>
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleImageRemove={handleImageRemove}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadImageText={uploadImageText}
          editPage={true}
          />
      </div>

      <hr />

      <div className="row pb-5 pt-3">
          <div className="col lesson-list">
            <h4 className="pb-3">
              {values && values.lessons && values.lessons.length} Lessons
            </h4>
            <p>('drag and drop to rearrange')</p>
            <List
              onDragOver={e => e.preventDefault()}
              itemLayout="horizontal"
              dataSource={values && values.lessons}
              renderItem={(item, index) => (
                <Item
                  draggable
                  onDragStart={e => handleDrag(e, index)}
                  onDrop={e => handleDrop(e, index)}>
                  <Item.Meta 
                    title={item.title}
                    onClick={() => {
                      setVisible(true)
                      setCurrent(item)
                    }}
                    avatar={<Avatar>{index + 1}</Avatar>}></Item.Meta>
                    <Tooltip  color="#ff0000" title="DELETE?">
                      <Button ghost>
                        <DeleteOutlined className="text-danger float-end mr-5" onClick={() => handleDelete(index)} />
                      </Button>
                    </Tooltip>
                </Item>
              )}></List>
          </div>
        </div>
        <Modal 
          title="Update Lesson"
          className="text-center"
          centered 
          visible={visible} 
          onCancel={() => setVisible(false)}
          footer={null}
          >
            <UpdateLessonForm 
              current={current} 
              setCurrent={setCurrent}
              handleVideo={handleVideo}
              handleLessonUpdate={handleLessonUpdate}
              uploadVideoText={uploadVideoText}
              uploading={uploading}
              progress={progress} />
          </Modal>
    </InstructorRoute>
  )
}

export default CourseEdit
