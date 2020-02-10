require("dotenv").config();

const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = process.env.KEY;
const iv = crypto.randomBytes(Number(process.env.IV));

module.exports = {
  encypt: text => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  },

  decrypt: text => {
    let textParts = text.split(":");
    const _iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), _iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }
};
