// Backend/utils/fileUploadService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This line defines and exports the BASE_UPLOADS_DIR constant.
export const BASE_UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(BASE_UPLOADS_DIR)) {
    fs.mkdirSync(BASE_UPLOADS_DIR, { recursive: true });
}

export const uploadFileLocally = async (fileBuffer, fileName) => {
    const filePath = path.join(BASE_UPLOADS_DIR, fileName);

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileBuffer, (err) => {
            if (err) {
                console.error('Error saving file locally:', err);
                return reject(new Error('Failed to save file locally: ' + err.message));
            }
            const accessibleUrl = `/uploads/${fileName}`;
            console.log(`File saved locally: ${filePath}. Accessible at: ${accessibleUrl}`);
            resolve(accessibleUrl);
        });
    });
};