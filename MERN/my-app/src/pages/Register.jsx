import { useState } from 'react'
import axios from 'axios'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/auth/register', { name, email, password })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input type="text" onChange={(e) => setName(e.target.value)} />
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
