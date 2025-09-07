
import { NextRequest } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: NextRequest) {
  // Token-based authentication
  const auth = req.headers.get('authorization');
  if (!auth || auth !== `Bearer ${process.env.API_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400 });
    }

    // 1. Set up OpenAI embeddings and Pinecone client
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
      model: 'text-embedding-3-small',
    });
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });
    const index = pinecone.Index(process.env.PINECONE_INDEX!);

    // 2. Use LangChain PineconeStore as retriever
    const { PineconeStore } = await import('@langchain/community/vectorstores/pinecone');
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
    });
    const retriever = vectorStore.asRetriever({ k: 5 });
    const docs = await retriever.invoke(prompt  );
    const docContents = docs.map(doc => doc.pageContent).filter(Boolean);
    if (docContents.length === 0) {
      return new Response(JSON.stringify({ error: 'No relevant information found.' }), { status: 404 });
    }
    const SYSTEM_PROMPT = `You are a helpful assistant. Check your knowledge base before answering any questions.\nOnly respond to questions using information from tool calls.\nIf no relevant information is found in the tool calls, respond, "Sorry, I don't know."\nAlways format your answer using markdown (including lists, code, tables, headings, etc.) for best display to the user.\nKnowledge base:\n${docContents.join('\n---\n')} .`;

    // 3. Use OpenAI LLM to answer (streaming)
    const result = streamText({
      model: openai('gpt-4.1-nano'),
      system: SYSTEM_PROMPT,
      prompt: prompt,
    });
    return result.toUIMessageStreamResponse();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
