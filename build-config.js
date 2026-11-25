// Gera config.local.js a partir das variáveis de ambiente (usado no deploy da Vercel).
const fs = require('fs');
const env = process.env;
const faltando = ['JSONBIN_ID','JSONBIN_KEY','ADMIN_USUARIO','ADMIN_SENHA','CLOUDINARY_CLOUD','CLOUDINARY_PRESET']
  .filter(k => !env[k]);
if (faltando.length) {
  console.error('Variáveis de ambiente faltando na Vercel: ' + faltando.join(', '));
  process.exit(1);
}
const cfg = {
  JSONBIN_ID: env.JSONBIN_ID, JSONBIN_KEY: env.JSONBIN_KEY,
  ADMIN_USUARIO: env.ADMIN_USUARIO, ADMIN_SENHA: env.ADMIN_SENHA,
  CLOUDINARY_CLOUD: env.CLOUDINARY_CLOUD, CLOUDINARY_PRESET: env.CLOUDINARY_PRESET
};
fs.writeFileSync('config.local.js', 'window.APP_CONFIG = ' + JSON.stringify(cfg) + ';\n');
console.log('config.local.js gerado.');
