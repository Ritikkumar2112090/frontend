const API_BASE_URL = "https://backend-p40q.onrender.com/api";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/componants/ui/button";
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";
import { Plus, Loader2, Trash2, Download, Camera, Minimize } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Preloaded images (imported from /assets)
import krishnaJanmabhumi from "@/assets/s.jpeg";
import premMandirHero from "@/assets/prem-mandir-hero2.jpeg";
import kartiMandir from "@/assets/banke-bh.jpeg";

const preloadedPhotos = [
  { id: "preloaded-1", name: "krishna-janmabhumi.webp", url: krishnaJanmabhumi, isPreloaded: true },
  { id: "preloaded-2", name: "prem-mandir-hero.jpg", url: premMandirHero, isPreloaded: true },
  { id: "preloaded-3", name: "karti-mandir.jpeg", url: kartiMandir, isPreloaded: true },
];

export default function PhotosPage() {
  const [files, setFiles] = useState(preloadedPhotos);
  const [fullScreenFile, setFullScreenFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const fetchPhotos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/photos/gallery`);
      const result = await res.json();
      if (result.success) {
        const dbPhotos = result.data.photos.map(photo => ({
          id: photo._id,
          name: photo.originalName,
          url: `${API_BASE_URL}/photos/${photo._id}`,
          isPreloaded: photo.isPreloaded
        }));
        setFiles([...preloadedPhotos, ...dbPhotos]);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load photos", variant: "destructive" });
    }
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleUpload = async (e) => {
    const filesToUpload = Array.from(e.target.files || []);
    if (!filesToUpload.length) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      filesToUpload.forEach(file => formData.append("photos", file));
      const res = await fetch(`${API_BASE_URL}/photos/upload`, { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        toast({ title: "Upload Successful", description: "Photos uploaded" });
        fetchPhotos();
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Upload Failed", description: "Could not upload photos", variant: "destructive" });
    } finally { setIsUploading(false); e.target.value = ""; }
  };

  const handleDelete = async (id) => {
    const photo = files.find(f => f.id === id);
    if (photo?.isPreloaded) {
      toast({ title: "Cannot Delete", description: "Preloaded photos cannot be deleted", variant: "destructive" });
      return;
    }
    try {
      await fetch(`${API_BASE_URL}/photos/${id}`, { method: "DELETE" });
      toast({ title: "Deleted", description: "Photo removed" });
      fetchPhotos();
    } catch (err) { console.error(err); toast({ title: "Delete Failed", variant: "destructive" }); }
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="pt-20 px-4">
        <h1 className="text-xl font-semibold text-center mb-4">Vrindavan Mathura Tour Pictures</h1>

        <div className="flex justify-between mb-4">
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="animate-spin w-4 h-4"/> : <Plus className="w-4 h-4"/>} Add
          </Button>
          <Button onClick={fetchPhotos}>Refresh</Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {files.map(file => (
            <div key={file.id} className="relative aspect-square cursor-pointer" onClick={() => setFullScreenFile(file)}>
              <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded"/>
              <button onClick={() => handleDownload(file)} className="absolute top-2 right-2 bg-orange-600 rounded-full p-1">
                <Download className="w-4 h-4 text-white"/>
              </button>
              {!file.isPreloaded && (
                <button onClick={() => handleDelete(file.id)} className="absolute bottom-2 right-2 bg-red-600 rounded-full p-1">
                  <Trash2 className="w-4 h-4 text-white"/>
                </button>
              )}
            </div>
          ))}
        </div>

        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload}/>
      </div>

      {fullScreenFile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setFullScreenFile(null)}>
          <button className="absolute top-4 right-4 bg-orange-600 rounded-full p-2">
            <Minimize className="w-5 h-5 text-white"/>
          </button>
          <img src={fullScreenFile.url} alt={fullScreenFile.name} className="max-h-full max-w-full"/>
        </div>
      )}

      <Footer />
    </div>
  );
}
