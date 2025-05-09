# AllatRadar 🐾

## 📖 Projektről

Az AllatRadar egy olyan webalkalmazás, amely segít az állattulajdonosoknak megtalálni elveszett kisállataikat és jelenteni a talált állatokat. A platform lehetővé teszi a felhasználók számára a regisztrációt, elveszett vagy talált állat hirdetések létrehozását, és a kapcsolatfelvételt másokkal, hogy újraegyesíthessék a kisállatokat gazdáikkal.

## ✨ Funkciók

- 🔐 Felhasználói regisztráció és bejelentkezés
- 🐶 Elveszett vagy talált állatok regisztrálása részletes adatokkal
- 🔍 Keresési és szűrési lehetőségek
- 💬 Értesítési rendszer
- 👤 Felhasználói profil kezelés
- 📱 Reszponzív dizájn (mobil, tablet és asztali eszközökre)
- 👑 Admin funkciók a bejegyzések és felhasználók kezeléséhez

## 🛠️ Technológiák

### Backend
- **Node.js** és **Express** - API szerver
- **Prisma** - ORM adatbázis műveletekhez
- **SQLite** - Adatbázis
- **JWT** - Felhasználói hitelesítés
- **Multer** - Képfeltöltés kezelése

### Frontend
- **React** - Frontend keretrendszer
- **Vite** - Fejlesztői eszköz
- **React Router** - Kliens oldali routing
- **Tailwind CSS** - Stíluskezelés
- **Axios** - HTTP kérések
- **React Toastify** - Felhasználói értesítések

## 🚀 Telepítés és használat

### Előfeltételek
- Node.js (v16 vagy magasabb)
- npm

### Telepítés

1. Klónozd a repository-t
```bash
git clone https://github.com/kutyaprojekt/AllatRadar.git
cd AllatRadar
```

### Backend beállítása

```bash
cd Back
npm install
npx prisma generate
npm start
```

A backend a http://localhost:8000 címen fog futni.

### Frontend beállítása

```bash
cd Front
npm install
npm run dev
```

A frontend a http://localhost:5173 címen fog futni.

## 📊 Adatbázis struktúra

Az alkalmazás SQLite adatbázist használ a következő fő entitásokkal:

- **User** - Felhasználói adatok
- **Animal** - Állat hirdetések adatai
- **Message** - Felhasználók közötti üzenetek

## 👩‍💻 Fejlesztési útmutató

### Backend API végpontok

- `GET /felhasznalok` - Összes felhasználó lekérése
- `POST /felhasznalok/register` - Új felhasználó regisztrálása
- `POST /felhasznalok/login` - Bejelentkezés
- `GET /felhasznalok/animals` - Állatok lekérése
- `POST /felhasznalok/animals` - Új állat hirdetés létrehozása

További API végpontok a kódban találhatók.

### Frissítések telepítése

```bash
cd Back && npm update
cd ../Front && npm update
```
