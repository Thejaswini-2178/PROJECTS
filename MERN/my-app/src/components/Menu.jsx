import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMenuItems } from '../redux/slices/menuSlice'
import axios from 'axios'

const Menu = () => {
  const dispatch = useDispatch()
  const menuItems = useSelector((state) => state.menu.items)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu')
        dispatch(setMenuItems(response.data))
      } catch (error) {
        console.error('Error fetching menu:', error)
      }
    }

    fetchMenu()
  }, [dispatch])

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            {item.name} - ₹{item.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Menu
