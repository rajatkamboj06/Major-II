"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureTrivy = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const unzipper_1 = __importDefault(require("unzipper"));
const ensureTrivy = async () => {
    const toolsDir = path_1.default.join(__dirname, '../../tools');
    if (!fs_1.default.existsSync(toolsDir)) {
        fs_1.default.mkdirSync(toolsDir, { recursive: true });
    }
    const trivyExePath = path_1.default.join(toolsDir, 'trivy.exe');
    if (fs_1.default.existsSync(trivyExePath)) {
        return trivyExePath;
    }
    console.log('Trivy not found locally. Downloading Trivy for Windows...');
    const zipPath = path_1.default.join(toolsDir, 'trivy.zip');
    const downloadUrl = 'https://github.com/aquasecurity/trivy/releases/download/v0.70.0/trivy_0.70.0_windows-64bit.zip';
    await new Promise((resolve, reject) => {
        const file = fs_1.default.createWriteStream(zipPath);
        const request = (url) => {
            https_1.default.get(url, (response) => {
                if (response.statusCode === 302 && response.headers.location) {
                    request(response.headers.location);
                }
                else {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                }
            }).on('error', reject);
        };
        request(downloadUrl);
    });
    console.log('Download complete. Extracting...');
    await new Promise((resolve, reject) => {
        fs_1.default.createReadStream(zipPath)
            .pipe(unzipper_1.default.Extract({ path: toolsDir }))
            .on('close', resolve)
            .on('error', reject);
    });
    fs_1.default.unlinkSync(zipPath);
    if (!fs_1.default.existsSync(trivyExePath)) {
        throw new Error('Trivy extraction failed: trivy.exe not found');
    }
    console.log('Trivy is ready.');
    return trivyExePath;
};
exports.ensureTrivy = ensureTrivy;
//# sourceMappingURL=toolManager.js.map