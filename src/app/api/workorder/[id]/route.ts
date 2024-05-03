import {NextResponse} from 'next/server'
import {prisma} from '@/app/libs/prisma'

interface Params {
    params: {id: string}
}

export async function GET(request: Request, {params}: Params){
    const note = await prisma.workOrder.findFirst({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(note)
}

export async function DELETE(request: Request, {params}: Params){
    const note = await prisma.workOrder.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(note)
}

export async function PUT(request: Request, {params}: Params){
    try {
        const {product, client} = await request.json()
        const note = await prisma.workOrder.update({
            where: {
                id: Number(params.id)
            },
            data:{
                product,
                client
            }
        })
        return NextResponse.json(note)
    } catch (error) {
        return NextResponse.json({
            status: 500,
            body: 'Error al editar el registro.'
        });
    }
}