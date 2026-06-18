import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // 'resume' or 'media'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    if (hasBlobToken) {
      // Upload using Vercel Blob
      const pathname = type === 'resume' ? 'resume.pdf' : `uploads/${file.name}`;
      
      const blob = await put(pathname, file, {
        access: 'public',
        addRandomSuffix: type !== 'resume', // don't add random suffix to resume.pdf so it stays at /resume.pdf
      });

      // If it's a resume, update the database setting so the redirect route picks it up
      if (type === 'resume') {
        await prisma.settings.upsert({
          where: { key: 'resume_url' },
          update: { value: blob.url },
          create: { key: 'resume_url', value: blob.url },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'File uploaded to Vercel Blob successfully',
        url: blob.url,
      });
    }

    // Fallback: Save to local filesystem
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (type === 'resume') {
      // Save directly as public/resume.pdf
      const publicPath = path.join(process.cwd(), 'public');
      const filePath = path.join(publicPath, 'resume.pdf');
      
      // Ensure public directory exists
      await mkdir(publicPath, { recursive: true });
      await writeFile(filePath, buffer);
      
      // Clear database custom resume URL since we are fallback local
      try {
        await prisma.settings.delete({
          where: { key: 'resume_url' }
        });
      } catch (e) {
        // Ignore if it doesn't exist
      }

      return NextResponse.json({
        success: true,
        message: 'Resume uploaded successfully',
        url: '/resume.pdf',
      });
    } else {
      // Save in public/uploads
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      // Ensure directory exists
      await mkdir(uploadsDir, { recursive: true });

      // Create unique clean filename
      const fileExtension = path.extname(file.name);
      const fileNameWithoutExt = path.basename(file.name, fileExtension)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      const uniqueName = `${fileNameWithoutExt}_${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, uniqueName);

      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully',
        url: `/uploads/${uniqueName}`,
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
