const express = require('express')
const router = express.Router();

const ensureAuth = require('../middlewares/ensureAuth');
const ensureAdmin = require('../middlewares/ensureAdmin')

const ProductController = require('../controllers/productController');


router.get('/', ensureAuth, ProductController.getAllProducts);
router.post('/', ensureAuth, ensureAdmin, ProductController.createProduct);

router.get('/:id', ensureAuth, ProductController.getProductById);
router.put('/:id', ensureAuth, ensureAdmin, ProductController.updateProduct)
router.delete('/:id', ensureAuth, ensureAdmin, ProductController.deleteProduct)



module.exports = router;