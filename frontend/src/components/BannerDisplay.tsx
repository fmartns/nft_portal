import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { fetchCollectionBanner, Banner } from '@/api/nft';

interface BannerDisplayProps {
  className?: string;
}

export function BannerDisplay({ className = '' }: BannerDisplayProps) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    fetchCollectionBanner()
      .then((data) => {
        if (!mounted) return;
        setBanner(data);
        setError(null);
      })
      .catch((e) => {
        if (!mounted) return;
        // Se for erro 404 (nenhum banner encontrado), não mostra erro
        if (e?.response?.status === 404) {
          setBanner(null);
          setError(null);
        } else {
          setError(e?.message || 'Falha ao carregar banner');
        }
      })
      .finally(() => mounted && setLoading(false));
    
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return null; // Não mostra loading, apenas não exibe nada
  }

  if (error) {
    return (
      <div className={`text-center text-red-500 ${className}`}>
        Erro ao carregar banner: {error}
      </div>
    );
  }

  if (!banner || !banner.image_url) {
    return null; // Não exibe nada se não houver banner ou imagem
  }

  return (
    <div className={`text-center ${className}`}>
      <img 
        src={banner.image_url} 
        alt={banner.title}
        className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
        style={{ maxHeight: '300px', objectFit: 'contain' }}
      />
    </div>
  );
}
