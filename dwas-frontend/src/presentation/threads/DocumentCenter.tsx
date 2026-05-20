import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiFileText, FiImage, FiTable, FiFile, FiPaperclip, FiCheckCircle, FiCpu, FiEye } from 'react-icons/fi'

export const DocumentCenter = memo(function DocumentCenter() {
  const { attachments } = useThreadDataStore()

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    pdf: FiFileText,
    image: FiImage,
    excel: FiTable,
    doc: FiFile,
    other: FiPaperclip,
  }

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Documents ({attachments.length})</h2>
      <div className="space-y-2">
        {attachments.map((att) => {
          const Icon = typeIcons[att.type] || FiPaperclip

          return (
            <div key={att.id} className="border border-border-panel rounded-md hover:bg-hover-surface/50 transition-colors duration-120">
              <div className="px-3 py-2.5 flex items-center gap-3">
                <div className="p-2 rounded bg-bg-tertiary">
                  <Icon className="w-4 h-4 text-text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-text-primary truncate">{att.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-text-muted">{formatSize(att.size)}</span>
                    <span className="text-text-muted text-[10px]">·</span>
                    <span className="text-[10px] text-text-muted">{att.uploadedBy.name}</span>
                    <span className="text-text-muted text-[10px]">·</span>
                    <span className="text-[10px] text-text-muted">{timeAgo(att.uploadedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {att.ocrExtracted && (
                    <span className="flex items-center gap-1 text-[10px] text-success-green" title="OCR extracted">
                      <FiCheckCircle className="w-3 h-3" />
                      OCR
                    </span>
                  )}
                  {att.aiReviewed && (
                    <span className="flex items-center gap-1 text-[10px] text-active-blue" title="AI reviewed">
                      <FiCpu className="w-3 h-3" />
                      AI
                    </span>
                  )}
                  <button className="p-1 text-text-muted hover:text-text-primary transition-colors duration-120" title="Preview">
                    <FiEye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
