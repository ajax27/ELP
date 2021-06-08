import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { SyncOutlined } from '@ant-design/icons'
import UserNav from '../nav/UserNav'
import axios from 'axios'

const UserRoute = ({ children }) => {
  const [secure, setSecure] = useState(false)

  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/current-user')
        // console.log(data)
        if (data.secure) setSecure(true)
      } catch (error) {
        console.log(error)
        setSecure(false)
        router.push('/login')
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
              <UserNav />
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

export default UserRoute
