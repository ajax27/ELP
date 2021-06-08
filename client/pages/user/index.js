import { useContext } from 'react'
import { Context } from '../../context'
import UserRoute from '../../components/routes/UserRoute'

const UserIndex = () => {
  const { state: { user } } = useContext(Context)

  return (
    <UserRoute>
       <h1 className="text-center mb-4 p-5 jumbo user-p bg-primary">User Dashboard</h1>
    </UserRoute>
  )
}

export default UserIndex
