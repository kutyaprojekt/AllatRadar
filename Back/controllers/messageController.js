const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Üzenet küldése adminok számára
const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
        return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
    }

    try {
        const sender = await prisma.user.findUnique({
            where: { id: senderId }
        });

        if (!sender || sender.admin !== "true") {
            return res.status(403).json({ error: "Csak adminok küldhetnek üzeneteket!" });
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
        });

        res.json({ message: "Üzenet sikeresen elküldve!", newMessage });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt az üzenet küldése során" });
    }
};

// Felhasználó üzeneteinek lekérése
const getMessages = async (req, res) => {
    const userId = req.user.id;

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: true,
                receiver: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Hiba történt az üzenetek lekérése során" });
    }
};

module.exports = {
    sendMessage,
    getMessages
}; 