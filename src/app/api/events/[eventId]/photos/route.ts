import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { data: photos, error } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', params.eventId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fotos' },
      { status: 500 }
    )
  }
}
