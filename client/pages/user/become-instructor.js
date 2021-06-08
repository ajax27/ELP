import { useState, useContext } from 'react'
import { Context } from '../../context'
import { Button } from 'antd'
import axios from 'axios'
import { SettingOutlined, UserSwitchOutlined, LoadingOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import UserRoute from '../../components/routes/UserRoute'

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false)
  const { state: { user } } = useContext(Context)

  const becomeInstructor = () => {
    setLoading(true)
    axios.post('/api/make-instructor').then(res => {
      console.log(res)
      window.location.href = res.data
    })
    .catch(error => {
      console.log(error.response.data)
      toast.error('Stripe Onboarding failed, please try again!')
      setLoading(false)
    })
  }

  return (
    <>
      <h1 className="p-5 bg-light jumbo3 mb-4 text-center">Become an Instructor</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payments to publish courses on Ajax27 Learning</h2>
              <p className="lead bold text-info">
                Ajax27 Dev partners with Stripe to transfer earnings to your bank account
              </p>
              <Button
                type="primary"
                block
                shape="round"
                size="large"
                className="mb-3 align-middle"
                onClick={becomeInstructor}
                disabled={user && user.role && user.role.includes('Instructor') || loading}
                icon={loading ? <LoadingOutlined /> : <SettingOutlined className="align-middle pb-1" />}>
                {loading ? 'Processing...' : 'Payments Setup'}
              </Button>
              <p className="lead">
                You will be redirected to Stripe to complete your onboarding process
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BecomeInstructor
