const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../mwares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Multer tárhely konfiguráció
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './images';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
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
        const filePath = `images/${req.file.filename}`;

        // Profilkép elérési út mentése adatbázisba
        await prisma.user.update({
            where: { id: userId },
            data: { profilePicture: filePath },
        });

        res.json({
            message: 'Profilkép sikeresen frissítve!',
            filePath: filePath,
        });
    } catch (error) {
        res.status(500).json({ error: 'Hiba történt a profilkép feltöltése során' });
    }
});

// Profilkép törlése
router.delete('/delete-profile-picture', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Felhasználó profilkép ellenőrzése
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.profilePicture) {
            return res.status(404).json({ error: 'Nincs profilkép a törléshez!' });
        }

        // Fájl törlése a szerverről
        fs.unlinkSync(user.profilePicture);

        // Profilkép referencia törlése az adatbázisból
        await prisma.user.update({
            where: { id: userId },
            data: { profilePicture: null },
        });

        res.json({
            message: 'Profilkép sikeresen törölve!',
        });
    } catch (error) {
        res.status(500).json({ error: 'Hiba történt a profilkép törlése során' });
    }
});

module.exports = router;