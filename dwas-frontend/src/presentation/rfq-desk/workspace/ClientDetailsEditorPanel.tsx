import { memo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiAlertCircle } from 'react-icons/fi'
import type { RFQ, ClientDetails } from '../../../core/types/rfq'
import { useRFQDeskStore } from '../../stores'

interface ClientDetailsEditorPanelProps {
  rfq: RFQ
  isOpen: boolean
  onClose: () => void
}

export const ClientDetailsEditorPanel = memo(function ClientDetailsEditorPanel({
  rfq,
  isOpen,
  onClose,
}: ClientDetailsEditorPanelProps) {
  const updateClientDetails = useRFQDeskStore((s) => s.updateClientDetails)

  const [form, setForm] = useState<ClientDetails>({
    name: rfq.clientName || '',
    contactName: rfq.clientContact || '',
    email: rfq.clientEmail || '',
    phone: '',
    city: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState(false)

  const handleChange = useCallback((field: keyof ClientDetails, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === 'name') setNameError(false)
    setError(null)
  }, [])

  const handleSave = useCallback(async () => {
    if (!form.name.trim()) {
      setNameError(true)
      return
    }
    setSaving(true)
    setError(null)
    try {
      await updateClientDetails(rfq.id, {
        name: form.name.trim(),
        contactName: form.contactName?.trim() || undefined,
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        city: form.city?.trim() || undefined,
      })
      onClose()
    } catch {
      setError('Failed to save client details. Please try again.')
    } finally {
      setSaving(false)
    }
  }, [form, rfq.id, updateClientDetails, onClose])

  const isEditing = Boolean(rfq.clientName)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[380px] bg-bg-primary border-l border-border-panel z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-panel flex-shrink-0">
              <div>
                <h2 className="text-[14px] font-semibold text-text-primary">
                  {isEditing ? 'Edit Client Details' : 'Add Client Details'}
                </h2>
                <p className="text-[12px] text-text-muted mt-0.5">
                  {rfq.rfqNumber}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-hover-surface transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                  Company Name <span className="text-error-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Tata Motors Ltd."
                    className={`w-full bg-bg-secondary border rounded px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none transition-colors ${
                      nameError
                        ? 'border-error-red focus:border-error-red'
                        : 'border-border-panel focus:border-active-blue'
                    }`}
                  />
                </div>
                {nameError && (
                  <p className="text-[11px] text-error-red mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    Company name is required
                  </p>
                )}
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                  Contact Person
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-bg-secondary border border-border-panel rounded pl-9 pr-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-active-blue transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. contact@company.com"
                    className="w-full bg-bg-secondary border border-border-panel rounded pl-9 pr-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-active-blue transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-bg-secondary border border-border-panel rounded pl-9 pr-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-active-blue transition-colors"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                  City
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="w-full bg-bg-secondary border border-border-panel rounded pl-9 pr-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-active-blue transition-colors"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-error-red/10 border border-error-red/20 rounded text-[12px] text-error-red">
                  <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 px-5 py-4 border-t border-border-panel flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-active-blue text-white text-[13px] font-medium rounded hover:bg-active-blue/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiSave className="w-3.5 h-3.5" />
                )}
                {saving ? 'Saving…' : isEditing ? 'Update Client' : 'Save Client'}
              </button>
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 text-[13px] text-text-secondary hover:text-text-primary hover:bg-hover-surface rounded transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})
