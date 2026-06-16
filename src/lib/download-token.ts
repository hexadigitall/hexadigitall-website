import crypto from 'crypto';

const DOWNLOAD_TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET || process.env.AUTH_SECRET || 'hexadigitall-download-secret';
const DOWNLOAD_TOKEN_EXPIRY_HOURS = parseInt(process.env.DOWNLOAD_TOKEN_EXPIRY_HOURS || '48', 10);

interface DownloadTokenPayload {
  fileUrl: string;
  email: string;
  publicationId: string;
  exp: number;
}

export function createDownloadToken(fileUrl: string, email: string, publicationId: string): string {
  const payload: DownloadTokenPayload = {
    fileUrl,
    email,
    publicationId,
    exp: Date.now() + DOWNLOAD_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
  };

  const data = JSON.stringify(payload);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', crypto.createHash('sha256').update(DOWNLOAD_TOKEN_SECRET).digest(), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function verifyDownloadToken(token: string): DownloadTokenPayload | null {
  try {
    const parts = token.split(':');
    if (parts.length !== 2) return null;
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.createHash('sha256').update(DOWNLOAD_TOKEN_SECRET).digest(), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const payload: DownloadTokenPayload = JSON.parse(decrypted);

    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getDownloadTokenExpiryHours(): number {
  return DOWNLOAD_TOKEN_EXPIRY_HOURS;
}
