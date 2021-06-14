import { useState, useEffect  } from 'react'
import { useRouter } from 'next/router'
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import axios from 'axios'
import { Avatar, Tooltip, Button } from 'antd'
import { EditOutlined, CheckOutlined } from "@ant-design/icons"
import ReactMarkdown from 'react-markdown'

const CourseView = () => {
  const [course, setCourse] = useState({})

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    loadCourse()
  }, [slug])

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`)
    setCourse(data)
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
          </div>
        )}
      </div>
    </InstructorRoute>
  )
}

export default CourseView
