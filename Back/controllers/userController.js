const jwt = require('jsonwebtoken')
const argon2 = require('argon2');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const bodyParser = require('body-parser');


const generateToken = (id) => {
    return jwt.sign({ id }, "szupertitkostitok", { expiresIn: "1d" });
}

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

}

const login = async (req, res) => {
    const { password, username } = req.body
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



    //if(!user) return res.json({message: "Nem létező fiók!"});

    if (!user) {
        return res.json({ error: "Hibás felhasználónév / email cím vagy jelszó!" });
    }



    //passMatch ? res.json({message: "Sikeres bejelentkezés!"}): res.json({message: "Helytelen jelszó!"})
    const passMatch = await argon2.verify(user.password, password);

    if (passMatch) {
        // token --> hitelesítő eszköz --> kulcs
        const token = generateToken(user.id)
        return res.json({
            message: "Sikeres bejelentkezés!",
            username: user.username,
            token
        })
    } else {
        return res.json({
            error: "Helytelen jelszó!"
        });
    }
}
const getMe = (req, res) => {
    res.json(req.user)
}

const elveszettallat = async (req, res) => {
    const userId = req.user.id;
    const {
        allatfaj = "",
        allatkategoria = "",
        mikorveszettel = "",
        feltoltesIdeje = new Date().toISOString(),
        allatneme = "Ismeretlen",
        allatszine = "",
        allatmerete = "",
        egyeb_infok = "",
        eltuneshelyszine = "",
        talalt_elveszett = "",
        chipszam = "0",
    } = req.body;

    // Fájl elérési útja
    const filePath = req.file ? req.file.path : null;

    // Validáció
    if (
        !allatfaj ||
        !mikorveszettel ||
        !eltuneshelyszine
    ) {
        return res.json({ error: "Minden kötelező mezőt ki kell tölteni!"  });
    }

    try {
        // Jelenlegi szerver idő az upload dátumhoz, ha nincs megadva
        const uploadDate = typeof feltoltesIdeje === 'string' 
            ? feltoltesIdeje 
            : new Date().toISOString();
        
        // Új állat létrehozása az adatbázisban
        const newEAnimal = await prisma.animal.create({
            data: {
                allatfaj: allatfaj,
                kategoria: allatkategoria || null, // Opcionális mező
                datum: uploadDate, // Feltöltés időpontja
                elveszesIdeje: mikorveszettel, // Eltűnés időpontja
                neme: allatneme,
                szin: allatszine,
                meret: allatmerete,
                egyeb_info: egyeb_infok || null, // Opcionális mező
                helyszin: eltuneshelyszine,
                visszakerult_e: "false",
                chipszam: BigInt(chipszam), // Konvertáljuk BigInt-té
                userId: userId, // Felhasználó ID-ja kötelezően megadva
                talalt_elveszett: talalt_elveszett || "sajatelveszett",
                filePath: filePath,
            },
        });

        // Konvertáljuk a BigInt értéket stringgé a válasz küldése előtt
        const responseData = {
            ...newEAnimal,
            chipszam: newEAnimal.chipszam.toString(),
            mikorveszettel: mikorveszettel, // Eltűnés időpontja a frontend számára
            feltoltesIdeje: uploadDate // Feltöltés időpontja a frontend számára
        };

        res.json({
            message: "Sikeres adatfelvitel!",
            newEAnimal: responseData,
        });
    } catch (error) {
        console.error("Hiba történt az adatfelvitel során:", error);
        res.status(500).json({ error: "Hiba történt az adatfelvitel során." });
    }
};

