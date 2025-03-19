const express = require('express')
const router = express.Router()

const menuItems = [
  { _id: 1, name: 'Pizza', price: 250 },
  { _id: 2, name: 'Burger', price: 150 },
  { _id: 3, name: 'Pasta', price: 200 },
]

router.get('/', (req, res) => {
  res.json(menuItems)
})

module.exports = router
