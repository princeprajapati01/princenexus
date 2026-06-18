import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'resume_url' }
    });
    
    if (setting?.value) {
      return NextResponse.redirect(setting.value);
    }
  } catch (err) {
    console.error('Failed to fetch resume from database settings:', err);
  }

  // Fallback: Serve the local public/resume.pdf if it exists
  try {
    const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
      },
    });
  } catch (err) {
    return new NextResponse('Resume not found', { status: 404 });
  }
}
