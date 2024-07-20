const express = require('express')
const router = express.Router()
const cartControllers = require('../controllers/cartController.js')
const uploads = require('../multerConfig.js')


router.post('/cartSave/:username',uploads.single("image"),cartControllers.cartSave)

router.get('/getCart/:username', cartControllers.getCart)

router.delete('/deleteCart/:id/:username', cartControllers.deleteCart)

module.exports = router