const talaltallat = async (req, res) => {
    const userId = req.user.id;
    const {
        allatfaj = "",
        allatkategoria = "",
        mikorveszettel = "",
        feltoltesIdeje = new Date().toISOString(),
        allatneme = "Ismeretlen",
        allatszine = "",
        allatmerete = "",
        egyeb_infok = "",
        eltuneshelyszine = "",
        talalt_elveszett = "",
        chipszam = "0",
    } = req.body;

    // Fájl elérési útja
    const filePath = req.file ? req.file.path : null;

    // Validáció
    if (
        !allatfaj ||
        !eltuneshelyszine
    ) {
        return res.json({ error: "Minden kötelező mezőt ki kell tölteni!"  });
    }

    try {
        // Jelenlegi szerver idő az upload dátumhoz, ha nincs megadva
        const uploadDate = typeof feltoltesIdeje === 'string' 
            ? feltoltesIdeje 
            : new Date().toISOString();
        
        // Új állat létrehozása az adatbázisban
        const newEAnimal = await prisma.animal.create({
            data: {
                allatfaj: allatfaj,
                kategoria: allatkategoria,
                datum: uploadDate, // Feltöltés időpontja
                elveszesIdeje: mikorveszettel, // Megtalálás időpontja
                neme: allatneme,
                szin: allatszine,
                meret: allatmerete,
                egyeb_info: egyeb_infok,
                helyszin: eltuneshelyszine,
                visszakerult_e: "false",
                chipszam: BigInt(chipszam),
                userId: userId,
                talalt_elveszett: talalt_elveszett || "talaltelveszett", 
                filePath: filePath,
            },
        });

        // Konvertáljuk a BigInt értéket stringgé a válasz küldése előtt
        const responseData = {
            ...newEAnimal,
            chipszam: newEAnimal.chipszam.toString(),
            mikorveszettel: mikorveszettel, // Megtalálás időpontja a frontend számára
            feltoltesIdeje: uploadDate // Feltöltés időpontja a frontend számára
        };

        res.json({
            message: "Sikeres adatfelvitel!",
            newEAnimal: responseData,
        });
    } catch (error) {
        console.error("Hiba történt az adatfelvitel során:", error);
        res.status(500).json({ error: "Hiba történt az adatfelvitel során." });
    }
};

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

const osszesallat = async (req, res) => {
    const animals = await prisma.animal.findMany({
        where: {
            NOT: {
                id: 0
            }
        },
        include: {
            user: true // Ez fogja lekérni a hozzá tartozó felhasználó adatait is
        }
    });
    
    // Konvertáljuk a BigInt értékeket stringgé
    const formattedAnimals = animals.map(animal => ({
        ...animal,
        chipszam: animal.chipszam.toString()
    }));
    
    res.json(formattedAnimals);
};

const osszeselveszett = async (req, res) => {
    const animals = await prisma.animal.findMany({
        where: {
            AND: [
                { visszakerult_e: "false" },
                { elutasitva: "false" }, // Csak a kifejezetten jóváhagyott állatokat
                { NOT: { id: 0 } }
            ]
        },
        include: {
            user: true
        }
    });
    
    // Konvertáljuk a BigInt értékeket stringgé
    const formattedAnimals = animals.map(animal => ({
        ...animal,
        chipszam: animal.chipszam.toString()
    }));
    
    res.json(formattedAnimals);
};

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
        console.error("Hiba történt a felhasználó lekérése során:", error);
        res.status(500).json({ error: "Hiba történt a felhasználó lekérése során" });
    }
};

const getAnimalById = async (req, res) => {
    const animalId = parseInt(req.params.id, 10); // Az állat ID-ját kiolvassuk a kérésből

    try {
        // Az állat lekérése az adatbázisból
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
            include: { user: true }, // Ha szükséges, a hozzá tartozó felhasználó adatait is lekérjük
        });

        if (!animal) {
            return res.status(404).json({ error: "Állat nem található!" });
        }

        // Konvertáljuk a BigInt értéket stringgé
        const formattedAnimal = {
            ...animal,
            chipszam: animal.chipszam.toString()
        };

        res.json(formattedAnimal); // Visszaadjuk az állat adatait
    } catch (error) {
        console.error("Hiba történt az állat lekérése során:", error);
        res.status(500).json({ error: "Hiba történt az állat lekérése során" });
    }
};

