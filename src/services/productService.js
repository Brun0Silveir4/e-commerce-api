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

} 

module.exports = new ProductService();