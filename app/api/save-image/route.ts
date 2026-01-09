import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const { imageData, fileName, directory } = await request.json()

        if (!imageData || !fileName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')

        const targetDir = path.join(process.cwd(), 'public', 'images', directory || 'shops-cover-images')

        await mkdir(targetDir, { recursive: true })

        const filePath = path.join(targetDir, fileName)
        await writeFile(filePath, buffer)

        const publicPath = `/images/${directory || 'shops-cover-images'}/${fileName}`

        return NextResponse.json({
            success: true,
            path: publicPath
        })
    } catch (error) {
        console.error('Error saving image:', error)
        return NextResponse.json(
            { error: 'Failed to save image' },
            { status: 500 }
        )
    }
}
