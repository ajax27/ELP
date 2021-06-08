import { useReducer, useEffect, createContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const initialState = {
  user: null,
}

// create context
const Context = createContext()

// root reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    default: return state
  }
}

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState)

  const router = useRouter()

  useEffect(() => {
    dispatch({
      type: 'LOGIN',
      payload: JSON.parse(window.localStorage.getItem('user'))
    })
  }, [])

  axios.interceptors.response.use(
    function(response) {
      // any 200 status codes
      return response
    },
    function(error) {
      let res = error.response
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios.get('/api/logout')
            .then(data => {
              console.log('Error: 401 = Logout!')
              dispatch({ type: 'LOGOUT' })
              window.localStorage.removeItem('user')
              router.push('/login')
            })
            .catch(error => {
              console.log('Axios Interceptor Error', error)
              reject(error)
            })
        })
      }
      return Promise.reject(error)
    }
  )

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token')

      axios.defaults.headers['X-CSRF-Token'] = data.getCsrfToken
    }
    getCsrfToken()
  }, [])

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  )
}

export { Context, Provider }