const deleteAnimal = async (req, res) => {
    const animalId = parseInt(req.params.id, 10); // Az állat ID-ját kiolvassuk a kérésből

    try {
        // Ellenőrizzük, hogy a felhasználó létezik-e
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ error: "Poszt nem található!" });
        }

        // Töröljük a felhasználót
        await prisma.animal.delete({
            where: { id: animalId },
        });

        res.json({ message: "Felhasználó sikeresen törölve!" });
    } catch (error) {
        console.error("Hiba történt a felhasználó törlése során:", error);
        res.status(500).json({ error: "Hiba történt a felhasználó törlése során" });
    }
}

const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        // Ellenőrizzük, hogy a felhasználó létezik-e
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        // Töröljük a felhasználót
        await prisma.user.delete({
            where: { id: userId },
        });

        res.json({ message: "Felhasználó sikeresen törölve!" });
    } catch (error) {
        console.error("Hiba történt a felhasználó törlése során:", error);
        res.status(500).json({ error: "Hiba történt a felhasználó törlése során" });
    }
};

const megtalalltallatok = async (req, res) => {
    const igaz = "true";
    const animals = await prisma.animal.findMany({
        where: { visszakerult_e: igaz },
        include: {
            user: true // Ez fogja lekérni a hozzá tartozó felhasználó adatait is
        }
    });
    
    // Konvertáljuk a BigInt értékeket stringgé
    const formattedAnimals = animals.map(animal => ({
        ...animal,
        chipszam: animal.chipszam.toString()
    }));
    
    res.json(formattedAnimals);
};

const userposts = async (req, res) => {

    try {
        const animals = await prisma.animal.findMany({
            where: { userId: req.user.id },
        });

        if (!animals || animals.length === 0) {
            return res.status(404).json({ error: "Nincsenek posztok!" });
        }

        // Konvertáljuk a BigInt értékeket stringgé
        const formattedAnimals = animals.map(animal => ({
            ...animal,
            chipszam: animal.chipszam.toString()
        }));

        res.json(formattedAnimals);
    } catch (error) {
        console.error("Hiba történt a posztok lekérése során:", error);
        res.status(500).json({ error: "Hiba történt a posztok lekérése során" });
    }
};

const updatelosttofound = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { visszajelzes } = req.body;

    try {
        // 1. Állat keresése
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ error: "Állat nem található!" });
        }

        // 2. Jogosultság ellenőrzése
        if (animal.userId !== userId) {
            return res.status(403).json({ error: "Csak a saját állataidat jelölheted meg megtaláltként!" });
        }

        // 3. Ellenőrizzük, hogy az állat jóváhagyott állapotban van-e
        if (animal.elutasitva !== "false") {
            return res.status(403).json({ 
                error: animal.elutasitva === "" ? 
                    "Jóváhagyásra váró poszt nem jelölhető megtaláltként!" : 
                    "Elutasított poszt nem jelölhető megtaláltként!"
            });
        }

        // 4. Állat státuszának frissítése
        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: {
                visszakerult_e: "true",
                visszajelzes: visszajelzes || ""
            },
        });

        // Konvertáljuk a BigInt értéket stringgé
        const formattedAnimal = {
            ...updatedAnimal,
            chipszam: updatedAnimal.chipszam.toString()
        };

        res.json({
            message: "Állat sikeresen megjelölve megtaláltként!",
            animal: formattedAnimal,
        });
    } catch (error) {
        console.error("Hiba történt az állat frissítése során:", error);
        res.status(500).json({ error: "Hiba történt az állat frissítése során" });
    }
};

const editmyprofile = async (req, res) => {
    console.log("editmyprofile called with data:", req.body); // Hibakereséshez
    const userId = req.user.id; // A bejelentkezett felhasználó ID-ja
    const { username, email, oldPassword, newPassword } = req.body;

    try {
        // Ellenőrizzük, hogy a felhasználó létezik-e
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Felhasználó nem található!" });
        }

        // Jelszó módosítás esetén ellenőrizzük a régi jelszót
        if (oldPassword && newPassword) {
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
        }

        // Felhasználónév és email frissítése
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
        console.error("Hiba történt a profil frissítése során:", error);
        res.status(500).json({ error: "Hiba történt a profil frissítése során" });
    }
};

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

