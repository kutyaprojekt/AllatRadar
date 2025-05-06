const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Elveszett állat regisztrálása
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

    const filePath = req.file ? req.file.path : null;

    if (
        !allatfaj ||
        !mikorveszettel ||
        !eltuneshelyszine
    ) {
        return res.json({ error: "Minden kötelező mezőt ki kell tölteni!" });
    }

    try {
        const uploadDate = typeof feltoltesIdeje === 'string'
            ? feltoltesIdeje
            : new Date().toISOString();

        const newEAnimal = await prisma.animal.create({
            data: {
                allatfaj: allatfaj,
                kategoria: allatkategoria || null,
                datum: uploadDate,
                elveszesIdeje: mikorveszettel,
                neme: allatneme,
                szin: allatszine,
                meret: allatmerete,
                egyeb_info: egyeb_infok || null,
                helyszin: eltuneshelyszine,
                visszakerult_e: "false",
                chipszam: BigInt(chipszam),
                userId: userId,
                talalt_elveszett: talalt_elveszett || "sajatelveszett",
                filePath: filePath,
            },
        });

        const responseData = {
            ...newEAnimal,
            chipszam: newEAnimal.chipszam.toString(),
            mikorveszettel: mikorveszettel,
            feltoltesIdeje: uploadDate
        };

        res.json({
            message: "Sikeres adatfelvitel!",
            newEAnimal: responseData,
        });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt az adatfelvitel során." });
    }
};

// Talált állat regisztrálása
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

    const filePath = req.file ? req.file.path : null;

    if (
        !allatfaj ||
        !eltuneshelyszine
    ) {
        return res.json({ error: "Minden kötelező mezőt ki kell tölteni!" });
    }

    try {
        const uploadDate = typeof feltoltesIdeje === 'string'
            ? feltoltesIdeje
            : new Date().toISOString();

        const newEAnimal = await prisma.animal.create({
            data: {
                allatfaj: allatfaj,
                kategoria: allatkategoria,
                datum: uploadDate,
                elveszesIdeje: mikorveszettel,
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

        const responseData = {
            ...newEAnimal,
            chipszam: newEAnimal.chipszam.toString(),
            mikorveszettel: mikorveszettel,
            feltoltesIdeje: uploadDate
        };

        res.json({
            message: "Sikeres adatfelvitel!",
            newEAnimal: responseData,
        });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt az adatfelvitel során." });
    }
};

// Összes állat lekérése
const osszesallat = async (req, res) => {
    const animals = await prisma.animal.findMany({
        where: {
            NOT: {
                id: 0
            }
        },
        include: {
            user: true
        }
    });

    const formattedAnimals = animals.map(animal => ({
        ...animal,
        chipszam: animal.chipszam.toString()
    }));

    res.json(formattedAnimals);
};

// Összes elveszett állat lekérése
const osszeselveszett = async (req, res) => {
    const animals = await prisma.animal.findMany({
        where: {
            AND: [
                { visszakerult_e: "false" },
                { elutasitva: "false" },
                { NOT: { id: 0 } }
            ]
        },
        include: {
            user: true
        }
    });

    const formattedAnimals = animals.map(animal => ({
        ...animal,
        chipszam: animal.chipszam.toString()
    }));

    res.json(formattedAnimals);
};

// Állat lekérése ID alapján
const getAnimalById = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);

    try {
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
            include: { user: true },
        });

        if (!animal) {
            return res.status(404).json({ error: "Állat nem található!" });
        }

        const formattedAnimal = {
            ...animal,
            chipszam: animal.chipszam.toString()
        };

        res.json(formattedAnimal);
    } catch (error) {
        res.status(500).json({ error: "Hiba történt az állat lekérése során" });
    }
};

// Állat törlése
const deleteAnimal = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);

    try {
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ error: "Poszt nem található!" });
        }

        await prisma.animal.delete({
            where: { id: animalId },
        });

        res.json({ message: "Poszt sikeresen törölve!" });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt a poszt törlése során" });
    }
};

// Megtalált állatok lekérése
const megtalalltallatok = async (req, res) => {
    const igaz = "true";
    const animals = await prisma.animal.findMany({
        where: { visszakerult_e: igaz },
        include: {
            user: true
        }
    });

    const formattedAnimals = animals.map(animal => ({
        ...animal,
        chipszam: animal.chipszam.toString()
    }));

    res.json(formattedAnimals);
};

