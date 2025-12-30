import Image from 'next/image';
import React from 'react';

interface BannerProps {
  image?: string;
  title: string;
  description?: string;
  height?: number | string;
  overlayClassName?: string;
  children?: React.ReactNode;
}

export default function Banner({
  image,
  title,
  description,
  height = 320,
  overlayClassName = 'bg-black/50',
  children,
}: BannerProps) {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: height }}>
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover z-0"
          priority
          sizes="100vw"
        />
      )}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-white z-10 ${overlayClassName}`}>
        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg text-center">{title}</h1>
        {description && <p className="mt-2 text-lg md:text-xl text-center max-w-2xl drop-shadow">{description}</p>}
        {children}
      </div>
    </div>
  );
}
