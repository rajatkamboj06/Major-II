import fs from 'fs';
import path from 'path';
import https from 'https';
import unzipper from 'unzipper';

export const ensureTrivy = async (): Promise<string> => {
  const toolsDir = path.join(__dirname, '../../tools');
  if (!fs.existsSync(toolsDir)) {
    fs.mkdirSync(toolsDir, { recursive: true });
  }

  const trivyExePath = path.join(toolsDir, 'trivy.exe');
  
  if (fs.existsSync(trivyExePath)) {
    return trivyExePath;
  }

  console.log('Trivy not found locally. Downloading Trivy for Windows...');
  
  const zipPath = path.join(toolsDir, 'trivy.zip');
  const downloadUrl = 'https://github.com/aquasecurity/trivy/releases/download/v0.70.0/trivy_0.70.0_windows-64bit.zip';

  await new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);
    const request = (url: string) => {
      https.get(url, (response) => {
        if (response.statusCode === 302 && response.headers.location) {
          request(response.headers.location);
        } else {
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
  
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: toolsDir }))
      .on('close', resolve)
      .on('error', reject);
  });

  fs.unlinkSync(zipPath);

  if (!fs.existsSync(trivyExePath)) {
    throw new Error('Trivy extraction failed: trivy.exe not found');
  }

  console.log('Trivy is ready.');
  return trivyExePath;
};
