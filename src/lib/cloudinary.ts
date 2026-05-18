import { v2 as cloudinary } from "cloudinary";

let configured = false;

function invalidPlaceholder(value: string): boolean {
  return value.startsWith("TU_") || value.startsWith("REPLACE_");
}

function ensureCloudinary() {
  if (!configured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "";
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? "";
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() ?? "";

    if (!cloudName || !apiKey || !apiSecret || invalidPlaceholder(cloudName) || invalidPlaceholder(apiKey)) {
      throw new Error("Cloudinary no configurado: completa CLOUDINARY_CLOUD_NAME y CLOUDINARY_API_KEY en .env.local");
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    configured = true;
  }
}

export async function uploadImageToCloudinary(file: File, folder = "amigo-invisible/shirts"): Promise<string> {
  ensureCloudinary();

  const bytes = Buffer.from(await file.arrayBuffer());

  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(new Error(error?.message || "Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      },
    );

    stream.end(bytes);
  });
}
