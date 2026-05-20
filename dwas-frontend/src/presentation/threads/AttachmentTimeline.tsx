import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiFileText, FiImage, FiTable, FiFile, FiPaperclip } from 'react-icons/fi'

export const AttachmentTimeline = memo(function AttachmentTimeline() {
  const { attachments } = useThreadDataStore()
  const sorted = [...attachments].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    pdf: FiFileText,
    image: FiImage,
    excel: FiTable,
    doc: FiFile,
    other: FiPaperclip,
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
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Attachment Timeline</h2>
      <div className="space-y-0">
        {sorted.map((att, i) => {
          const Icon = typeIcons[att.type] || FiPaperclip

          return (
            <div key={att.id} className="flex items-start gap-3 py-2.5">
              <div className="flex flex-col items-center">
                <div className="p-1.5 rounded bg-bg-tertiary">
                  <Icon className="w-3.5 h-3.5 text-text-muted" />
                </div>
                {i < sorted.length - 1 && <div className="w-px h-6 bg-divider mt-1" />}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-[12px] text-text-primary truncate">{att.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-text-muted">{att.uploadedBy.name}</span>
                  <span className="text-text-muted text-[10px]">·</span>
                  <span className="text-[10px] text-text-muted">{timeAgo(att.uploadedAt)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
