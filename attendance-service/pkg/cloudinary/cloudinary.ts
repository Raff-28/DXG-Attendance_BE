import { ConfigOptions, v2 as cloudinary } from "cloudinary";
import { ErrInternalServer } from "../../src/errors/http.js";

export interface Cloudinary {
  uploadImage(imageBuffer: Buffer, mimetype: string): Promise<string>;
}

export class CloudinaryImpl implements Cloudinary {
  folder: string;
  config: ConfigOptions;
  constructor() {
    this.config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
    this.folder = process.env.CLOUDINARY_TARGET_FOLDER || "Home";
  }

  async uploadImage(imageBuffer: Buffer, mimetype: string): Promise<string> {
    try {
      cloudinary.config(this.config);
      const base64String = bufferToBase64(imageBuffer, mimetype);
      const result = await cloudinary.uploader.upload(base64String, {
        resource_type: "image",
        folder: this.folder,
      });
      return result.secure_url;
    } catch (e) {
      throw ErrInternalServer;
    }
  }
}

function bufferToBase64(buffer: Buffer, mimetype: string) {
  return `data:${mimetype};base64,${buffer.toString("base64")}`;
}
