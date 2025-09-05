import { redirect } from 'next/navigation'
import { requireAdminAuth } from '@/lib/auth'
import { AdminDashboard } from '@/components/AdminDashboard'

export default async function AdminPage() {
  const session = await requireAdminAuth()

  return <AdminDashboard username={session.username!} />
}
