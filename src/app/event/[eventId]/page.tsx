'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
import { Camera, RefreshCw, Send, Check, AlertCircle } from 'lucide-react'
import { Event } from '@/types'

export default function EventPage({ params }: { params: { eventId: string } }) {
  const webcamRef = useRef<Webcam>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar informações do evento
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${params.eventId}`)
        setEvent(response.data)
      } catch (err) {
        setError('Evento não encontrado')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [params.eventId])

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
      setUploadSuccess(false)
      setError(null)
    }
  }, [webcamRef])

  const retake = () => {
    setCapturedImage(null)
    setUploadSuccess(false)
    setError(null)
  }

  const uploadPhoto = async () => {
    if (!capturedImage) return

    setIsUploading(true)
    setError(null)

    try {
      await axios.post('/api/upload-photo', {
        event_id: params.eventId,
        photo_data: capturedImage,
      })
      setUploadSuccess(true)
      setTimeout(() => {
        setCapturedImage(null)
        setUploadSuccess(false)
      }, 3000)
    } catch (err) {
      setError('Erro ao enviar foto. Tente novamente.')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {event?.name || 'Evento'}
          </h1>
          <p className="text-primary-100">
            Tire sua foto e compartilhe o momento!
          </p>
        </div>

        {/* Camera/Preview Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="camera-container aspect-[4/3] bg-gray-900 relative">
            {!capturedImage ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{
                    facingMode: 'user',
                    width: 1280,
                    height: 720,
                  }}
                />
                {event?.frame_url && (
                  <img
                    src={event.frame_url}
                    alt="Frame"
                    className="frame-overlay object-cover"
                  />
                )}
              </>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
                {event?.frame_url && (
                  <img
                    src={event.frame_url}
                    alt="Frame"
                    className="frame-overlay object-cover"
                  />
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-white">
            {!capturedImage ? (
              <button
                onClick={capture}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Camera className="w-6 h-6" />
                Tirar Foto
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={retake}
                  disabled={isUploading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-5 h-5" />
                  Nova Foto
                </button>
                <button
                  onClick={uploadPhoto}
                  disabled={isUploading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Foto enviada com sucesso!</span>
              </div>
            )}

            {/* Error Message */}
            {error && event && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-primary-100">
          <p className="text-sm">
            Sua foto será compartilhada no álbum do evento
          </p>
        </div>
      </div>
    </main>
  )
}
