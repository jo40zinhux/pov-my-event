export interface Event {
  id: string
  name: string
  frame_url: string | null
  created_at: string
}

export interface Photo {
  id: string
  event_id: string
  photo_url: string
  created_at: string
}

export interface CreateEventInput {
  name: string
  frame_url?: string
}

export interface UploadPhotoInput {
  event_id: string
  photo_data: string // base64 ou blob
}
