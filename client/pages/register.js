import { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons'
import { Context } from '../context'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { state: { user } } = useContext(Context)

  const router = useRouter()

  useEffect(() => {
    if (user !== null) router.push('/')
  }, [user])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      // console.table({ name, email, password })
      setLoading(true)
      const { data } = await axios.post(`/api/register`, {
        name, email, password
      })
      // console.log('Register', data)
      toast.success('Registration successful, please login')
      setName('')
      setEmail('')
      setPassword('')
      setLoading(false)
      router.push('/login')
    } catch (error) {
      toast.error(error.response.data)
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="p-5 bg-light jumbo3 mb-4 text-center">Register Account</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>

          <input
            className="form-control input-bg mb-4 p-4"
            type="text" value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter Your Name"
            aria-label="default input example"
            />

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
                disabled={!name || !email || !password || loading}>
                  {loading ? <SyncOutlined spin /> : 'Register'}
                </button>
            </div>
        </form>
        <p className="text-center login-link p-3">
          Already Registered?{" "}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  )
}

export default Register
