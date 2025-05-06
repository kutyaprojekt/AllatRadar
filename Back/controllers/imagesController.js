const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const getPicture = async (req, res) => {
    // http://localhost:8000/images
    const allat = await prisma.animal.findFirst(
        {
            where: {
                id: 1
            }
        }
    );

    res.json(
        {
            imageurl: "http://localhost:8000/images"+allat.filePath
        }
    )

}