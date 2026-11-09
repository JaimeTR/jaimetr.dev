import { NextResponse } from 'next/server'
import { proyectosDelErp } from '@/lib/erp'
export const revalidate = 600
export async function GET() { return NextResponse.json((await proyectosDelErp()) || []) }
