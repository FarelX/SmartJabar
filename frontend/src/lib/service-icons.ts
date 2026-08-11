import {
  Users, FileText, BarChart3, Eye, DollarSign,
  Briefcase, Database, Shield, Globe, Layers
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Mapping kategori layanan → ikon Lucide.
 * Sesuai kebutuhan CLAUDE.md: pakai ikon generik dari Lucide.
 */
const categoryIconMap: Record<string, LucideIcon> = {
  'Kepegawaian': Users,
  'Dokumen': FileText,
  'Data': BarChart3,
  'Pengawasan': Eye,
  'Keuangan': DollarSign,
}

const fallbackIcon = Layers

export function getServiceIcon(categoryName?: string): LucideIcon {
  if (!categoryName) return fallbackIcon
  return categoryIconMap[categoryName] || fallbackIcon
}

/**
 * Semua ikon yang tersedia untuk pemilihan di admin panel.
 */
export const availableIcons: { name: string; icon: LucideIcon }[] = [
  { name: 'Users', icon: Users },
  { name: 'FileText', icon: FileText },
  { name: 'BarChart3', icon: BarChart3 },
  { name: 'Eye', icon: Eye },
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Database', icon: Database },
  { name: 'Shield', icon: Shield },
  { name: 'Globe', icon: Globe },
  { name: 'Layers', icon: Layers },
]
