import { redirect } from 'next/navigation'
import { requireAdminAuth } from '@/lib/auth'
import { BookingDetailPage } from '@/components/BookingDetailPage'

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminBookingDetailPage({ params }: BookingDetailPageProps) {
  const session = await requireAdminAuth()
  const { id } = await params

  return <BookingDetailPage bookingId={id} username={session.username!} />
}
