// Backend/utils/fileUploadService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Dapatkan __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Direktori tempat file akan disimpan
// Ini akan membuat folder 'uploads' di dalam folder 'public' di root Backend Anda.
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Pastikan direktori upload ada
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Fungsi untuk menyimpan file ke lokal
export const uploadFileLocally = async (fileBuffer, fileName) => {
    const filePath = path.join(UPLOADS_DIR, fileName);

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileBuffer, (err) => {
            if (err) {
                console.error('Error saving file locally:', err);
                return reject(new Error('Failed to save file locally: ' + err.message));
            }
            // Mengembalikan URL yang dapat diakses dari browser
            // Asumsikan folder 'public' dilayani secara statis di http://localhost:5000/
            const accessibleUrl = `/uploads/${fileName}`;
            console.log(`File saved locally: ${filePath}. Accessible at: ${accessibleUrl}`);
            resolve(accessibleUrl);
        });
    });
};