const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Elveszett állat hirdetés létrehozása
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Talált állat hirdetés létrehozása
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Összes állat lekérése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Összes elveszett állat lekérése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Állat lekérése ID alapján
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Állat törlése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
const deleteAnimal = async (req, res) => {
    const animalId = parseInt(req.params.id, 10); // Az állat ID-ját kiolvassuk a kérésből

    try {
        // Ellenőrizzük, hogy az állat létezik-e
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ error: "Poszt nem található!" });
        }

        // Töröljük az állatot
        await prisma.animal.delete({
            where: { id: animalId },
        });

        res.json({ message: "Poszt sikeresen törölve!" });
    } catch (error) {
        console.error("Hiba történt a poszt törlése során:", error);
        res.status(500).json({ error: "Hiba történt a poszt törlése során" });
    }
};

/**
 * Megtalált állatok lekérése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Felhasználó posztjainak lekérése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Elveszett állat megtaláltra állítása
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Állat újraküldése jóváhagyásra
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Állat hirdetés frissítése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Happy stories lekérése (sikertörténetek)
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Elutasított posztok lekérése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Van-e elutasított posztja a felhasználónak
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Függőben lévő posztok lekérése
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

/**
 * Állat regisztrálása (külön funkció)
 * @param {Object} req Kérés objektum
 * @param {Object} res Válasz objektum
 */
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

module.exports = {
    elveszettallat,
    talaltallat,
    osszesallat,
    osszeselveszett,
    getAnimalById,
    deleteAnimal,
    megtalalltallatok,
    userposts,
    updatelosttofound,
    resubmitAnimal,
    updateAnimal,
    getHappyStories,
    getRejectedPosts,
    checkRejectedPosts,
    getPendingPosts,
    regAnimal
}; 