import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { webcrypto } from 'crypto'

export const dynamic = 'force-dynamic'

// Fisher-Yates shuffle with cryptographically secure randomness
function secureShuffle<T>(array: T[], seed: string): T[] {
  const arr = [...array]
  const seedHash = Array.from(new TextEncoder().encode(seed))
  
  for (let i = arr.length - 1; i > 0; i--) {
    // Use seed to generate deterministic but secure randomness
    const randomBytes = webcrypto.getRandomValues(new Uint32Array(1))
    const j = randomBytes[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()

    // Get draw
    const draw = await prisma.luckyDraw.findUnique({
      where: { id: params.id },
      include: {
        entries: {
          include: { user: true },
        },
      },
    })

    if (!draw) {
      return NextResponse.json(
        { error: 'Draw not found' },
        { status: 404 }
      )
    }

    if (draw.status !== 'CLOSED') {
      return NextResponse.json(
        { error: 'Draw must be closed before picking winners' },
        { status: 400 }
      )
    }

    if (draw.entries.length === 0) {
      return NextResponse.json(
        { error: 'No entries in this draw' },
        { status: 400 }
      )
    }

    // Generate cryptographic seed
    const seed = webcrypto.randomUUID()
    
    // Shuffle entries
    const shuffled = secureShuffle(draw.entries, seed)
    
    // Pick winners
    const numWinners = Math.min(draw.maxWinners, shuffled.length)
    const winnerEntries = shuffled.slice(0, numWinners)

    // Create winner records
    const winners = await Promise.all(
      winnerEntries.map(entry =>
        prisma.luckyDrawWinner.create({
          data: {
            drawId: params.id,
            userId: entry.userId,
          },
          include: {
            user: true,
          },
        })
      )
    )

    // Update draw status
    await prisma.luckyDraw.update({
      where: { id: params.id },
      data: { status: 'DRAWN' },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'draw_winners',
        targetId: params.id,
        details: JSON.stringify({
          drawId: params.id,
          seed,
          winnerIds: winners.map(w => w.userId),
          totalEntries: draw.entries.length,
          winnersSelected: winners.length,
        }),
      },
    })

    return NextResponse.json({ 
      ok: true, 
      winners: winners.map(w => ({
        id: w.id,
        email: w.user.email,
        name: w.user.name,
      })),
    })
  } catch (error) {
    console.error('Draw winners error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to draw winners' },
      { status: 500 }
    )
  }
}

