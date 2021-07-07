import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import CourseCreateForm from '../../../forms/CourseCreateForm'
import InstructorRoute from '../../../components/routes/InstructorRoute'
import Resizer from 'react-image-file-resizer'
import { useRouter } from 'next/router'

const CourseCreate = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    category: '',
    price: '9.99',
    uploading: false,
    paid: true,
    loading: false,
  })
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState('')
  const [uploadImageText, setUploadImageText] = useState('Upload Image')

  const router = useRouter()

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
      const { data } = await axios.post('/api/course', { ...values, image, })
      toast.success('Fantastic, now add some lessons to your course!')
      router.push('/instructor')
    } catch (error) {
      console.log(error)
      toast.error(error.response.data)
    }
  }

  return (
    <InstructorRoute>
      <h1 className="p-5 bg-light jumbo mb-4 text-center">Create Course</h1>
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
          />
      </div>
      <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre>
    </InstructorRoute>
  )
}

export default CourseCreate