const regAnimal = async (req, res) => {
    try {
        const {
            allatfaj,
            allatkategoria,
            eltunesidopontja,
            chipszam,
            allatneme,
            allatszine,
            allatmerete,
            eltuneshelyszine,
            egyeb_infok,
            user_id,
        } = req.body;

        if (!allatfaj || !eltuneshelyszine || !eltunesidopontja) {
            return res.status(400).json({ message: "Minden kötelező mezőt ki kell tölteni!" });
        }

        const newAnimal = await prisma.elveszettallatok.create({
            data: {
                allatfaj,
                allatkategoria,
                eltunesidopontja,
                chipszam: BigInt(chipszam || 0),
                allatneme,
                allatszine,
                allatmerete,
                eltuneshelyszine,
                egyeb_infok,
                elutasitva: "",
                user_id,
            },
        });

        // Konvertáljuk a BigInt értéket stringgé
        const formattedAnimal = {
            ...newAnimal,
            chipszam: newAnimal.chipszam.toString()
        };

        res.status(201).json(formattedAnimal);
    } catch (error) {
        console.error("Error registering animal:", error);
        res.status(500).json({ message: "Hiba történt az állat regisztrálása során." });
    }
};

const getHappyStories = async (req, res) => {
    try {
        const stories = await prisma.animal.findMany({
            where: {
                visszakerult_e: "true",
                visszajelzes: {
                    not: ""
                }
            },
            include: {
                user: true
            },
            orderBy: {
                datum: 'desc'
            },
            take: 3
        });

        // Konvertáljuk a BigInt értékeket stringgé
        const formattedStories = stories.map(story => ({
            ...story,
            chipszam: story.chipszam.toString()
        }));

        res.json(formattedStories);
    } catch (error) {
        console.error("Hiba történt a történetek lekérése során:", error);
        res.status(500).json({ error: "Hiba történt a történetek lekérése során" });
    }
};

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

const updateAnimal = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const updateData = { ...req.body };
    
    // Remove status field if it exists as it's not in the database schema
    if (updateData.status) {
        delete updateData.status;
    }

    try {
        // Ellenőrizzük, hogy a felhasználó a poszt tulajdonosa-e
        const animal = await prisma.animal.findUnique({
            where: { id: animalId }
        });

        if (!animal) {
            return res.status(404).json({ error: "Poszt nem található" });
        }

        if (animal.userId !== userId) {
            return res.status(403).json({ error: "Nincs jogosultság a poszt szerkesztéséhez" });
        }

        // Csak olyan posztokat lehet szerkeszteni, amelyek nincsenek "megtalálva" állapotban
        if (animal.visszakerult_e === "true") {
            return res.status(403).json({ error: "Megtalált posztok nem szerkeszthetők" });
        }

        // Frissítjük a posztot és beállítjuk a státuszát "függőben" állapotba
        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: {
                ...updateData,
                elutasitva: "", // Frissítés után a poszt újra jóváhagyásra vár
                elutasitasoka: "" // Töröljük az esetleges korábbi elutasítási okot
            }
        });

        // BigInt értékek átalakítása stringgé a válaszban
        const responseData = {
            ...updatedAnimal,
            id: updatedAnimal.id.toString(),
            chipszam: updatedAnimal.chipszam ? updatedAnimal.chipszam.toString() : null
        };

        res.json({ 
            message: "Poszt sikeresen frissítve és jóváhagyásra elküldve", 
            animal: responseData 
        });
    } catch (error) {
        console.error("Hiba a poszt frissítése során:", error);
        res.status(500).json({ error: "Hiba a poszt frissítése során" });
    }
};

