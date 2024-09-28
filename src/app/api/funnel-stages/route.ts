// import { NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const organizationId = searchParams.get('organizationId')

//   if (!organizationId) {
//     return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
//   }

//   const stages = await prisma.funnelStage.findMany({
//     where: { organizationId },
//     include: {
//       deals: {
//         include: {
//           contacts: true,
//           assignedTeam: true,
//         },
//       },
//     },
//     orderBy: { orderIndex: 'asc' },
//   })

//   return NextResponse.json(stages)
// }

// export async function POST(request: Request) {
//   const body = await request.json()
//   const { title, organizationId } = body

//   if (!title || !organizationId) {
//     return NextResponse.json({ error: 'Title and organization ID are required' }, { status: 400 })
//   }

//   const lastStage = await prisma.funnelStage.findFirst({
//     where: { organizationId },
//     orderBy: { orderIndex: 'desc' },
//   })

//   const newStage = await prisma.funnelStage.create({
//     data: {
//       title,
//       organizationId,
//       orderIndex: lastStage ? lastStage.orderIndex + 1 : 0,
//     },
//   })

//   return NextResponse.json(newStage)
// }

// export async function PUT(request: Request) {
//   const body = await request.json()
//   const { id, title, orderIndex } = body

//   if (!id) {
//     return NextResponse.json({ error: 'Stage ID is required' }, { status: 400 })
//   }

//   const updatedStage = await prisma.funnelStage.update({
//     where: { id },
//     data: { title, orderIndex },
//   })

//   return NextResponse.json(updatedStage)
// }

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const id = searchParams.get('id')

//   if (!id) {
//     return NextResponse.json({ error: 'Stage ID is required' }, { status: 400 })
//   }

//   await prisma.funnelStage.delete({
//     where: { id },
//   })

//   return NextResponse.json({ success: true })
// }