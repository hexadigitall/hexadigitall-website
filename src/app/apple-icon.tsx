// src/app/apple-icon.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: '#0A4D68',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F5A623',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          borderRadius: '22%'
        }}
      >
        H
      </div>
    ),
    {
      ...size,
    }
  );
}
