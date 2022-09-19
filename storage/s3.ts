import AWS from 'aws-sdk'

export async function S3Upload(bucket: string, key: string, body: string): Promise<boolean> {
    const s3 = new AWS.S3()
    await s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: body
    }, (_err, data) => {
        if (data?.ETag) console.log(`[INF] Upload successful`)
        else console.log(`[ERR] S3 upload failed!`)
        
    })
    return true
}