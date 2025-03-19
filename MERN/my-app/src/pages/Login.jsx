import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/slices/userSlice'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      dispatch(loginSuccess(res.data))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
