import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/componants/ui/button";
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";
import { Upload, Download, Trash2, Image, Video, Camera, Plus, Edit, Share, Minimize, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// API Base URL
const API_BASE_URL = 'http://localhost:5001/api';

// Import pre-loaded images
import krishnaJanmabhumi from "@/assets/s.jpeg";
import premMandirHero from "@/assets/prem-mandir-hero2.jpeg";
import kartiMandir from "@/assets/banke-bh.jpeg";
import krishnaValab from "@/assets/karti-mandir.jpeg";
import shriKrishnaJanmabhoomi from "@/assets/shri-krishna-janmabhoomi-temple-mathura.webp";
import bankeBihari from "@/assets/v3.jpeg";

// Pre-loaded photos array
const preloadedPhotos = [
  {
    id: 'preloaded-1',
    name: 'krishna-janmabhumi.webp',
    type: 'image/webp',
    url: krishnaJanmabhumi,
    isPreloaded: true,
    uploadDate: new Date(),
  },
  {
    id: 'preloaded-2',
    name: 'prem-mandir-hero.jpg',
    type: 'image/jpeg',
    url: premMandirHero,
    isPreloaded: true,
    uploadDate: new Date(),
  },
  {
    id: 'preloaded-3',
    name: 'karti-mandir.jpeg',
    type: 'image/jpeg',
    url: kartiMandir,
    isPreloaded: true,
    uploadDate: new Date(),
  },
  {
    id: 'preloaded-4',
    name: 'krishna valab.jpeg',
    type: 'image/jpeg',
    url: krishnaValab,
    isPreloaded: true,
    uploadDate: new Date(),
  },
  {
    id: 'preloaded-5',
    name: 'shri-krishna-janmabhoomi-temple-mathura.webp',
    type: 'image/webp',
    url: shriKrishnaJanmabhoomi,
    isPreloaded: true,
    uploadDate: new Date(),
  },
  {
    id: 'preloaded-6',
    name: 'banke-bihari.jpg',
    type: 'image/jpeg',
    url: bankeBihari,
    isPreloaded: true,
    uploadDate: new Date(),
  },
];

export default function PhotosPage() {
  const [files, setFiles] = useState([]);
  const [fullScreenFile, setFullScreenFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Fetch photos from database
  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/photos/gallery`);

      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }

      const result = await response.json();

      if (result.success) {
        // Convert database photos to the format expected by the UI
        const dbPhotos = result.data.photos.map(photo => ({
          id: photo._id,
          name: photo.originalName,
          type: photo.mimetype,
          url: `${API_BASE_URL}/photos/${photo._id}`,
          isPreloaded: photo.isPreloaded,
          uploadDate: new Date(photo.createdAt)
        }));

        // Combine preloaded photos with database photos
        setFiles([...preloadedPhotos, ...dbPhotos]);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Failed to load photos from database",
        variant: "destructive",
      });
      // Fallback to preloaded photos only
      setFiles(preloadedPhotos);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload photos to database
  const uploadPhotosToAPI = async (filesToUpload) => {
    if (filesToUpload.length === 0) return;

    try {
      setIsUploading(true);
      const formData = new FormData();

      filesToUpload.forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch(`${API_BASE_URL}/photos/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload photos');
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Upload Successful",
          description: `Photo uploaded successfully`,
        });

        // Refresh the photos list
        await fetchPhotos();
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload photos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Delete photo from database
  const deletePhotoFromAPI = async (photoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete photo');
      }

      toast({
        title: "Photo Deleted",
        description: "Photo has been removed successfully",
      });

      // Refresh the photos list
      await fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  // Initialize with pre-loaded photos and fetch from database
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Function to open full screen
  const openFullScreen = (file) => {
    setFullScreenFile(file);
  };

  // Function to close full screen
  const closeFullScreen = () => {
    setFullScreenFile(null);
  };

  // Handle upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesToUpload = Array.from(e.target.files || []);
    if (filesToUpload.length > 0) {
      await uploadPhotosToAPI(filesToUpload);
    }
    e.target.value = '';
  };

  // Handle delete
  const handleDelete = async (id) => {
    // Check if it's a preloaded photo (can't be deleted from database)
    const photo = files.find(f => f.id === id);
    if (photo?.isPreloaded) {
      toast({
        title: "Cannot Delete",
        description: "Preloaded photos cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    // Delete from database
    await deletePhotoFromAPI(id);
  };

  // Handle download
  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="pt-20 pb-8">
        {/* Header */}
        <div className="px-4 py-4 bg-orange-600 border-b border-orange-600">
          <h1 className="text-white text-xl font-semibold text-center">
            Vrindavan Mathura Tour Pictures
          </h1>
        </div>

        {/* Top Action Bar */}
        <div className="px-4 py-3 bg-orange-600 border-b border-orange-600">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <Button
                onClick={triggerFileInput}
                size="sm"
                variant="outline"
                disabled={isUploading}
                className="bg-orange-900 border-orange-400 text-white hover:bg-orange-800 gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isUploading ? 'Uploading...' : 'Add'}
              </Button>

              <Button
                onClick={fetchPhotos}
                size="sm"
                variant="outline"
                disabled={isLoading}
                className="bg-orange-900 border-orange-400 text-white hover:bg-orange-800 gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Refresh
              </Button>
            </div>
            <div className="text-white text-sm">
              {isLoading ? 'Loading...' : `${files.length} items`}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="p-4">
          {files.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-orange-200 flex items-center justify-center">
                <Camera className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">No photos yet</h3>
              <p className="text-orange-400 text-sm">
                Tap the Add button to upload your first photo
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {files.map((file) => (
                <div key={file.id} className="relative aspect-square bg-orange-800 rounded-lg overflow-hidden group cursor-pointer" onClick={() => openFullScreen(file)}>
                  {file.type.startsWith("image") ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}

                  {/* Download button on top right */}
                  <button
                    onClick={() => handleDownload(file)}
                    className="absolute top-2 right-2 w-8 h-8 bg-orange-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Download image"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>

                  {/* Delete button on bottom right - only for user-uploaded photos */}
                  {!file.isPreloaded && (
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="absolute bottom-0 right-2 w-8 h-8 bg-red-600/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Delete image"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  )}

                  {/* Video indicator */}
                  {file.type.startsWith("video") && (
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-orange-900/60 rounded-full flex items-center justify-center">
                      <Video className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleUpload}
          className="hidden"
          aria-label="Upload photos and videos"
        />
      </div>

      {/* Full Screen Overlay */}
      {fullScreenFile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={closeFullScreen}>
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors"
            aria-label="Close full screen"
          >
            <Minimize className="w-5 h-5 text-white" />
          </button>
          <div className="max-w-full max-h-full p-4">
            {fullScreenFile.type.startsWith("image") ? (
              <img
                src={fullScreenFile.url}
                alt={fullScreenFile.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={fullScreenFile.url}
                controls
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