const resubmitAnimal = async (req, res) => {
    const userId = req.user.id;
    const animalId = parseInt(req.params.id, 10);

    // Ellenőrizzük, hogy az ID érvényes szám-e
    if (isNaN(animalId)) {
        console.error("Invalid ID:", req.params.id);
        return res.status(400).json({ error: "Érvénytelen azonosító" });
    }

    try {
        console.log("Looking for animal with ID:", animalId);
        
        // Ellenőrizzük, hogy a felhasználó a poszt tulajdonosa-e
        const animal = await prisma.animal.findUnique({
            where: { id: animalId }
        });

        if (!animal) {
            return res.status(404).json({ error: "Poszt nem található" });
        }

        if (animal.userId !== userId) {
            return res.status(403).json({ error: "Nincs jogosultság a poszt újraküldéséhez" });
        }

        // Csak elutasított posztok küldhetők újra
        if (animal.elutasitva !== "true") {
            return res.status(403).json({ error: "Csak elutasított posztok küldhetők újra" });
        }

        // Adatok frissítése a req.body-ból (ha van)
        const updateData = {
            elutasitva: "",
            elutasitasoka: "",
            ...(req.body && Object.keys(req.body).length > 0 ? req.body : {})
        };

        // Ha van új kép feltöltve, frissítsük a filePath-t
        if (req.file) {
            updateData.filePath = `images/${req.file.filename}`;
        }

        // Poszt státuszának frissítése
        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: updateData
        });

        // Konvertáljuk a BigInt értéket stringgé
        const formattedAnimal = {
            ...updatedAnimal,
            id: updatedAnimal.id.toString(),
            chipszam: updatedAnimal.chipszam.toString()
        };

        res.json({ message: "Poszt sikeresen újraküldve", animal: formattedAnimal });
    } catch (error) {
        console.error("Hiba a poszt újraküldése során:", error);
        res.status(500).json({ error: "Hiba a poszt újraküldése során" });
    }
};

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

        // Konvertáljuk a BigInt értékeket stringgé ÉS adjuk vissza a filePath mezőt kep néven is
        const formattedPosts = rejectedPosts.map(post => ({
            ...post,
            chipszam: post.chipszam.toString(),
            kep: post.filePath ? post.filePath.replace(/^images[\\/]/, '') : null
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error("Hiba az elutasított posztok lekérése során:", error);
        res.status(500).json({ error: "Hiba az elutasított posztok lekérése során" });
    }
};

const checkRejectedPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const rejectedPosts = await prisma.animal.findMany({
            where: {
                userId: userId,
                elutasitva: "true"
            }
        });

        res.json({ hasRejectedPosts: rejectedPosts.length > 0 });
    } catch (error) {
        console.error("Hiba az elutasított posztok ellenőrzése során:", error);
        res.status(500).json({ error: "Hiba az elutasított posztok ellenőrzése során" });
    }
};

const getPendingPosts = async (req, res) => {
    const userId = req.user.id;
    try {
        // Get user data to check admin status
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        // Define where condition based on admin status
        let whereCondition = {
            elutasitva: ""
        };
        
        // If user is not an admin, only show their own pending posts
        if (user.admin !== "true") {
            whereCondition.userId = userId;
        }
        
        const pendingPosts = await prisma.animal.findMany({
            where: whereCondition,
            include: {
                user: true
            }
        });
        // BigInt konverzió
        const formattedPosts = pendingPosts.map(post => ({
            ...post,
            chipszam: post.chipszam ? post.chipszam.toString() : null,
            kep: post.filePath ? post.filePath.replace(/^images[\\/]/, '') : null
        }));
        res.json(formattedPosts);
    } catch (error) {
        console.error("Hiba a pending posztok lekérésekor:", error);
        res.status(500).json({ error: "Hiba a pending posztok lekérésekor" });
    }
};

module.exports = {
    register,
    login,
    getAllUser,
    getMe,
    elveszettallat,
    talaltallat,
    osszesallat,
    osszesAdat,
    updateUser,
    getUserById,
    deleteUser,
    getAnimalById,
    deleteAnimal,
    megtalalltallatok,
    userposts,
    osszeselveszett,
    editmyprofile,
    sendMessage,
    getMessages,
    updatePassword,
    updatelosttofound,
    approveAnimal,
    rejectAnimal,
    regAnimal,
    getHappyStories,
    elutasitAnimal,
    updateAnimal,
    resubmitAnimal,
    getRejectedPosts,
    checkRejectedPosts,
    getPendingPosts,
};