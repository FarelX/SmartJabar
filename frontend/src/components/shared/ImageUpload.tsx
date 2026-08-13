import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value?: string | null
  onChange: (previewUrl: string, file?: File) => void
  onRemove?: () => void
  label?: string
  aspectRatio?: 'square' | 'banner'
  maxSizeMB?: number
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif']
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Upload Gambar',
  aspectRatio = 'square',
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndProcessFile = (file: File) => {
    // 1. Validasi tipe file (Security protection)
    const isValidType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))
    if (!isValidType) {
      toast.error('Format file tidak didukung! Hanya diperbolehkan PNG, JPG, WEBP, atau SVG.')
      return
    }

    // 2. Validasi ukuran file (Max size)
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast.error(`Ukuran file terlalu besar! Maksimal ${maxSizeMB}MB.`)
      return
    }

    // 3. Buat preview URL untuk tampilan visual langsung
    const reader = new FileReader()
    reader.onload = (e) => {
      const resultUrl = e.target?.result as string
      onChange(resultUrl, file)
      toast.success(`File "${file.name}" siap diunggah!`)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      validateAndProcessFile(files[0])
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      validateAndProcessFile(files[0])
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inputRef.current) inputRef.current.value = ''
    if (onRemove) {
      onRemove()
    } else {
      onChange('')
    }
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-slate-700 text-xs font-semibold block">{label}</label>}

      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Preview container */
        <div
          className={`relative group rounded-xl border border-slate-200 bg-slate-50/70 p-2 flex items-center justify-center overflow-hidden transition-all ${
            aspectRatio === 'banner' ? 'h-40 w-full' : 'h-32 w-full max-w-[240px]'
          }`}
        >
          <img
            src={value}
            alt="Preview"
            className={`max-h-full max-w-full object-contain rounded-lg drop-shadow-2xs`}
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-all flex items-center justify-center gap-2 rounded-xl">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-800 rounded-lg shadow-sm hover:bg-slate-100 transition-all cursor-pointer"
            >
              Ganti Gambar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-all cursor-pointer"
              title="Hapus gambar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Upload dropzone */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary-500 bg-primary-50/50 scale-[1.01]'
              : 'border-slate-200 hover:border-primary-400 bg-slate-50/50 hover:bg-blue-50/20'
          } ${aspectRatio === 'banner' ? 'h-36 w-full' : 'h-32 w-full'}`}
        >
          <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-2 shadow-2xs">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            Klik untuk pilih file <span className="font-normal text-slate-500">atau drag & drop</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            PNG, JPG, WEBP, SVG (Maks. {maxSizeMB}MB)
          </p>
        </div>
      )}
    </div>
  )
}
