const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            const idFromToken = jwt.verify(token, "szupertitkostitok").id
            req.user = await prisma.user.findFirst({
                where: {
                    id: idFromToken
                }
            });
            next();   
        } catch (error) {
            res.status(401).json({error: "Jelentkezzen be!"});
        }
    }

    if(!token){
        res.status(401).json({message: "Jelentkezzen be!"});
    }
}

module.exports = {
    protect
}