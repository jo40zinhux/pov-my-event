'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import JSZip from 'jszip'
import { ArrowLeft, Download, Image as ImageIcon } from 'lucide-react'
import { Event, Photo } from '@/types'
import Link from 'next/link'

export default function EventPhotosPage({ params }: { params: { eventId: string } }) {
  const { status } = useSession()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEventAndPhotos()
    }
  }, [status, params.eventId])

  const fetchEventAndPhotos = async () => {
    try {
      const [eventResponse, photosResponse] = await Promise.all([
        axios.get(`/api/events/${params.eventId}`),
        axios.get(`/api/events/${params.eventId}/photos`),
      ])
      setEvent(eventResponse.data)
      setPhotos(photosResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadAllPhotos = async () => {
    if (photos.length === 0) return

    setDownloading(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder('fotos-evento')

      // Baixar todas as fotos
      const photoPromises = photos.map(async (photo, index) => {
        const response = await fetch(photo.photo_url)
        const blob = await response.blob()
        folder?.file(`foto-${index + 1}.jpg`, blob)
      })

      await Promise.all(photoPromises)

      // Gerar e baixar o ZIP
      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = `fotos-${event?.name || 'evento'}.zip`
      link.click()
    } catch (error) {
      console.error('Error downloading photos:', error)
      alert('Erro ao baixar fotos')
    } finally {
      setDownloading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Carregando...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {event?.name || 'Evento'}
                </h1>
                <p className="text-gray-600">
                  {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
                </p>
              </div>
            </div>
            {photos.length > 0 && (
              <button
                onClick={downloadAllPhotos}
                disabled={downloading}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {downloading ? 'Baixando...' : 'Baixar Todas'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {photos.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma foto ainda
            </h3>
            <p className="text-gray-600">
              As fotos enviadas pelos convidados aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative">
                  <img
                    src={photo.photo_url}
                    alt="Foto do evento"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500">
                    {new Date(photo.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
