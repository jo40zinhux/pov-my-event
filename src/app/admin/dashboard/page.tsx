'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import QRCode from 'qrcode'
import { Plus, QrCode as QrCodeIcon, Image, Calendar, LogOut } from 'lucide-react'
import { Event } from '@/types'
import { signOut } from 'next-auth/react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newEventName, setNewEventName] = useState('')
  const [newEventFrame, setNewEventFrame] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEvents()
    }
  }, [status])

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events')
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async () => {
    if (!newEventName.trim()) return

    setCreating(true)
    try {
      await axios.post('/api/events', {
        name: newEventName,
        frame_url: newEventFrame || null,
      })
      setNewEventName('')
      setNewEventFrame('')
      setShowCreateModal(false)
      fetchEvents()
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Erro ao criar evento')
    } finally {
      setCreating(false)
    }
  }

  const generateQRCode = async (eventId: string) => {
    const url = `${window.location.origin}/event/${eventId}`
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
      })
      
      // Download QR Code
      const link = document.createElement('a')
      link.href = qrCodeDataUrl
      link.download = `qrcode-event-${eventId}.png`
      link.click()
    } catch (error) {
      console.error('Error generating QR code:', error)
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">Gerenciar eventos e fotos</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Criar Novo Evento
          </button>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum evento criado
            </h3>
            <p className="text-gray-600">
              Crie seu primeiro evento para começar
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {event.name}
                </h3>
                <div className="space-y-3">
                  <Link
                    href={`/admin/event/${event.id}`}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Image className="w-5 h-5" />
                    Ver Fotos
                  </Link>
                  <button
                    onClick={() => generateQRCode(event.id)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <QrCodeIcon className="w-5 h-5" />
                    Baixar QR Code
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Criado em {new Date(event.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Criar Novo Evento
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Evento *
                </label>
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Casamento Maria e João"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Moldura (opcional)
                </label>
                <input
                  type="url"
                  value={newEventFrame}
                  onChange={(e) => setNewEventFrame(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://exemplo.com/moldura.png"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={createEvent}
                disabled={creating || !newEventName.trim()}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {creating ? 'Criando...' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
