const express = require('express')
const router = express.Router();

const ensureAuth = require('../middlewares/ensureAuth');
const ProductController = require('../controllers/productController');


router.get('/', ensureAuth, ProductController.getAllProducts);



module.exports = router;