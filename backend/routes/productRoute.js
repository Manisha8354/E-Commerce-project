const express = require('express')
const router = express.Router()
const productControllers = require('../controllers/productControllers')
const uploads = require('../multerConfig.js')


router.post('/productSave',uploads.single("image"),productControllers.productSave)

router.get('/getProduct', productControllers.getProduct)
router.get('/getProductByBrand/:inp', productControllers.getProductByBrand)

router.get('/viewProduct/:id', productControllers.viewProduct)

router.delete('/deleteProduct/:id', productControllers.deleteProduct)

router.put('/upadteProduct/:id', productControllers.updateProduct)

module.exports = router