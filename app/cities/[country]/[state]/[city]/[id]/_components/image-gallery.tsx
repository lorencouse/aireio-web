'use client';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog';

const Gallery = ({ photos }: { photos: string[] }) => {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const handleClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbnailApi) return;
      mainApi.scrollTo(index);
      thumbnailApi.scrollTo(index);
      setCurrent(index);
    },
    [mainApi, thumbnailApi]
  );

  const mainImages = useMemo(
    () =>
      photos.map((photoUrl, index) => (
        <CarouselItem key={index} className="relative w-full aspect-[4/3]">
          <Image
            src={photoUrl || '/default-image.jpg'}
            alt={`Carousel Main Image ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg cursor-pointer"
            onClick={() => setIsFullscreenOpen(true)}
            loading="lazy"
            placeHolder="blur"
            blurDataURL="/images/logo.png"
          />
        </CarouselItem>
      )),
    [photos]
  );

  const thumbnailImages = useMemo(
    () =>
      photos.map((photoUrl, index) => (
        <CarouselItem
          key={index}
          className="relative aspect-square cursor-pointer"
          onClick={() => handleClick(index)}
        >
          <Image
            className={`object-cover rounded-md transition-all ${
              index === current
                ? 'border-2 border-primary'
                : 'border border-gray-300 opacity-70 hover:opacity-100'
            }`}
            src={photoUrl || '/default-image.jpg'}
            fill
            sizes="(max-width: 768px) 20vw, 10vw"
            alt={`Carousel Thumbnail Image ${index + 1}`}
            loading="lazy"
            placeHolder="blur"
            blurDataURL="/images/logo.png"
          />
        </CarouselItem>
      )),
    [photos, current, handleClick]
  );

  useEffect(() => {
    if (!mainApi || !thumbnailApi) return;

    const handleTopSelect = () => {
      const selected = mainApi.selectedScrollSnap();
      setCurrent(selected);
      thumbnailApi.scrollTo(selected);
    };

    const handleBottomSelect = () => {
      const selected = thumbnailApi.selectedScrollSnap();
      setCurrent(selected);
      mainApi.scrollTo(selected);
    };

    mainApi.on('select', handleTopSelect);
    thumbnailApi.on('select', handleBottomSelect);

    return () => {
      mainApi.off('select', handleTopSelect);
      thumbnailApi.off('select', handleBottomSelect);
    };
  }, [mainApi, thumbnailApi]);

  const handlePrevious = useCallback(() => {
    if (mainApi) {
      mainApi.scrollPrev();
    }
  }, [mainApi]);

  const handleNext = useCallback(() => {
    if (mainApi) {
      mainApi.scrollNext();
    }
  }, [mainApi]);

  if (photos.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="relative">
        <Carousel setApi={setMainApi}>
          <CarouselContent className="-ml-1">{mainImages}</CarouselContent>
        </Carousel>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-50"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-50"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Carousel setApi={setThumbnailApi} opts={{ align: 'start' }}>
        <CarouselContent className="-ml-1">
          {thumbnailImages.map((thumbnail, index) => (
            <CarouselItem
              key={index}
              className="pl-1 basis-1/5 sm:basis-1/6 md:basis-1/7"
            >
              {thumbnail}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 h-full">
          <VisuallyHidden>
            <DialogTitle>Fullscreen Image View</DialogTitle>
            <DialogDescription>
              View the selected image in full screen. Use arrow buttons or
              keyboard to navigate.
            </DialogDescription>
          </VisuallyHidden>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-2 z-50"
            onClick={() => setIsFullscreenOpen(false)}
            aria-label="Close fullscreen view"
          >
            <X className="h-4 w-4" />
          </Button>
          <Image
            src={photos[current] || '/default-image.jpg'}
            alt={`Fullscreen Image ${current + 1} of ${photos.length}`}
            fill
            sizes="90vw"
            className="object-contain"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
            onClick={() => {
              handlePrevious();
              setCurrent((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => {
              handleNext();
              setCurrent((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
            }}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
