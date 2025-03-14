import multer from "multer";
export class MulterImpl {
    upload;
    constructor() {
        this.upload = multer({
            storage: multer.memoryStorage(),
        });
    }
}
