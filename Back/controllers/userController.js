const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bodyParser = require('body-parser');

// JWT token generálás
const generateToken = (id) => {
    return jwt.sign({ id }, "szupertitkostitok", { expiresIn: "1d" });
};

// Bejelentkezett felhasználó adatainak lekérése
const getMe = (req, res) => {
    res.json(req.user);
};

// Felhasználó lekérése ID alapján
const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Hiba történt a felhasználó lekérése során" });
    }
};

// Felhasználó törlése
const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { animals: true } // Include related animals
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }
        
        // Delete the user (with cascade delete handling related records)
        await prisma.user.delete({
            where: { id: userId },
        });

        res.json({ message: "Felhasználó sikeresen törölve!" });
    } catch (error) {
        console.error("Deletion error:", error);
        res.status(500).json({ error: "Hiba történt a felhasználó törlése során", details: error.message });
    }
};

// Saját profil szerkesztése
const editmyprofile = async (req, res) => {
    const userId = req.user.id;
    const { username, email, oldPassword, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        if (oldPassword && newPassword) {
            const isPasswordValid = await argon2.verify(user.password, oldPassword);
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Hibás régi jelszó!" });
            }

            const hashedPassword = await argon2.hash(newPassword);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username: username || user.username,
                email: email || user.email,
            },
        });

        res.json({
            message: "Profil sikeresen frissítve!",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt a profil frissítése során" });
    }
};

// Jelszó frissítése
const updatePassword = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        const isPasswordValid = await argon2.verify(user.password, oldPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Hibás régi jelszó!" });
        }

        const hashedPassword = await argon2.hash(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.json({ message: "Jelszó sikeresen frissítve!" });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt a jelszó frissítése során" });
    }
};

module.exports = {
    generateToken,
    getMe,
    getUserById,
    deleteUser,
    editmyprofile,
    updatePassword
};