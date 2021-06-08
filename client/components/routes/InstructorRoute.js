import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { SyncOutlined } from '@ant-design/icons'
import InstructorNav from '../nav/InstructorNav'
import axios from 'axios'

const InstructorRoute = ({ children }) => {
  const [secure, setSecure] = useState(false)

  const router = useRouter()

  useEffect(() => {
    fetchInstructor()
  }, [])

  const fetchInstructor = async () => {
      try {
        const { data } = await axios.get('/api/current-instructor')
        // console.log(data)
        if (data.secure) setSecure(true)
      } catch (error) {
        console.log(error)
        setSecure(false)
        router.push('/')
      }
    }

  return (
    <>
      {!secure ? (
        <SyncOutlined
          className="d-flex justify-content-center display-1 text-primary p-5"
          spin />
          ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <InstructorNav />
            </div>
            <div className="col-md-10">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InstructorRoute
