import multer from "multer";

export interface Multer {}

export class MulterImpl implements Multer {
  upload: multer.Multer;
  constructor() {
    this.upload = multer({
      storage: multer.memoryStorage(),
    });
  }
}
