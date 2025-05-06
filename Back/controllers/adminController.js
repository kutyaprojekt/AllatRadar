const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

/**
 * Összes adat lekérése adminok számára, opcionális szűrővel
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const osszesAdat = async (req, res) => {
    try {
        const { filter } = req.query; // Szűrő paraméter lekérése

        // Alap where feltétel
        let whereCondition = {};

        // Szűrés a státusz alapján
        if (filter) {
            switch (filter) {
                case 'approved':
                    whereCondition = {
                        elutasitva: "false"
                    };
                    break;
                case 'pending':
                    whereCondition = {
                        elutasitva: ""
                    };
                    break;
                case 'rejected':
                    whereCondition = {
                        elutasitva: "true"
                    };
                    break;
                default:
                    // Ha nincs szűrés, akkor minden állatot visszaadjuk
                    break;
            }
        }

        // Lekérdezzük az állatokat a szűrési feltétellel
        const animals = await prisma.animal.findMany({
            where: whereCondition,
            include: {
                user: true
            }
        });

        // Lekérdezzük az összes felhasználót
        const users = await prisma.user.findMany();

        // Konvertáljuk a BigInt értékeket stringgé
        const formattedAnimals = animals.map(animal => ({
            ...animal,
            chipszam: animal.chipszam.toString()
        }));

        // Összeállítjuk a választ
        const response = {
            animals: formattedAnimals,
            users: users
        };

        res.json(response);
    } catch (error) {
        console.error("Hiba történt az adatok lekérése során:", error);
        res.status(500).json({ message: "Hiba történt az adatok lekérése során", error });
    }
};

/**
 * Poszt jóváhagyása
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const approveAnimal = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);

    try {
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ error: "Állat nem található!" });
        }

        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: {
                elutasitva: "false",
                elutasitasoka: ""
            },
        });

        // Konvertáljuk a BigInt értéket stringgé
        const formattedAnimal = {
            ...updatedAnimal,
            chipszam: updatedAnimal.chipszam.toString()
        };

        res.json({
            message: "Poszt sikeresen jóváhagyva!",
            animal: formattedAnimal
        });
    } catch (error) {
        console.error("Hiba történt a poszt jóváhagyása során:", error);
        res.status(500).json({ error: "Hiba történt a poszt jóváhagyása során" });
    }
};

/**
 * Poszt elutasítása
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const rejectAnimal = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);
    const { reason, message } = req.body;

    if (!reason) {
        return res.status(400).json({ error: "Elutasítási ok megadása kötelező!" });
    }

    try {
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ error: "Állat nem található!" });
        }

        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: {
                elutasitva: "true",
                elutasitasoka: reason
            },
        });

        // Konvertáljuk a BigInt értéket stringgé
        const formattedAnimal = {
            ...updatedAnimal,
            chipszam: updatedAnimal.chipszam.toString()
        };

        res.json({
            message: "Poszt sikeresen elutasítva!",
            animal: formattedAnimal
        });
    } catch (error) {
        console.error("Hiba történt a poszt elutasítása során:", error);
        res.status(500).json({ error: "Hiba történt a poszt elutasítása során" });
    }
};

/**
 * Állat elutasítása üzenettel
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const elutasitAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, message } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Nincs jogosultság" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!admin || admin.admin !== "true") {
            return res.status(403).json({ error: "Nincs admin jogosultság" });
        }

        const animal = await prisma.animal.findUnique({
            where: { id: parseInt(id) },
            include: { user: true }
        });

        if (!animal) {
            return res.status(404).json({ error: "Állat nem található" });
        }

        // Állat elutasítása
        const updatedAnimal = await prisma.animal.update({
            where: { id: parseInt(id) },
            data: {
                elutasitva: "true",
                elutasitasoka: reason
            }
        });

        // Üzenet létrehozása a felhasználónak
        await prisma.message.create({
            data: {
                content: `Az állatod elutasításra került. Ok: ${reason}${message ? `\n\nTovábbi megjegyzés: ${message}` : ''}`,
                senderId: admin.id,
                receiverId: animal.userId
            }
        });

        res.json(updatedAnimal);
    } catch (error) {
        console.error("Hiba az állat elutasítása során:", error);
        res.status(500).json({ error: "Hiba az állat elutasítása során" });
    }
};

/**
 * Összes felhasználó lekérése (admin)
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const getAllUser = async (req, res) => {
    const users = await prisma.user.findMany({
        where: {
            NOT: {
                id: req.user.id
            }
        }
    });
    res.json(users);
};

/**
 * Felhasználó frissítése (admin)
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10); // Felhasználó ID-ja
    const { username, email, phonenumber, admin, password } = req.body;

    try {
        // Ellenőrizzük, hogy létezik-e már ilyen email más felhasználónál
        if (email) {
            const existingUserWithEmail = await prisma.user.findFirst({
                where: {
                    email: email,
                    NOT: {
                        id: userId
                    }
                }
            });

            if (existingUserWithEmail) {
                return res.status(400).json({ error: "Ez az email cím már használatban van." });
            }
        }

        const updateData = {
            username: username,
            email: email,
            phonenumber: phonenumber,
            admin: admin,
        };

        if (password) {
            const argon2 = require('argon2');
            updateData.password = await argon2.hash(password);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        res.json({ message: "Felhasználó adatai frissítve!", updatedUser }); // JSON válasz
    } catch (error) {
        console.error("Hiba történt a felhasználó frissítése során:", error);
        
        // Check for unique constraint error
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({ error: "Ez az email cím már használatban van." });
        }
        
        res.status(500).json({ error: "Hiba történt a felhasználó frissítése során" }); // JSON válasz
    }
};

module.exports = {
    osszesAdat,
    approveAnimal,
    rejectAnimal,
    elutasitAnimal,
    getAllUser,
    updateUser
}; 