// Felhasználó posztjainak lekérése
const userposts = async (req, res) => {
    try {
        const animals = await prisma.animal.findMany({
            where: { userId: req.user.id },
        });

        if (!animals || animals.length === 0) {
            return res.status(404).json({ error: "Nincsenek posztok!" });
        }

        const formattedAnimals = animals.map(animal => ({
            ...animal,
            chipszam: animal.chipszam.toString()
        }));

        res.json(formattedAnimals);
    } catch (error) {
        res.status(500).json({ error: "Hiba történt a posztok lekérése során" });
    }
};

// Elveszett állat megtaláltra állítása
const updatelosttofound = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { visszajelzes } = req.body;

    try {
        const animal = await prisma.animal.findUnique({
            where: { id: animalId },
        });

        if (!animal) {
            return res.status(404).json({ error: "Állat nem található!" });
        }

        if (animal.userId !== userId) {
            return res.status(403).json({ error: "Csak a saját állataidat jelölheted meg megtaláltként!" });
        }

        if (animal.elutasitva !== "false") {
            return res.status(403).json({
                error: animal.elutasitva === "" ?
                    "Jóváhagyásra váró poszt nem jelölhető megtaláltként!" :
                    "Elutasított poszt nem jelölhető megtaláltként!"
            });
        }

        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: {
                visszakerult_e: "true",
                visszajelzes: visszajelzes || ""
            },
        });

        const formattedAnimal = {
            ...updatedAnimal,
            chipszam: updatedAnimal.chipszam.toString()
        };

        res.json({
            message: "Állat sikeresen megjelölve megtaláltként!",
            animal: formattedAnimal,
        });
    } catch (error) {
        res.status(500).json({ error: "Hiba történt az állat frissítése során" });
    }
};

// Állat ismételt beküldése
const resubmitAnimal = async (req, res) => {
    const userId = req.user.id;
    const animalId = parseInt(req.params.id, 10);

    if (isNaN(animalId)) {
        return res.status(400).json({ error: "Érvénytelen azonosító" });
    }

    try {
        const animal = await prisma.animal.findUnique({
            where: { id: animalId }
        });

        if (!animal) {
            return res.status(404).json({ error: "Poszt nem található" });
        }

        if (animal.userId !== userId) {
            return res.status(403).json({ error: "Nincs jogosultság a poszt újraküldéséhez" });
        }

        if (animal.elutasitva !== "true") {
            return res.status(403).json({ error: "Csak elutasított posztok küldhetők újra" });
        }

        const updateData = {
            elutasitva: "",
            elutasitasoka: "",
            ...(req.body && Object.keys(req.body).length > 0 ? req.body : {})
        };

        if (req.file) {
            updateData.filePath = `images/${req.file.filename}`;
        }

        const updatedAnimal = await prisma.animal.update({
            where: { id: animalId },
            data: updateData
        });

        const formattedAnimal = {
            ...updatedAnimal,
            id: updatedAnimal.id.toString(),
            chipszam: updatedAnimal.chipszam.toString()
        };

        res.json({ message: "Poszt sikeresen újraküldve", animal: formattedAnimal });
    } catch (error) {
        res.status(500).json({ error: "Hiba a poszt újraküldése során" });
    }
};

// Állat adatainak frissítése
const updateAnimal = async (req, res) => {
    const animalId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    let updateData = { ...req.body };
    
    // Remove status field if it exists as it's not in the database schema
    if (updateData.status) {
        delete updateData.status;
    }
    
    // Handle chipszam as BigInt if present
    if (updateData.chipszam) {
        try {
            updateData.chipszam = BigInt(updateData.chipszam);
        } catch (error) {
            console.error("Invalid chipszam format:", error);
            updateData.chipszam = BigInt(0); // Default value if conversion fails
        }
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
        
        // Handle file upload if present
        if (req.file) {
            updateData.filePath = req.file.path;
        }

        console.log("Updating animal with data:", updateData);
        
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
        res.status(500).json({ error: "Hiba a poszt frissítése során: " + error.message });
    }
};

// Happy stories lekérése (sikertörténetek)
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

        const formattedStories = stories.map(story => ({
            ...story,
            chipszam: story.chipszam.toString()
        }));

        res.json(formattedStories);
    } catch (error) {
        res.status(500).json({ error: "Hiba történt a történetek lekérése során" });
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
    getHappyStories
};