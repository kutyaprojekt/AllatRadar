const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Generál egy JWT tokent a felhasználó azonosításához
 * @param {number} id A felhasználó azonosítója
 * @returns {string} JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, "szupertitkostitok", { expiresIn: "1d" });
};

/**
 * Felhasználó regisztrációja
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const register = async (req, res) => {
    const { username, email, password, password2, phonenumber } = req.body;

    //Bekért adatok validálása
    if (!username) { return res.json({ error: "Felhasználónév megadása kötelező" }); }
    if (!email) { return res.json({ error: "Email cím megadása kötelező" }); }
    if (!password || !password2) { return res.json({ error: "Mind 2 jelszó megadása kötelező" }); }
    if (!phonenumber) { return res.json({ error: "Telefonszám megadása kötelező" }); }

    // Telefonszám hosszának ellenőrzése
    if (phonenumber.length > 15) {
        return res.json({ error: "A telefonszám nem lehet hosszabb 15 karakternél" });
    }

    if (password != password2) {
        return res.json({ error: "A két jelszó nem egyezik!" });
    }

    /////////////////////         USERNAME VAN-E             ////////////////////////////////
    const vusername = await prisma.user.findFirst({
        where: {
            username: username,
        }
    });

    if (vusername) {
        return res.json({ error: "Felhasználónév már használatban!" });
    }
    ////////////////////////////////////////////////////////////////////////////////////    

    /////////////////////         EMAIL VAN-E             ////////////////////////////////
    const vemail = await prisma.user.findFirst({
        where: {
            email: email,
        }
    });

    if (vemail) {
        return res.json({ error: "Email-cím már használatban!" });
    }
    ////////////////////////////////////////////////////////////////////////////////////

    /////////////////////         TELEFONSZAM VAN-E             ////////////////////////////////
    const telvane = await prisma.user.findFirst({
        where: {
            phonenumber: phonenumber,
        }
    });

    if (telvane) {
        return res.json({ error: "Telefonszám már használatban!" });
    }
    ////////////////////////////////////////////////////////////////////////////////////    

    //////// JELSZO TITKOSITAS ///////////////
    const hash = await argon2.hash(password);
    //////////////////////////////////////////

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
        newuser
    });
};

/**
 * Felhasználó bejelentkezése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const login = async (req, res) => {
    const { password, username } = req.body;
    // procedurális email validálás
    if (!username || !password) {
        return res.json({ error: "Felhasználónév / Email és jelszó megadása kötelező!" });
    }
    console.log("username, password");
    let user;

    if (username.includes('@')) {
        // Ha az 'username' email formátumú, akkor email cím alapján keresünk
        user = await prisma.user.findFirst({
            where: {
                email: username
            }
        });
    } else {
        // Ha nem email, akkor felhasználónév alapján keresünk
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
        // token --> hitelesítő eszköz --> kulcs
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

/**
 * Jelenlegi felhasználó adatainak lekérése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const getMe = (req, res) => {
    res.json(req.user);
};

/**
 * Jelszó frissítése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const updatePassword = async (req, res) => {
    const userId = parseInt(req.params.id, 10); // Felhasználó ID-ja
    const { oldPassword, newPassword } = req.body;

    try {
        // Ellenőrizzük, hogy a felhasználó létezik-e
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        // Ellenőrizzük a régi jelszót
        const isPasswordValid = await argon2.verify(user.password, oldPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Hibás régi jelszó!" });
        }

        // Új jelszó titkosítása
        const hashedPassword = await argon2.hash(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.json({ message: "Jelszó sikeresen frissítve!" }); // JSON válasz
    } catch (error) {
        console.error("Hiba történt a jelszó frissítése során:", error);
        res.status(500).json({ error: "Hiba történt a jelszó frissítése során" }); // JSON válasz
    }
};

// Exportáljuk a függvényeket
module.exports = {
    generateToken,
    register,
    login,
    getMe,
    updatePassword
}; 