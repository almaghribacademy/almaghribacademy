import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: 'auto' | 'image' | 'raw' | 'video' = 'auto'
): Promise<{ secure_url: string; public_id: string; resource_type: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `AlMaghrib-academy/teachers/${folder}`,
        resource_type: resourceType,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'mp3', 'wav', 'm4a', 'webm'],
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            secure_url: result?.secure_url || '',
            public_id: result?.public_id || '',
            resource_type: result?.resource_type || 'auto',
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

// Delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

export default cloudinary;