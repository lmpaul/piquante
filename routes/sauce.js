const express = require('express')


const router = express.Router()
const sauceController = require('../controllers/sauce')

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

router.get('/', auth, sauceController.getAllSauces)
router.get('/:id', auth, sauceController.getOneSauce)
router.post('/', auth, multer, sauceController.createSauce)
router.delete('/:id', auth, sauceController.deleteSauce)
router.put('/:id', auth, multer, sauceController.modifySauce)
router.post('/:id/like', auth, sauceController.likeSauce)

module.exports = router
