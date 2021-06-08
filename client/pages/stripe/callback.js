import { useContext, useEffect } from 'react'
import { Context } from '../../context'
import { SyncOutlined } from '@ant-design/icons'
import axios from 'axios'

const StripeCallback = () => {
  const { state: { user }, dispatch, } = useContext(Context)

  useEffect(() => {
    if (user) {
      axios.post('/api/get-account-status').then(res => {
        // console.log(res)
        dispatch({
          type: 'login',
          payload: res.data,
        })
        window.localStorage.setItem('user', JSON.stringify(res.data))
        window.location.href = '/instructor'
      })
    }
  }, [user])

  return (
    <SyncOutlined spin className="d-flex mt-5 justify-content-center display-1 text-success p-5" />
  )
}

export default StripeCallback
