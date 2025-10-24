import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    console.log(`Fetching photos for event: ${params.eventId}`)
    
    const { data: photos, error, count } = await supabase
      .from('photos')
      .select('*', { count: 'exact' })
      .eq('event_id', params.eventId)
      .order('created_at', { ascending: false })
      .limit(1000) // Set a high limit to ensure we get all photos
    
    console.log(`Found ${count} photos in database for event ${params.eventId}`)
    console.log(`Returning ${photos?.length || 0} photos in response`)

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
