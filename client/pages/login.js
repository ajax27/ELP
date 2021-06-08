import { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons'
import { Context } from '../context'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // state
  const { state: { user }, dispatch } = useContext(Context)

  // router
  const router = useRouter()

  useEffect(() => {
    if (user !== null) router.push('/')
  }, [user])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      // console.table({ name, email, password })
      setLoading(true)
      const { data } = await axios.post(`/api/login`, {
        email, password,
      })
      // console.log('Login', data)
      dispatch({ type: 'LOGIN', payload: data, })
      // local storage
      window.localStorage.setItem('user', JSON.stringify(data))
      // redirect
      router.push('/user')
      toast.success('Login successful!')
      // setLoading(false)
    } catch (error) {
      toast.error(error.response.data)
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="p-5 bg-light jumbo3 mb-4 text-center">Login</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>

          <input
            className="form-control input-bg mb-4 p-4"
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            aria-label="default input example"
            />

          <input
            className="form-control input-bg mb-4 p-4"
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            aria-label="default input example"
            />
            <div className=" d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!email || !password || loading}>
                  {loading ? <SyncOutlined spin /> : 'Login'}
                </button>
            </div>
        </form>
        <p className="text-center login-link pt-3">
          Not Registered?{" "}
          <Link href="/register">
            <a>Register Account</a>
          </Link>
        </p>

        <p className="text-center login-link">
          Forgot Password?{" "}
          <Link href="/forgot-password">
            <a className="text-warning">Reset Password</a>
          </Link>
        </p>
      </div>
    </>
  )
}

export default Login
