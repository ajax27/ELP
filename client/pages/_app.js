import TopNav from '../components/TopNav'
import { ToastContainer } from 'react-toastify'
import { Provider } from '../context'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import '../public/css/styles.css'

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <ToastContainer role="alert" position="top-center" />
      <TopNav />
      <Component {...pageProps } />
    </Provider>
  )
}

export default MyApp
