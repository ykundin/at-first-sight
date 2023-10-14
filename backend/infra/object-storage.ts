import S3 from "aws-sdk/clients/s3";

export class ObjectStorage {
  #client: S3;

  #bucket: string;

  constructor() {
    this.#client = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
      endpoint: process.env.AWS_ENDPOINT || "",
      s3ForcePathStyle: true,
      region: "us-east-1",
      apiVersion: "latest",
    });

    this.#bucket = process.env.AWS_BUCKET || "";
  }

  async uploadFile(key: string, file: Buffer) {
    return new Promise<any>((resolve, reject) => {
      this.#client.upload(
        {
          Bucket: this.#bucket,
          Key: key,
          Body: file,
        },
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        }
      );
    });
  }
}
