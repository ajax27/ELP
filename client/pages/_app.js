import React from 'react'
import { useIsClient } from 'react-util-hooks'
import TopNav from '../components/TopNav'
import { ToastContainer } from 'react-toastify'
import { Provider } from '../context'

import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/css/styles.css'
import 'antd/dist/antd.css'

function MyApp({ Component, pageProps }) {

  function renderOnlyOnClient(TopNave) {
    return function ClientOnlyComponent({ children, ...rest }) {
      const isClient = useIsClient(); // Yes, the hook is still useful!
      return isClient ? <TopNav {...rest}>{children}</TopNav> : <></>
    }
  }
  
  // Now we can just safe-wrap the component and use it freely
  const SafeComponentThatUsesUseLayoutEffect = renderOnlyOnClient(TopNav)
  
  return (
    <Provider>
      <ToastContainer role="alert" position="top-center" />
      <SafeComponentThatUsesUseLayoutEffect>
      <TopNav />
      </SafeComponentThatUsesUseLayoutEffect>
      <Component {...pageProps } />
    </Provider>
  )
}

export default MyApp
