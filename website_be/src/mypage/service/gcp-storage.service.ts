import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GCPStorageService {
  private storage: Storage;
  private bucketName = process.env.GCP_BUCKET_NAME;//'profile-img-bucket'; // GCP에 설정한 버킷 이름

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GCP_KEY_FILE, //'./gcp_bucket_key.json', // JSON 키 파일 경로
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    await bucket.file(fileName).delete();
  }

  async getFileUrl(fileName: string): Promise<string> {
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }
}