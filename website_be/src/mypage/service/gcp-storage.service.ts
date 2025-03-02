import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as crypto from "crypto";
import { version } from 'os';

@Injectable()
export class GCPStorageService {
  private storage: Storage;
  private bucketName = process.env.GCP_BUCKET_NAME;//'profile-img-bucket'; // GCP에 설정한 버킷 이름

  constructor() {
    // this.storage = new Storage({
    //   keyFilename: process.env.GCP_KEY_FILE, //'./gcp_bucket_key.json', // JSON 키 파일 경로
    // });
    this.storage = new Storage();
  }

  async uploadFile(user_id: number, file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();


    blob.name = this.makeFileName(user_id);

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


  async getSignedUrl(user_id: number) {
    try{
      const fileName = this.makeFileName(user_id);

      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      
      const options: any = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 60 * 60 * 1000,
      };
      const [signedUrl] = await file.getSignedUrl(options);
      return {
        file_name: fileName,
        signedurl: signedUrl
      };
    } catch (error) {
      throw new InternalServerErrorException(`Signed URL을 가져오는 중 오류가 발생했습니다. ${error}`);
    }
  }

  makeFileName(user_id: number): string {
    const timestamp = Date.now().toString();
    // 해시값 생성 (userId, timestamp를 기반으로)
    const hash = crypto
      .createHash('sha256')
      .update(timestamp)
      .digest('hex')
      .slice(0, 8);

    return `${user_id}_${hash}`;
  }
}