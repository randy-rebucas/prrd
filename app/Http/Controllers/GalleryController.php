<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Image;

class GalleryController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Generate a unique filename with original extension
                $filename = uniqid() . '_' . time() . '.' . $image->getClientOriginalExtension();

                // Store the image in the public/storage/gallery directory
                $path = $image->storeAs('gallery', $filename, 'public');

                // Save image information to database
                \App\Models\Image::create([
                    'filename' => $filename,
                    'path' => $path,
                    'original_name' => $image->getClientOriginalName(),
                    'mime_type' => $image->getMimeType(),
                    'size' => $image->getSize()
                ]);
            }
        }

        return redirect()->back()->with('success', 'Images uploaded successfully');
    }

    public function getImages()
    {
        // Get all images from the database
        $images = \App\Models\Image::all();

        // Transform the images collection to include full URLs
        $imageUrls = $images->map(function ($image) {
            return [
                'id' => $image->id,
                'url' => Storage::url($image->path),
                'original_name' => $image->original_name,
                'size' => $image->size
            ];
        })->values()->all();

        return response()->json($imageUrls);
    }

    public function index()
    {
        $images = Image::latest()->get();

        return Inertia::render('gallery', [
            'images' => $images->map(fn($image) => [
                'id' => $image->id,
                'url' => Storage::url($image->path),
                'name' => $image->name,
            ]),
        ]);
    }

    public function delete($id)
    {
        $image = Image::findOrFail($id);
        Storage::disk('public')->delete($image->path);
        $image->delete();
        return redirect()->back()->with('success', 'Image deleted successfully');
    }
}