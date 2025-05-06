const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../mwares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Multer konfiguráció
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './images';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir); // Hozza létre a mappát, ha nem létezik
        }
        cb(null, dir); // A feltöltött fájlok mentési helye
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`); // Fájlnév konfiguráció
    },
});

const upload = multer({ storage });

// Profilkép feltöltése
router.post('/upload-profile-picture', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nincs fájl feltöltve!' });
        }

        const userId = req.user.id;
        const filePath = `images/${req.file.filename}`; // Relatív elérési út

        console.log('Feltöltött fájl:', req.file); // Ellenőrizd a konzolon

        // Mentés az adatbázisba
        await prisma.user.update({
            where: { id: userId },
            data: { profilePicture: filePath },
        });

        res.json({
            message: 'Profilkép sikeresen frissítve!',
            filePath: filePath, // Relatív elérési út
        });
    } catch (error) {
        console.error('Hiba történt a profilkép feltöltése során:', error);
        res.status(500).json({ error: 'Hiba történt a profilkép feltöltése során' });
    }
});

// Profilkép törlése
router.delete('/delete-profile-picture', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Ellenőrizzük, hogy a felhasználónak van-e profilképje
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.profilePicture) {
            return res.status(404).json({ error: 'Nincs profilkép a törléshez!' });
        }

        // Töröljük a fájlt a szerverről
        fs.unlinkSync(user.profilePicture);

        // Frissítsük a felhasználó profilképét az adatbázisban
        await prisma.user.update({
            where: { id: userId },
            data: { profilePicture: null },
        });

        res.json({
            message: 'Profilkép sikeresen törölve!',
        });
    } catch (error) {
        console.error('Hiba történt a profilkép törlése során:', error);
        res.status(500).json({ error: 'Hiba történt a profilkép törlése során' });
    }
});

module.exports = router;