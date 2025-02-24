const fs = require('fs');
const path = require('path');
const { session } = require('electron');

// Définir le chemin pour enregistrer les requêtes dans le dossier courant
const currentDirPath = path.join(__dirname, 'captured_requests.json');

// Si le fichier n'existe pas, le créer avec une structure vide
if (!fs.existsSync(currentDirPath)) {
  fs.writeFileSync(currentDirPath, JSON.stringify([]));
}

// Écouter toutes les requêtes terminées
session.defaultSession.webRequest.onCompleted({ urls: ['*://*/*'] }, (details) => {
  const requestInfo = {
    time: new Date().toISOString(),
    url: details.url,
    method: details.method,
    statusCode: details.statusCode,
    payload: details.uploadData ? details.uploadData.map(d => Buffer.from(d.bytes).toString()) : 'No payload'
  };

  console.log("Captured Request:", requestInfo);

  // Lire les données existantes
  let existingData = [];
  if (fs.existsSync(currentDirPath)) {
    existingData = JSON.parse(fs.readFileSync(currentDirPath));
  }

  // Ajouter la nouvelle requête capturée
  existingData.push(requestInfo);

  // Écrire à nouveau dans le fichier
  fs.writeFileSync(currentDirPath, JSON.stringify(existingData, null, 2));
});

console.log("Request capturing started. Saving data in 'captured_requests.json'.");
module.exports = require('./core.asar');
