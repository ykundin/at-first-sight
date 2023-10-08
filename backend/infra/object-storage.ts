import AWS from "aws-sdk";

export class ObjectStorage {
  #client: AWS.S3;

  #bucket: string;

  constructor() {
    this.#client = new AWS.S3({
      credentials: {
        accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY || "",
        secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY || "",
      },
      endpoint: process.env.OBJECT_STORAGE_ENDPOINT || "",
      s3ForcePathStyle: true,
      region: "us-east-1",
      apiVersion: "latest",
    });

    this.#bucket = process.env.OBJECT_STORAGE_BUCKET || "";
  }

  uploadFile(key: string, file: any) {
    return this.#client
      .upload({
        Bucket: this.#bucket,
        Key: key,
        Body: file,
      })
      .promise();
  }
}
