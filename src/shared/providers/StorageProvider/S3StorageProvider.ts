import uploadConfig from '@config/upload'
import fs from 'fs'
import path from 'path'
import aws, { S3 } from 'aws-sdk'
import mime from 'mime'

export default class S3torageProvider {
  private client: S3

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACESS_KEY as string,
      },
    })
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file)

    const ContentType = mime.getType(originalPath)

    if (!ContentType) {
      throw new Error('File not found')
    }

    const fileContent = await fs.promises.readFile(originalPath)

    await this.client
      .putObject({
        Bucket: 'api-blog-uploads',
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise()
    await fs.promises.unlink(originalPath)

    return file
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise()
  }
}
