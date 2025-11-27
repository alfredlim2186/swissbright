'use client'

import { useEffect } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'default'
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const confirmButtonStyle: React.CSSProperties = {
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...(variant === 'danger'
      ? {
          background: 'rgba(248, 113, 113, 0.2)',
          border: '1px solid rgba(248, 113, 113, 0.5)',
          color: '#F87171',
        }
      : {
          border: 'none',
          background: '#C9A86A',
          color: '#050505',
        }),
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(201, 168, 106, 0.08) 50%, rgba(10, 10, 10, 0.98) 100%)',
          border: variant === 'danger' ? '2px solid rgba(248, 113, 113, 0.4)' : '2px solid rgba(201, 168, 106, 0.4)',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          padding: '2rem',
          position: 'relative',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#B8B8B8',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            lineHeight: 1,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F8F8F8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#B8B8B8'
          }}
        >
          ✕
        </button>

        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.75rem',
            color: variant === 'danger' ? '#F87171' : '#F8F8F8',
            marginBottom: '1rem',
            marginRight: '2rem',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: '#B8B8B8',
            lineHeight: 1.6,
            marginBottom: '2rem',
            fontSize: '0.95rem',
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid rgba(201,168,106,0.4)',
              background: 'transparent',
              color: '#C9A86A',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201,168,106,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={confirmButtonStyle}
            onMouseEnter={(e) => {
              if (variant === 'danger') {
                e.currentTarget.style.background = 'rgba(248, 113, 113, 0.3)'
              } else {
                e.currentTarget.style.background = '#D4B882'
              }
            }}
            onMouseLeave={(e) => {
              if (variant === 'danger') {
                e.currentTarget.style.background = 'rgba(248, 113, 113, 0.2)'
              } else {
                e.currentTarget.style.background = '#C9A86A'
              }
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

