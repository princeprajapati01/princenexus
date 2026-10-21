import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // 'resume' or 'media'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Check file size (Vercel serverless function maximum limit is 4.5 MB)
    const MAX_SIZE_BYTES = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          success: false,
          error: `File size (${sizeMB} MB) exceeds the 4.5 MB direct upload limit on Vercel. For demo videos (up to 200MB+), please host on YouTube, Google Drive, Vimeo, or Cloud storage and paste the link.`,
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (type === 'resume') {
      // Save directly as public/resume.pdf
      const publicPath = path.join(process.cwd(), 'public');
      const filePath = path.join(publicPath, 'resume.pdf');
      
      // Ensure public directory exists
      await mkdir(publicPath, { recursive: true });
      await writeFile(filePath, buffer);
      
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
    const isReadOnlyFs = error?.code === 'EROFS';
    const message = isReadOnlyFs
      ? 'Vercel serverless environment does not support local disk writes. Please provide a YouTube, Google Drive, or Cloud video link.'
      : (error?.message || 'Failed to upload file');
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
