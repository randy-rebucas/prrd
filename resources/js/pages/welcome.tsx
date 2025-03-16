import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import Gallery from '@/components/gallery';
import { SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasStream, setHasStream] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            // Use import.meta.env instead of process.env
            const streamUrl = import.meta.env.VITE_STREAM_URL || '';
            console.log(streamUrl);
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    setHasStream(true);
                    video.play().catch(error => {
                        console.log("Playback failed:", error);
                    });
                });
                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        setHasStream(false);
                    }
                });
            }
            // For browsers that natively support HLS
            else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(error => {
                        console.log("Playback failed:", error);
                    });
                });
            }
        }
    }, []);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] dark:bg-[#0a0a0a]">
                <header className="absolute top-0 right-0 z-10 p-4">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <main className="relative h-screen w-full">
                    <video
                        ref={videoRef}
                        className={`h-full w-full object-cover ${!hasStream ? 'hidden' : ''}`}
                        controls
                        playsInline
                    />
                    {!hasStream && (
                        <div className="h-full w-full">
                            <Gallery />
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
