// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("file") as unknown as File;

  if (!file) return NextResponse.json({ error: "File missing" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${randomUUID()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);

  const url = `https://${BUCKET}.s3.eu-north-1.amazonaws.com/${filename}`;
  return NextResponse.json({ url });
}
