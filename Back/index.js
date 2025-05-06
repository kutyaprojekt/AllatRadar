const express = require("express");
const userRoutes = require('./routes/userRoutes');
const cors = require("cors");
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const profilePictureRoutes = require('./routes/profilePictureRoutes'); 
const path = require('path');
const app = express();
// other app.use() options ...
app.use(expressCspHeader({ 
    policies: { 
        'default-src': [SELF], 
        'img-src': ['data:', 'images.com', 'localhost'],  // Engedélyezd a képek betöltését localhostról
        'favicon': ['localhost'],  // Engedélyezd a favicon.ico betöltését
    } 
}));
  

app.use(cors());
app.use(express.json())
app.use("/felhasznalok", userRoutes); 
app.use('/api', profilePictureRoutes); // Új útvonal a profilkép kezeléséhez
//http://localhost:8000/images/1737928685866_kutyageci.jpg
app.use('/images', express.static(path.join(__dirname, 'images')));


app.listen(8000, () => {
    console.log("Fut a szerver")
});

app.get("/", (req, res) => {
    res.json({message: "Felhasznalok projekt"});
});

// 1. ellenőrizzük az adatokat
// 2. csekkolom, hogy van-e már ilyen felhasználó
// 3. titkosítom a jelszavakat, (hash)
// 4. regisztál a felhasználó

// login
// 1. validálás
// 2. megnézzük, hogy létezik-e a bejelentkezni kívánó felhasználó az adatbázisban
// 3. jelszó helyessége
// 4. authentikációs eszköz --> hitelesítő eszköz visszaküldése --> jwt token