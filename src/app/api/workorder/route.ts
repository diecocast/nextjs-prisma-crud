import {NextResponse} from 'next/server'
import {prisma} from '@/app/libs/prisma'

export async function GET(){
    const notes = await prisma.workOrder.findMany()
    return NextResponse.json(notes)
}

export async function POST(request: Request){
    const {product, client} = await request.json()
    const count = await prisma.workOrder.count();
    const cot = `COT-${count + 1}`;
    const newNote = await prisma.workOrder.create({
        data: {
            cot,
            client,
            product
        }
    })
    return NextResponse.json(newNote)
}