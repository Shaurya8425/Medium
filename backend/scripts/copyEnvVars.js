const fs = require('fs');
const path = require('path');

try {
   // Read .dev.vars content
   const devVarsPath = path.join(__dirname, '..', '.dev.vars');
   const devVarsContent = fs.readFileSync(devVarsPath, 'utf8');

   // Convert .dev.vars format to .env format
   const envContent = devVarsContent
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
         const [key, ...values] = line.split('=');
         const value = values.join('=').trim();
         return `${key.trim()}="${value}"`;
      })
      .join('\n');

   // Write to .env file
   const envPath = path.join(__dirname, '..', '.env');
   fs.writeFileSync(envPath, envContent);

   console.log('✅ Environment variables copied and formatted successfully');
} catch (error) {
   console.error('❌ Error processing environment variables:', error.message);
   process.exit(1);
}