import { NextRequest, NextResponse } from 'next/server';
import { tmpdir } from 'os';
import { writeFile } from 'fs/promises';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false },
};

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from '@langchain/openai';



async function saveUploadedFile(req: NextRequest): Promise<{ filePath: string, originalFilename: string }> {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') throw new Error('No file uploaded');
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const originalFilename = file.name || 'upload.pdf';
  const filePath = path.join(tmpdir(), `${Date.now()}-${originalFilename}`);
  await writeFile(filePath, buffer);
  return { filePath, originalFilename };
}

const pinecone = new PineconeClient();
// Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars

export async function POST(req: NextRequest) {
  // Token-based authentication
  const auth = req.headers.get('authorization');
  if (!auth || auth !== `Bearer ${process.env.API_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    // 1. Parse uploaded PDF using formData
    const { filePath, originalFilename } = await saveUploadedFile(req);

    // 2. Upload to Vercel Blob
    const fileBuffer = await (await import('fs')).promises.readFile(filePath);
    const blob = await put(originalFilename, fileBuffer, { access: 'public' });

    // 3. Use LangChain PDFLoader to extract content
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // 4. Chunk the content
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await splitter.splitDocuments(docs);
    console.log('Split docs', splitDocs);
    // 5. Embed with Gemini
    // const embeddings = new GoogleGenerativeAIEmbeddings({
    //   apiKey: process.env.GEMINI_API_KEY,
    //   model: 'gemini-embedding-001',
    // });
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
      maxConcurrency: 5,
      // You can pass a namespace here too
      // namespace: "foo",
    });

    // 6. Generate embeddings for each chunk
    await vectorStore.addDocuments(splitDocs);

    // 7. Upsert vectors to Pinecone (uncomment and configure as needed)
    // const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    // const index = pinecone.Index(process.env.PINECONE_INDEX!);
    // const upserts = vectors.map((values, i) => ({
    //   id: `pdf-chunk-${Date.now()}-${i}`,
    //   values,
    //   metadata: {
    //     chunk: splitDocs[i].pageContent.slice(0, 100),
    //     blobUrl: blob.url,
    //     originalFilename,
    //     chunkIndex: i,
    //   },
    // }));
    // await index.upsert(upserts);

    return NextResponse.json({
      blobUrl: blob.url,
      chunks: splitDocs.length,
      msg: 'Successfully uploaded and processed the PDF.',
      status: 200,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
