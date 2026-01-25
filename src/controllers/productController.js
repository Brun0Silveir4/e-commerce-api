const ProductService = require("../services/productService");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit || 10);
      const order = req.query.order || "desc";

      if (page < 1 || limit < 1) {
        return res
          .status(400)
          .json({ error: "Page and limit must be positive numbers." });
      }

      const products = await ProductService.getAllProducts({
        page,
        limit,
        order,
      });
      return res.status(200).json(products);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(Number(id));

      if (!product) return res.status(404).json({ error: "Product not found" });

      return res.status(200).json(product);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async createProduct(req, res) {
    try{

      const { name, description, price, stock } = req.body; 

      if (!name || !description || price == null || stock == null) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const newProduct = await ProductService.createProduct({
        name,
        description,
        price,
        stock
      });
      return res.status(201).json(newProduct);

    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new ProductController();
