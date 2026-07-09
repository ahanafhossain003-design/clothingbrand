import React, { useState, useEffect, useRef } from 'react';
import { get } from 'idb-keyval';

interface MediaRendererProps {
  url: string;
  className?: string;
  type?: 'background' | 'img' | 'video';
  muted?: boolean;
  onMediaTypeResolve?: (type: 'img' | 'video') => void;
}

export default function MediaRenderer({ url, className, type = 'background', muted = true, onMediaTypeResolve }: MediaRendererProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [isBlobVideo, setIsBlobVideo] = useState(false);
  
  useEffect(() => {
    let objectUrl: string | null = null;
    let isActive = true;

    if (url?.startsWith('idb-media-')) {
      const getWithTimeout = (key: string) => {
        return new Promise<File | Blob | undefined>((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('IDB Timeout')), 5000);
          get(key).then(val => {
            clearTimeout(timer);
            resolve(val as any);
          }).catch(err => {
            clearTimeout(timer);
            reject(err);
          });
        });
      };

      getWithTimeout(url).then((file: File | Blob | undefined) => {
        if (isActive && file) {
          objectUrl = URL.createObjectURL(file);
          setResolvedUrl(objectUrl);
          if (file.type.startsWith('video/')) {
            setIsBlobVideo(true);
          }
        }
      }).catch((e) => {
        console.warn('idb get media error', e);
      });
    } else {
      setResolvedUrl(url);
      setIsBlobVideo(false);
    }

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  const isVideo = isBlobVideo || url?.match(/\.(mp4|webm|ogg|mov|3gp|avi|mkv)(\?.*)?$/i) || url?.startsWith('data:video/');

  const lastResolvedTypeRef = useRef<'video' | 'img' | null>(null);

  useEffect(() => {
    const currentType = isVideo || type === 'video' ? 'video' : 'img';
    if (onMediaTypeResolve && lastResolvedTypeRef.current !== currentType) {
      lastResolvedTypeRef.current = currentType;
      onMediaTypeResolve(currentType);
    }
  }, [isVideo, type, onMediaTypeResolve]);

  if (!resolvedUrl) return <div className={`bg-gray-100 dark:bg-gray-800 animate-pulse ${className || ''}`} />;

  if (isVideo || type === 'video') {
    return <video src={resolvedUrl} className={className} autoPlay muted={muted} loop playsInline />;
  }

  if (type === 'img') {
    return <img src={resolvedUrl} alt="" className={className} />;
  }

  return (
    <div 
      className={`bg-cover bg-center ${className || ''}`}
      style={{ backgroundImage: `url(${resolvedUrl})` }}
    />
  );
}
