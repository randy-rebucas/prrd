import { GalleryImage } from '@/pages/gallery';
import React, { useState, useEffect } from 'react';

export default function Gallery() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        // Fetch images from the controller
        const fetchImages = async () => {
            try {
                const response = await fetch('/gallery/images');  // Updated route
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setImages(data.map((image: GalleryImage) => image.url));
            } catch (error) {
                console.error('Error fetching gallery images:', error);
                // Fallback to default images if fetch fails
                setImages([
                    '/images/drone-backdrop.jpg'
                ]);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) =>
                    (prevIndex + 1) % images.length
                );
                setIsTransitioning(false);
            }, 1000); // Fade out duration
        }, 5000); // Time between transitions

        return () => clearInterval(timer);
    }, [images]);

    console.log(images);

    return (
        <div className="w-full aspect-video rounded-lg flex items-center justify-center relative overflow-hidden">
            <div
                className="absolute inset-0 transition-opacity duration-1000"
                style={{
                    backgroundImage: `url(${images[currentImageIndex]})`,
                    backgroundPosition: 'center',
                    backgroundColor: '#1a1a1a',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    opacity: isTransitioning ? 0 : 1
                }}
            />
            <div className="absolute inset-0 bg-opacity-5" />
            <div className="text-center text-white relative z-10">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-semibold">No Stream Available</p>
                <p className="text-sm">Waiting for stream to start...</p>
            </div>
        </div>
    );
}