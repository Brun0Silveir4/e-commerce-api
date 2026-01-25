const {PrismaClient, Role} = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main(){
    const adminEmail = 'admin@admin.com'

    const adminExists = await prisma.user.findUnique({
        where: {email: adminEmail}
    })

    if (!adminExists){
        const hashedPassword = await bcrypt.hash('admin123', 10)

        await prisma.user.create({
            data: {
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: Role.admin
            }
        })
        console.log('Admin user created')
    } else {
        console.log('Admin user already exists')
    }

     const products = [
    {
      name: "Teclado Mecânico",
      description: "Teclado mecânico RGB com switch azul",
      price: 299.90,
      stock: 50,
    },
    {
      name: "Mouse Gamer",
      description: "Mouse gamer 16000 DPI com iluminação RGB",
      price: 159.90,
      stock: 100,
    },
    {
      name: "Monitor 24 Polegadas",
      description: "Monitor Full HD 144Hz",
      price: 1299.99,
      stock: 20,
    },
    {
      name: "Headset Gamer",
      description: "Headset com som surround 7.1",
      price: 249.90,
      stock: 35,
    },
  ];

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true
  })

  console.log('Products seeded')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })