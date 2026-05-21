import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { FiFile, FiImage, FiFileText, FiPaperclip } from 'react-icons/fi'
import { formatFileSize } from '../../../core/utils'
import { OCRProcessingIndicator } from './OCRProcessingIndicator'

interface RFQDocumentCenterProps {
  rfq: RFQ
}

export const RFQDocumentCenter = memo(function RFQDocumentCenter({ rfq }: RFQDocumentCenterProps) {
  return (
    <div className="panel">
      <div className="panel-header flex items-center">
        <h3 className="panel-title">Documents</h3>
        <span className="text-[11px] text-text-muted ml-2">{rfq.documents.length} files</span>
      </div>
      <div className="p-3">
        {rfq.documents.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-[12px] text-text-muted">No documents attached</div>
          </div>
        ) : (
          <div className="space-y-2">
            {rfq.documents.map((doc) => {
              const Icon = doc.type === 'pdf' ? FiFileText : doc.type === 'image' ? FiImage : FiFile
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-hover-surface transition-colors duration-120 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded bg-bg-tertiary flex items-center justify-center">
                    <Icon className="w-4 h-4 text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-text-primary truncate">
                      {doc.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                      <span>{formatFileSize(doc.size)}</span>
                      {doc.ocrProcessed === false && <OCRProcessingIndicator />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
})