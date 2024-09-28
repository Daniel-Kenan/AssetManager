// import { NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// export async function POST(request: Request) {
//   const body = await request.json()
//   const { company, value, probability, imageUrl, description, organizationId, stageId, contacts, assignedTeam } = body

//   if (!company || !organizationId || !stageId) {
//     return NextResponse.json({ error: 'Company, organization ID, and stage ID are required' }, { status: 400 })
//   }

//   const newDeal = await prisma.deal.create({
//     data: {
//       company,
//       value,
//       probability,
//       imageUrl,
//       description,
//       organizationId,
//       stage: { connect: { id: stageId } },
//       contacts: {
//         create: contacts,
//       },
//       assignedTeam: {
//         connectOrCreate: assignedTeam.map((name: string) => ({
//           where: { name_organizationId: { name, organizationId } },
//           create: { name, organizationId },
//         })),
//       },
//     },
//     include: {
//       contacts: true,
//       assignedTeam: true,
//     },
//   })

//   return NextResponse.json(newDeal)
// }

// export async function PUT(request: Request) {
//   const body = await request.json()
//   const { id, company, value, probability, imageUrl, description, stageId, contacts, assignedTeam } = body

//   if (!id) {
//     return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 })
//   }

//   const updatedDeal = await prisma.deal.update({
//     where: { id },
//     data: {
//       company,
//       value,
//       probability,
//       imageUrl,
//       description,
//       stage: stageId ? { connect: { id: stageId } } : undefined,
//       contacts: {
//         deleteMany: {},
//         create: contacts,
//       },
//       assignedTeam: {
//         set: [],
//         connectOrCreate: assignedTeam.map((name: string) => ({
//           where: { name_organizationId: { name, organizationId: updatedDeal.organizationId } },
//           create: { name, organizationId: updatedDeal.organizationId },
//         })),
//       },
//     },
//     include: {
//       contacts: true,
//       assignedTeam: true,
//     },
//   })

//   return NextResponse.json(updatedDeal)
// }

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const id = searchParams.get('id')

//   if (!id) {
//     return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 })
//   }

//   await prisma.deal.delete({
//     where: { id },
//   })

//   return NextResponse.json({ success: true })
// }