import Link from 'next/link'
import { Camera, QrCode, Image } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Camera className="w-20 h-20 text-primary-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            POV Photo
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Capture e compartilhe momentos especiais em eventos
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-primary-50 p-6 rounded-xl">
              <QrCode className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Escaneie o QR Code</h3>
              <p className="text-gray-600 text-sm">
                Use seu smartphone para acessar o evento
              </p>
            </div>

            <div className="bg-primary-50 p-6 rounded-xl">
              <Camera className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Tire sua foto</h3>
              <p className="text-gray-600 text-sm">
                Capture o momento com moldura personalizada
              </p>
            </div>

            <div className="bg-primary-50 p-6 rounded-xl">
              <Image className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Compartilhe</h3>
              <p className="text-gray-600 text-sm">
                Sua foto vai para o álbum do evento
              </p>
            </div>
          </div>

          <div className="mt-12 flex gap-4 justify-center">
            <Link
              href="/admin/login"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Área do Administrador
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
