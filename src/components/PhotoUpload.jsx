import React, { useState, useRef } from 'react'
import { Camera, X, Image as ImageIcon } from 'lucide-react'

const PhotoUpload = ({ onPhotosSelected, photos = [] }) => {
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    )
    onPhotosSelected([...photos, ...validFiles])
  }

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onPhotosSelected(newPhotos)
  }

  const getImagePreview = (file) => {
    return URL.createObjectURL(file)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Fotos hochladen
        </h2>
        <p className="text-gray-600 text-sm">
          Lade Fotos vom Zustand des/der Bikes hoch
        </p>
      </div>

      {/* Camera and File Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="btn-primary flex items-center justify-center space-x-2 py-4"
        >
          <Camera className="w-5 h-5" />
          <span>Kamera öffnen</span>
        </button>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary flex items-center justify-center space-x-2 py-4"
        >
          <ImageIcon className="w-5 h-5" />
          <span>Dateien auswählen</span>
        </button>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">
            Ausgewählte Fotos ({photos.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={getImagePreview(photo)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-28 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removePhoto(index)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {photo.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoUpload