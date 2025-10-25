import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, Heart, Share2 } from 'lucide-react';
import { BannerDisplay } from './BannerDisplay';
import { ShareModal } from './ShareModal';
import { useState } from 'react';

interface CollectionBannerProps {
  name: string;
  description: string;
  coverImage: string;
  logoImage: string;
  creator: string;
  isVerified?: boolean;
}

export function CollectionBanner({
  name,
  description,
  coverImage,
  logoImage,
  creator,
  isVerified = true
}: CollectionBannerProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const collectionUrl = `${window.location.origin}/${name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <ImageWithFallback
          src={coverImage}
          alt={`${name} collection cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Action buttons overlay */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Button size="sm" variant="outline" className="bg-black/20 backdrop-blur border-white/20 hover:bg-black/40">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Collection Info */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative mt-8 lg:mt-12">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            {/* Logo */}
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden border-4 border-background bg-card">
                <ImageWithFallback
                  src={logoImage}
                  alt={`${name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              {isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FFE000] rounded-full flex items-center justify-center border-2 border-background">
                  <Star className="w-4 h-4 text-black fill-black" />
                </div>
              )}
            </div>

            {/* Collection Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold">{name}</h1>
                  {isVerified && (
                    <Badge className="bg-[#FFE000] text-black border-0">
                      Verificado
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Por</span>
                  <span className="font-medium text-[#FFE000]">{creator}</span>
                </div>
              </div>

              {/* Banner Editável */}
              <div className="mt-6">
                <BannerDisplay />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
              <Button className="bg-[#FFE000] hover:bg-[#FFD700] text-black border-0">
                <Heart className="w-4 h-4 mr-2" />
                Favoritar
              </Button>
              <Button 
                variant="outline" 
                className="border-[#FFE000]/30 hover:bg-[#FFE000]/10"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        collectionName={name}
        collectionUrl={collectionUrl}
      />
    </div>
  );
}