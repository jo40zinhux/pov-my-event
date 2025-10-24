import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

function base64ToBuffer(base64: string): Buffer {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
  return Buffer.from(base64Data, 'base64')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_id, photo_data } = body

    if (!event_id || !photo_data) {
      return NextResponse.json(
        { error: 'event_id e photo_data são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o evento existe
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    // Converter base64 para buffer
    const imageBuffer = base64ToBuffer(photo_data)
    const fileName = `${event_id}/${uuidv4()}.jpg`

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('event-photos')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Erro ao fazer upload da foto' },
        { status: 500 }
      )
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('event-photos')
      .getPublicUrl(fileName)

    const photoUrl = urlData.publicUrl

    // Salvar no banco de dados
    const { data: photo, error: dbError } = await supabase
      .from('photos')
      .insert({
        event_id,
        photo_url: photoUrl,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Erro ao salvar foto no banco de dados' },
        { status: 500 }
      )
    }

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json(
      { error: 'Erro interno ao processar upload' },
      { status: 500 }
    )
  }
}
