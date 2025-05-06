-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "admin" TEXT NOT NULL DEFAULT 'false',
    "profilePicture" TEXT
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "talalt_elveszett" TEXT NOT NULL,
    "allatfaj" TEXT NOT NULL,
    "kategoria" TEXT,
    "datum" TEXT NOT NULL,
    "elveszesIdeje" TEXT,
    "neme" TEXT NOT NULL DEFAULT 'Ismeretlen',
    "szin" TEXT NOT NULL,
    "meret" TEXT NOT NULL,
    "egyeb_info" TEXT,
    "helyszin" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "visszakerult_e" TEXT NOT NULL,
    "chipszam" BIGINT,
    "elutasitva" TEXT NOT NULL DEFAULT '',
    "elutasitasoka" TEXT NOT NULL DEFAULT '',
    "visszajelzes" TEXT NOT NULL DEFAULT '',
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
