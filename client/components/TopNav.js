import { useState, useEffect, useContext } from 'react'
import { Menu } from 'antd'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  AppstoreOutlined,
  LoginOutlined,
  LogoutOutlined,
  DashboardOutlined,
  UserAddOutlined,
  TeamOutlined,
  VideoCameraAddOutlined, 
  SettingFilled} from '@ant-design/icons'
import { Context } from '../context'

const { Item, SubMenu, ItemGroup } = Menu

const TopNav = () => {
  const [current, setCurrent] = useState('')

  const { state, dispatch } = useContext(Context)
  const { user } = state

  // router
  const router = useRouter()

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname)
  }, [process.browser && window.location.pathname])

  const logout = async () => {
    dispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('user')
    const { data } = await axios.get('/api/logout')
    toast(data.message)
    router.push('/login')
  }

  return (
    <Menu mode="horizontal" className="" style={{ marginBottom: '-1.5px', fontWeight: '500' }} selectedKeys={[current]}>
      <Item onClick={e => setCurrent(e.key)} key="/" icon={<AppstoreOutlined />}>
        <Link href="/">
          <a className="align-middle">App</a>
        </Link>
      </Item>

      {user && user.role && user.role.includes('Instructor') ? (
        <Item onClick={e => setCurrent(e.key)} key="/instructor/course/create" icon={<VideoCameraAddOutlined />}>
          <Link href="/instructor/course/create">
            <a className="align-middle">Create Course</a>
          </Link>
        </Item>
      ) : (
        <Item onClick={e => setCurrent(e.key)} key="/user/become-instructor" icon={<TeamOutlined />}>
          <Link href="/user/become-instructor">
            <a className="align-middle">Become An Instructor</a>
          </Link>
        </Item>
      )}

      {user === null && (
        <>
          <Item onClick={e => setCurrent(e.key)} key="/login" icon={<LoginOutlined />}>
            <Link href="/login">
              <a className="align-middle">Login</a>
            </Link>
          </Item>

          <Item onClick={e => setCurrent(e.key)} key="/register" icon={<UserAddOutlined />}>
            <Link href="/register">
              <a className="align-middle">Register</a>
            </Link>
          </Item>
        </>
      )}

      {user && user.role && user.role.includes('Instructor') && (
        <Item onClick={e => setCurrent(e.key)} className="align-center" key="/instructor" icon={<TeamOutlined />}>
          <Link href="/instructor">
            <a className="align-middle">Instructor</a>
          </Link>
        </Item>
      )}

    {user !== null && (
        <SubMenu key='SubMenu' icon={<SettingFilled className="align-middle" />} style={{ backgroundColor: '#00e5ff' }} title={user && user.name} className="username align-middle text-center">
          <ItemGroup className="text-center drop">
            <Item key='/user' className="text-center drop grey" icon={<DashboardOutlined />}>
              <Link className="drop" href="/user">
                <a className="text-center align-middle">User Dashboard</a>
              </Link>
            </Item>
            <Item key='logout' onClick={logout} className="drop text-center grey" icon={<LogoutOutlined />}>
              <span className="text-center align-middle">Account Logout</span>
            </Item>
          </ItemGroup>
        </SubMenu>
      )}

    </Menu>
  )
}

export default TopNav
