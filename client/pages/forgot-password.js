import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Context } from '../context'
import { useRouter } from 'next/router'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { state: { user } } = useContext(Context)

  const router = useRouter()

  useEffect(() => {
    if (user !== null) router.push('/')
  }, [user])

  const handleSubmit = async e => {
    e.preventDefault()
    console.log(email, code, newPassword)
    try {
      setLoading(true)
      const { data } = await axios.post('/api/forgot-password', { email })
      setSuccess(true)
      toast.success('Please check your email for your secret code!')
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response.data)
    }
  }

  const handleResetPassword = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post('/api/reset-password', { email, code, newPassword})
      setEmail('')
      setCode('')
      setNewPassword('')
      toast.success('Password successfully updated, now log in with your new password')
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response.data)
    }
  }

  return (
    <>
      <h1 className="text-center jumbotron jumbo mb-3 p-5 bg-light">
        Get Password Code
      </h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form className="form-control" onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            />
            {success && (
              <>
                <input
                  type="code"
                  className="form-control mb-4 p-4"
                  value={code} onChange={e => setCode(e.target.value)}
                  placeholder="Enter Your Code"
                  required
                  />

                  <input
                    type="password"
                    className="form-control mb-4 p-4"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="Your New Password"
                    required
                  />
              </>
            )}
            <button className="btn form-control btn-success" type="submit" disabled={loading || !email}>
              {loading ? <SyncOutlined spin /> : 'Get Code and Submit'}
            </button>
        </form>
        {success && (
          <p className="text-center login-link p-3">
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
        )}
      </div>
    </>
  )
}

export default ForgotPassword
