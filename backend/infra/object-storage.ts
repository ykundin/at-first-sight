import AWS from "aws-sdk";

export class ObjectStorage {
  #client: AWS.S3;

  #bucket: string;

  constructor() {
    this.#client = new AWS.S3({
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
