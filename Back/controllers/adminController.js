const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Összes adat lekérése
const osszesAdat = async (req, res) => {
    try {
        const { filter } = req.query;
        let whereCondition = {};

        if (filter) {
            switch (filter) {
                case 'approved':
                    whereCondition = { elutasitva: "false" };
                    break;
                case 'pending':
                    whereCondition = { elutasitva: "" };
                    break;
                case 'rejected':
                    whereCondition = { elutasitva: "true" };
                    break;
            }
        }

        const animals = await prisma.animal.findMany({
            where: whereCondition,
            include: { user: true }
        });

        const users = await prisma.user.findMany();

        const formattedAnimals = animals.map(animal => ({
            ...animal,
            chipszam: animal.chipszam.toString()
        }));

        res.json({
            animals: formattedAnimals,
            users: users
        });
    } catch (error) {
        res.status(500).json({ message: "Hiba történt az adatok lekérése során", error });
    }
};

// Poszt jóváhagyása
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

        const formattedAnimal = {
            ...updatedAnimal,
            chipszam: updatedAnimal.chipszam.toString()
        };

        res.json({
            message: "Poszt sikeresen jóváhagyva!",
            animal: formattedAnimal
        });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt a poszt jóváhagyása során" });
    }
};

// Poszt elutasítása
const rejectAnimal = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);
    const { reason } = req.body;

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

        const formattedAnimal = {
            ...updatedAnimal,
            chipszam: updatedAnimal.chipszam.toString()
        };

        res.json({
            message: "Poszt sikeresen elutasítva!",
            animal: formattedAnimal
        });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt a poszt elutasítása során" });
    }
};

// Összes felhasználó lekérése
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

// Felhasználó frissítése
const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { username, email, phonenumber, admin, password } = req.body;

    try {
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
            username,
            email,
            phonenumber,
            admin,
        };

        if (password) {
            const argon2 = require('argon2');
            updateData.password = await argon2.hash(password);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        
        res.json({ message: "Felhasználó adatai frissítve!", updatedUser });
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({ error: "Ez az email cím már használatban van." });
        }
        
        res.status(500).json({ error: "Hiba történt a felhasználó frissítése során" });
    }
};

// Elutasított posztok lekérése
const getRejectedPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const rejectedPosts = await prisma.animal.findMany({
            where: {
                userId: userId,
                elutasitva: "true"
            },
            include: {
                user: true
            }
        });

        const formattedPosts = rejectedPosts.map(post => ({
            ...post,
            chipszam: post.chipszam.toString(),
            kep: post.filePath ? post.filePath.replace(/^images[\\/]/, '') : null
        }));

        res.json(formattedPosts);
    } catch (error) {
        res.status(500).json({ error: "Hiba az elutasított posztok lekérése során" });
    }
};

// Függőben lévő posztok lekérése
const getPendingPosts = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        let whereCondition = {
            elutasitva: ""
        };

        if (user.admin !== "true") {
            whereCondition.userId = userId;
        }

        const pendingPosts = await prisma.animal.findMany({
            where: whereCondition,
            include: {
                user: true
            }
        });

        const formattedPosts = pendingPosts.map(post => ({
            ...post,
            chipszam: post.chipszam ? post.chipszam.toString() : null,
            kep: post.filePath ? post.filePath.replace(/^images[\\/]/, '') : null
        }));

        res.json(formattedPosts);
    } catch (error) {
        res.status(500).json({ error: "Hiba a pending posztok lekérésekor" });
    }
};

module.exports = {
    osszesAdat,
    approveAnimal,
    rejectAnimal,
    getAllUser,
    updateUser,
    getRejectedPosts,
    getPendingPosts
};