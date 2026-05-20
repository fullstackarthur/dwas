import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiFileText } from 'react-icons/fi'

export const DocumentMetadataPanel = memo(function DocumentMetadataPanel() {
  const { attachments } = useThreadDataStore()

  if (attachments.length === 0) return null

  const totalSize = attachments.reduce((sum, a) => sum + a.size, 0)
  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Document Metadata</h2>
      <div className="border border-border-panel rounded-md">
        <div className="px-3 py-2 border-b border-divider">
          <span className="text-[11px] text-text-muted">{attachments.length} document{attachments.length !== 1 ? 's' : ''} · {formatSize(totalSize)} total</span>
        </div>
        <div className="divide-y divide-divider">
          {attachments.map((att) => (
            <div key={att.id} className="px-3 py-2">
              <div className="flex items-center gap-2 text-[11px]">
                <FiFileText className="w-3 h-3 text-text-muted" />
                <span className="text-text-primary truncate">{att.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 ml-5 text-[10px] text-text-muted">
                <span>{att.type.toUpperCase()}</span>
                <span>·</span>
                <span>{formatSize(att.size)}</span>
                <span>·</span>
                <span>{att.uploadedBy.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
