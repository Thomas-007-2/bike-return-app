import React, { useState, useEffect } from 'react'
import { createReport, uploadPhoto } from './utils/supabase'
import PhotoUpload from './components/PhotoUpload'
import ConditionForm from './components/ConditionForm'
import ThankYou from './components/ThankYou'
import { ArrowLeft, Loader } from 'lucide-react'

const App = () => {
  const [currentStep, setCurrentStep] = useState('photos')
  const [photos, setPhotos] = useState([])
  const [orderId, setOrderId] = useState('')
  const [merchantId, setMerchantId] = useState('')
  const [loading, setLoading] = useState(false)
  const [submissionComplete, setSubmissionComplete] = useState(false)

  useEffect(() => {
    // Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id') || `ORDER-${Date.now()}`
    const mid = urlParams.get('mid') || 'default'
    setOrderId(id)
    setMerchantId(mid)
  }, [])

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep, submissionComplete])

  const handlePhotosSelected = (selectedPhotos) => {
    setPhotos(selectedPhotos)
  }

  const handleNextStep = () => {
    if (currentStep === 'photos' && photos.length > 0) {
      setCurrentStep('condition')
    }
  }

  const handleBackStep = () => {
    if (currentStep === 'condition') {
      setCurrentStep('photos')
    }
  }

  const handleFormSubmit = async (formData) => {
    setLoading(true)
    
    try {
      console.log('Submitting report for order:', orderId, 'merchant:', merchantId)
      
      // Create the report
      const report = await createReport(orderId, formData.status, formData.description, merchantId)
      console.log('Report created:', report)
      
      // Upload photos
      if (photos.length > 0) {
        const uploadPromises = photos.map(photo => uploadPhoto(photo, orderId, merchantId))
        const uploads = await Promise.all(uploadPromises)
        console.log('Photos uploaded:', uploads)
      }
      
      setSubmissionComplete(true)
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Fehler beim Übertragen der Meldung. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (submissionComplete) {
    return <ThankYou orderId={orderId} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentStep === 'condition' && (
                <button
                  onClick={handleBackStep}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Fahrrad Rückgabemeldung
                </h1>
                <p className="text-sm text-gray-600">
                  Buchungs-ID: #{orderId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${
              currentStep === 'photos' ? 'text-primary-600' : 'text-gray-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'photos' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Fotos</span>
            </div>
            
            <div className="flex-1 h-1 bg-gray-200 rounded">
              <div className={`h-1 bg-primary-600 rounded transition-all duration-300 ${
                currentStep === 'condition' ? 'w-full' : 'w-0'
              }`} />
            </div>
            
            <div className={`flex items-center ${
              currentStep === 'condition' ? 'text-primary-600' : 'text-gray-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'condition' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Zustand</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {currentStep === 'photos' && (
          <div className="space-y-4">
            <PhotoUpload 
              photos={photos} 
              onPhotosSelected={handlePhotosSelected}
            />
            
            {photos.length > 0 && (
              <div className="text-center pb-4">
                <button
                  onClick={handleNextStep}
                  className="btn-primary text-lg py-3 px-6"
                >
                  Weiter zur Zustandsbewertung
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'condition' && (
          <ConditionForm 
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        )}
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-lg font-medium text-gray-900">
              Meldung wird übertragen...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App