import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'

// Lazy-load app salt to avoid build-time errors
// Only evaluated when actually needed at runtime
let _appSalt: string | null = null

function getAppSalt(): string {
  if (_appSalt) return _appSalt
  
  const salt = process.env.CRYPTO_SALT || process.env.SESSION_SECRET
  if (!salt) {
    // Allow fallback during build phase (NEXT_PHASE is set during build)
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || 
                        process.env.NEXT_PHASE === 'phase-development-build'
    
    if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
      throw new Error('CRYPTO_SALT or SESSION_SECRET environment variable is required in production')
    }
    
    if (!isBuildPhase) {
      console.warn('⚠️  WARNING: CRYPTO_SALT not set, using fallback. This is insecure for production!')
    }
    _appSalt = 'fallback-salt'
    return _appSalt
  }
  
  _appSalt = salt
  return _appSalt
}

export function hashCode(code: string): string {
  return createHash('sha256')
    .update(code + getAppSalt())
    .digest('hex')
}

export function getCodeLast4(code: string): string {
  return code.slice(-4)
}

export function hashSecurityCode(securityCode: string): string {
  return createHash('sha256')
    .update(`security:${securityCode}${getAppSalt()}`)
    .digest('hex')
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10)
}

export async function compareOtp(otp: string, hash: string): Promise<boolean> {
  // Never log the actual OTP or hash details in production
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Comparing OTP (length:', otp.length, ')')
  }
  
  return await bcrypt.compare(otp, hash)
}

export function generateOtp(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  return otp
}

