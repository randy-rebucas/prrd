import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export interface GalleryImage {
    id: number;
    url: string;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gallery',
        href: '/gallery',
    },
];

interface Props {
    images: GalleryImage[];
}

export default function Gallery({ images = [] }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleUpload = async (acceptedFiles: File[]) => {
        setUploading(true);

        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('images[]', file);
        });

        try {
            await router.post('/gallery/upload', formData, {
                forceFormData: true,
                onSuccess: () => {
                    setFiles([]);
                    // Optional: Show success message
                },
                onError: () => {
                    // Optional: Show error message
                },
                onFinish: () => {
                    setUploading(false);
                }
            });
        } catch (error) {
            console.error('Upload failed:', error);
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles);
            handleUpload(acceptedFiles);
        }
    });

    const handleDelete = async (imageId: number) => {
        setDeleting(imageId);
        try {
            await router.delete(`/gallery/images/${imageId}`, {
                onSuccess: () => {
                    // Optional: Show success message
                },
                onError: () => {
                    // Optional: Show error message
                },
                onFinish: () => {
                    setDeleting(null);
                }
            });
        } catch (error) {
            console.error('Delete failed:', error);
            setDeleting(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gallery" />

            <div className="container py-6">
                <div
                    {...getRootProps()}
                    className={`mb-6 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors ${
                        uploading ? 'opacity-50 pointer-events-none' : ''
                    }`}
                >
                    <input {...getInputProps()} />
                    {uploading ? (
                        <p className="text-center text-muted-foreground">Uploading...</p>
                    ) : isDragActive ? (
                        <p className="text-center text-muted-foreground">Drop the files here ...</p>
                    ) : (
                        <p className="text-center text-muted-foreground">
                            Drag 'n' drop some files here, or click to select files
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {/* Upload previews */}
                    {files.map((file, index) => (
                        <div key={`preview-${index}`} className="aspect-square rounded-lg bg-muted overflow-hidden relative">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload preview ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}

                    {/* Empty state */}
                    {files.length === 0 && images.length === 0 && (
                        <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No images yet</p>
                        </div>
                    )}


                    {/* Existing images */}
                    {images.map((image: GalleryImage) => (
                        <div key={image.id} className="aspect-square rounded-lg bg-muted overflow-hidden relative group">
                            <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => handleDelete(image.id)}
                                disabled={deleting === image.id}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                {deleting === image.id ? (
                                    <span className="text-white">Deleting...</span>
                                ) : (
                                    <span className="text-white">Delete</span>
                                )}
                            </button>
                        </div>
                    ))}

                </div>
            </div>
        </AppLayout>
    );
}
