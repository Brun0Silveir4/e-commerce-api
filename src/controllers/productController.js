const ProductService = require('../services/productService');

class ProductController {

    async getAllProducts(req, res) {
        try{

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit || 10)
            const order = req.query.order || 'desc';

            if (page < 1 || limit < 1) {
                return res.status(400).json({error: 'Page and limit must be positive numbers.'});
            }

            const products = await ProductService.getAllProducts({page, limit, order});
            return res.status(200).json(products);

        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }
}

module.exports = new ProductController();