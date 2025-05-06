const express = require('express');
const router = express.Router();
const {protect} = require('../mwares/authMiddleware');
const multer = require("multer");

// Import controllers
const {
    getMe,
    getUserById,
    deleteUser,
    editmyprofile,
    updatePassword
} = require('../controllers/userController');

const {
    register,
    login
} = require('../controllers/authController');

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
    getHappyStories,
    getRejectedPosts,
    getPendingPosts
} = require('../controllers/animalController');

const {
    osszesAdat,
    updateUser,
    getAllUser,
    approveAnimal,
    rejectAnimal
} = require('../controllers/adminController');

const {
    getMessages,
    sendMessage
} = require('../controllers/messageController');


// Multer konfiguráció
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./images"); // A feltöltött fájlok mentési helye
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`); // Fájlnév konfiguráció
    },
  });
  
const upload = multer({ storage });
  
// Auth routes
router.post("/regisztracio", register);
router.post("/login", login);

// Animal routes
router.post("/elveszettallat", protect, upload.single("file"), elveszettallat);
router.post("/talaltallat", protect, upload.single("file"), talaltallat);
router.get("/osszeselveszett", osszeselveszett);
router.get("/allatok/:id", getAnimalById);
router.get("/megtalaltallatok", megtalalltallatok); 
router.get("/posztjaim", protect, userposts);
router.delete("/allatok/:id", deleteAnimal);
router.patch('/losttofound/:id', protect, updatelosttofound);
router.put('/allatok/:id', protect, updateAnimal);
router.post('/allatok/:id/resubmit', protect, upload.single("kep"), resubmitAnimal);
router.get('/rejected-posts', protect, getRejectedPosts);
router.get('/pending-posts', protect, getPendingPosts);
router.get("/happy-stories", getHappyStories);

// User routes
router.get("/me", protect, getMe);
router.get("/felhasznalok/:id", protect, getUserById);
router.get("/profilom", protect, getMe);
router.patch("/:id/update-password", updatePassword);
router.post("/editmyprofile", protect, editmyprofile);
router.delete("/felhasznalok/:id", deleteUser);

// Admin routes
router.get("/alluser", protect, getAllUser);
router.get("/adminusers", protect, osszesAdat);
router.get("/adminposts", osszesAdat);
router.patch("/:id", updateUser);
router.patch("/allatok/:id/approve", protect, approveAnimal);
router.put("/allatok/:id/elutasit", protect, rejectAnimal);

// Message routes
router.get('/get-messages', protect, getMessages);
router.post('/send-message', protect, sendMessage); // Add this new route for sending messages

module.exports = router