const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Üzenet küldése felhasználónak (adminok számára)
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.id; // A bejelentkezett felhasználó ID-ja

    if (!receiverId || !content) {
        return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
    }

    try {
        // Ellenőrizzük, hogy a küldő admin-e
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
        console.error("Hiba történt az üzenet küldése során:", error);
        res.status(500).json({ error: "Hiba történt az üzenet küldése során" });
    }
};

/**
 * Felhasználó üzeneteinek lekérése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const getMessages = async (req, res) => {
    const userId = req.user.id; // A bejelentkezett felhasználó ID-ja

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId }, // Az általa küldött üzenetek
                    { receiverId: userId }, // Az általa kapott üzenetek
                ],
            },
            include: {
                sender: true, // A küldő felhasználó adatai
                receiver: true, // A címzett felhasználó adatai
            },
            orderBy: {
                createdAt: 'desc', // Legújabb üzenetek elöl
            },
        });

        res.json(messages);
    } catch (error) {
        console.error("Hiba történt az üzenetek lekérése során:", error);
        res.status(500).json({ error: "Hiba történt az üzenetek lekérése során" });
    }
};

module.exports = {
    sendMessage,
    getMessages
}; 