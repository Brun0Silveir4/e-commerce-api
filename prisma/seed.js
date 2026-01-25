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
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })