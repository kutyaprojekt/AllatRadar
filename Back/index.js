const express = require("express");
const userRoutes = require('./routes/userRoutes');
const cors = require("cors");
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const profilePictureRoutes = require('./routes/profilePictureRoutes'); 
const path = require('path');
const app = express();

// Content Security Policy konfiguráció
app.use(expressCspHeader({ 
    policies: { 
        'default-src': [SELF], 
        'img-src': ['data:', 'images.com', 'localhost'],
        'favicon': ['localhost'],
    } 
}));
  
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('images'));
app.use('/felhasznalok', userRoutes);
app.use('/profile-picture', profilePictureRoutes);

// Statikus fájlok kiszolgálása
app.use('/static', express.static(path.join(__dirname, 'public')));

// API státusz végpont
app.get('/api', (req, res) => {
  res.json({
    status: 'API is working',
    message: 'Welcome to AllatRadar API!'
  });
});

// Főoldal végpont
app.get("/", (req, res) => {
    res.json({message: "Felhasznalok projekt"});
});

// Szerver indítása
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Az AllatRadar fut a ${PORT} porton`);
});