import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import CourseCreateForm from '../../../../forms/CourseCreateForm'
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import Resizer from 'react-image-file-resizer'
import { useRouter } from 'next/router'

const CourseEdit = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    uploading: false,
    paid: '9.99',
    loading: false,
  })
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState('')
  const [uploadImageText, setUploadImageText] = useState('Upload Image')

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    loadCourse()
  }, [slug])

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`)
    setValues(data)
    if (data && data.image) setImage(data.image)
  }

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleImage = e => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setUploadImageText(file.name)
    setValues({ ...values, loading: true })
    setImage({})
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
      {/* <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre> */}
    </InstructorRoute>
  )
}

export default CourseEdit
