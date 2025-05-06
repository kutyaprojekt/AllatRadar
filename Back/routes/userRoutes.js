const express = require('express');
const router = express.Router();
const {protect} = require('../mwares/authMiddleware');
const multer = require("multer");

// Felhasználó controller importálás
const {
    getMe,
    getUserById,
    deleteUser,
    editmyprofile,
    updatePassword
} = require('../controllers/userController');

// Autentikáció controller importálás
const {
    register,
    login
} = require('../controllers/authController');

// Állat controller importálás
const {
    elveszettallat,
    talaltallat,
    osszesallat,
    getAnimalById,
    deleteAnimal,
    megtalalltallatok,
    userposts,
    osszeselveszett,
    updatelosttofound,
    updateAnimal,
    resubmitAnimal,
    getHappyStories
} = require('../controllers/animalController');

// Admin controller importálás
const {
    osszesAdat,
    updateUser,
    getAllUser,
    approveAnimal,
    rejectAnimal,
    getPendingPosts,
    getRejectedPosts
} = require('../controllers/adminController');

// Üzenet controller importálás
const {
    getMessages,
    sendMessage
} = require('../controllers/messageController');

// Multer tárhely konfiguráció
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./images");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });
  
const upload = multer({ storage });
  
// Autentikációs útvonalak
router.post("/regisztracio", register);
router.post("/login", login);

// Állat kezelési útvonalak
router.post("/elveszettallat", protect, upload.single("file"), elveszettallat);
router.post("/talaltallat", protect, upload.single("file"), talaltallat);
router.get("/osszeselveszett", osszeselveszett);
router.get("/allatok/:id", getAnimalById);
router.get("/megtalaltallatok", megtalalltallatok); 
router.get("/posztjaim", protect, userposts);
router.delete("/allatok/:id", deleteAnimal);
router.patch('/losttofound/:id', protect, updatelosttofound);
router.put('/allatok/:id', protect, upload.single("kep"), updateAnimal);
router.post('/allatok/:id/resubmit', protect, upload.single("kep"), resubmitAnimal);
router.get('/rejected-posts', protect, getRejectedPosts);
router.get('/pending-posts', protect, getPendingPosts);
router.get("/happy-stories", getHappyStories);

// Felhasználó kezelési útvonalak
router.get("/me", protect, getMe);
router.get("/felhasznalok/:id", protect, getUserById);
router.get("/profilom", protect, getMe);
router.patch("/:id/update-password", updatePassword);
router.post("/editmyprofile", protect, editmyprofile);
router.delete("/felhasznalok/:id", deleteUser);

// Admin útvonalak
router.get("/alluser", protect, getAllUser);
router.get("/adminusers", protect, osszesAdat);
router.get("/adminposts", osszesAdat);
router.patch("/:id", updateUser);
router.patch("/allatok/:id/approve", protect, approveAnimal);
router.put("/allatok/:id/elutasit", protect, rejectAnimal);

// Üzenet kezelési útvonalak
router.get('/get-messages', protect, getMessages);
router.post('/send-message', protect, sendMessage);

module.exports = router