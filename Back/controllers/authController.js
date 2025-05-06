const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// JWT token generálás felhasználó azonosításhoz
const generateToken = (id) => {
    return jwt.sign({ id }, "szupertitkostitok", { expiresIn: "1d" });
};

// Felhasználó regisztráció
const register = async (req, res) => {
    const { username, email, password, password2, phonenumber } = req.body;

    if (!username) { return res.json({ error: "Felhasználónév megadása kötelező" }); }
    if (!email) { return res.json({ error: "Email cím megadása kötelező" }); }
    if (!password || !password2) { return res.json({ error: "Mind 2 jelszó megadása kötelező" }); }
    if (!phonenumber) { return res.json({ error: "Telefonszám megadása kötelező" }); }

    if (phonenumber.length > 15) {
        return res.json({ error: "A telefonszám nem lehet hosszabb 15 karakternél" });
    }

    if (password != password2) {
        return res.json({ error: "A két jelszó nem egyezik!" });
    }

    const vusername = await prisma.user.findFirst({
        where: {
            username: username,
        }
    });

    if (vusername) {
        return res.json({ error: "Felhasználónév már használatban!" });
    }

    const vemail = await prisma.user.findFirst({
        where: {
            email: email,
        }
    });

    if (vemail) {
        return res.json({ error: "Email-cím már használatban!" });
    }

    const telvane = await prisma.user.findFirst({
        where: {
            phonenumber: phonenumber,
        }
    });

    if (telvane) {
        return res.json({ error: "Telefonszám már használatban!" });
    }

    const hash = await argon2.hash(password);

    const newuser = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hash,
            phonenumber: phonenumber
        }
    });

    res.json({
        message: "Sikeres regisztráció!",
        success: true,
        newuser
    });
};

// Felhasználó bejelentkezés
const login = async (req, res) => {
    const { password, username } = req.body;
    
    if (!username || !password) {
        return res.json({ error: "Felhasználónév / Email és jelszó megadása kötelező!" });
    }
    let user;

    if (username.includes('@')) {
        user = await prisma.user.findFirst({
            where: {
                email: username
            }
        });
    } else {
        user = await prisma.user.findFirst({
            where: {
                username: username
            }
        });
    }

    if (!user) {
        return res.json({ error: "Hibás felhasználónév / email cím vagy jelszó!" });
    }

    const passMatch = await argon2.verify(user.password, password);

    if (passMatch) {
        const token = generateToken(user.id);
        return res.json({
            message: "Sikeres bejelentkezés!",
            username: user.username,
            token
        });
    } else {
        return res.json({
            error: "Helytelen jelszó!"
        });
    }
};

// Jelenlegi felhasználó adatok lekérése
const getMe = (req, res) => {
    res.json(req.user);
};

// Jelszó frissítés
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
    register,
    login,
    getMe,
    updatePassword
};