const prisma = require("../database")

class ProductService {

    async getAllProducts({page = 1, limit = 10, order = 'desc'}) {
        
        const offset = (page - 1) * limit; 

        const produtcs = await prisma.product.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: order
            },
        })
        const totalCount = await prisma.product.count();

        return {
            items: produtcs,
            pagination: {
                page,
                limit,
                offset,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            }
        }

    }

    async getProductById(id){
        const product = await prisma.product.findUnique({
            where: {id}
        })
        return product

    }

    async createProduct(data){
        const newProduct = await prisma.product.create({
            data
        })
        return newProduct
    }

    async updateProduct(id, data){
        const updatedProduct = await prisma.product.update({
            where: {id},
            data
        })
        return updatedProduct
    }
}

module.exports = new ProductService();