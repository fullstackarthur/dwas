import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiFileText, FiCheckCircle, FiCpu, FiEye, FiDownload } from 'react-icons/fi'

export const OCRPreviewPanel = memo(function OCRPreviewPanel() {
  const { attachments } = useThreadDataStore()
  const ocrFiles = attachments.filter((a) => a.ocrExtracted)

  if (ocrFiles.length === 0) return null

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">OCR Extraction Preview</h2>
      <div className="space-y-2">
        {ocrFiles.map((att) => (
          <div key={att.id} className="border border-border-panel rounded-md">
            <div className="px-3 py-2 border-b border-divider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-text-muted" />
                <span className="text-[12px] text-text-primary">{att.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {att.aiReviewed && (
                  <span className="flex items-center gap-1 text-[10px] text-active-blue">
                    <FiCpu className="w-3 h-3" />
                    AI Reviewed
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px] text-success-green">
                  <FiCheckCircle className="w-3 h-3" />
                  OCR Complete
                </span>
              </div>
            </div>
            <div className="p-3 bg-bg-tertiary">
              <div className="text-[11px] text-text-muted mb-2">Extracted fields:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-text-muted">Document Type:</span>
                  <span className="text-text-primary ml-1">{att.name.includes('PO') ? 'Purchase Order' : att.name.includes('Certificate') ? 'Certificate' : att.name.includes('Gate') ? 'Gate Pass' : 'Other'}</span>
                </div>
                <div>
                  <span className="text-text-muted">Format:</span>
                  <span className="text-text-primary ml-1 uppercase">{att.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button className="flex items-center gap-1 px-2 py-1 text-[10px] text-text-secondary bg-bg-secondary border border-border-panel rounded hover:bg-hover-surface transition-colors duration-120">
                  <FiEye className="w-3 h-3" />
                  Preview
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-[10px] text-text-secondary bg-bg-secondary border border-border-panel rounded hover:bg-hover-surface transition-colors duration-120">
                  <FiDownload className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
