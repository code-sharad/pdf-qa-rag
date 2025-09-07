# PDF Q&A Chat Application

A modern, real-time PDF question-answering application built with Next.js, featuring AI-powered document analysis, streaming responses, and a sleek black-and-white UI.

## Demo Video
![demo](https://github.com/user-attachments/assets/96c564e6-ada8-4d39-9c3b-a3080d26670f)

## Website Link
[PDF Q&A App](https://pdf-qa-rag.vercel.app/)
API Token: `hello`


## Features

- 📄 **PDF Upload & Processing**: Upload PDFs and extract content for analysis
- 🤖 **AI-Powered Q&A**: Ask questions about your PDFs and get intelligent answers
- ⚡ **Real-time Streaming**: See answers generate in real-time with streaming responses
- 🎨 **Modern UI**: Clean, responsive design with black-and-white theme
- 🔒 **Secure**: Token-based authentication for API routes
- 📱 **Mobile Friendly**: Responsive design that works on all devices
- 🔍 **Vector Search**: Advanced semantic search using embeddings and Pinecone

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI/ML**: OpenAI GPT, LangChain, Vercel AI SDK
- **Vector Database**: Pinecone
- **File Storage**: Vercel Blob
- **UI Components**: Lucide React icons, React Markdown
- **Authentication**: Token-based API protection

## Architecture
<img width="1446" height="877" alt="architecture" src="https://github.com/user-attachments/assets/022cb48c-95fd-452c-8054-bac207e583e5" />

**Data Flow:**
1. **PDF Processing**: Upload → Text extraction → Chunking → Embedding generation
2. **Query Processing**: User question → Vector search → Context retrieval
3. **Response Generation**: Context + Question → LLM → Streaming response

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+
- pnpm (recommended) or npm
- Git

You'll also need accounts and API keys for:

- [OpenAI](https://platform.openai.com/) (for GPT and embeddings)
- [Pinecone](https://www.pinecone.io/) (for vector database)
- [Vercel](https://vercel.com/) (for blob storage)

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd pdf-qa-app
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
# API Protection
API_SECRET=your-secure-api-secret-here

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_INDEX_NAME=your-pinecone-index-name
PINECONE_ENVIRONMENT=your-pinecone-environment

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token-here
```

### 4. Set Up Pinecone Index

1. Log in to your [Pinecone console](https://app.pinecone.io/)
2. Create a new index with the following settings:
   - **Dimensions**: 1536 (for OpenAI text-embedding-3-small)
   - **Metric**: cosine
   - **Environment**: Choose your preferred region

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## Usage

### 1. Initial Setup
- When you first visit the app, you'll be prompted to enter your API token
- This token should match the `API_SECRET=hello` environment variable
- The token is stored locally in your browser

### 2. Upload a PDF
- Click the upload button (📎) in the chat input
- Select a PDF file from your device
- Wait for the processing confirmation

### 3. Ask Questions
- Type your question about the uploaded PDF
- Press Enter or click the send button
- Watch as the AI generates a streaming response

### 4. Features
- **Multiple PDFs**: Upload multiple PDFs to build a knowledge base
- **Conversation History**: Previous questions and answers are preserved
- **Real-time Responses**: See answers generate word by word
- **Markdown Support**: Responses support rich formatting

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── query/          # Q&A endpoint with streaming
│   │   └── upload/         # PDF upload and processing
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main chat interface
├── components/
│   ├── ChatInput.tsx       # Chat input with file upload
│   ├── ChatMessage.tsx     # Message display with markdown
│   ├── Header.tsx          # App header
│   ├── LoadingSkeleton.tsx # Loading animation
│   ├── StatusTooltip.tsx   # Status notifications
│   └── TokenModal.tsx      # API token input modal
├── hooks/
    └── useChat.ts          # Custom chat state management

```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Troubleshooting

### Common Issues

**"Unauthorized" error**
- Check that your `API_SECRET` environment variable matches the token you entered in the app

**PDF upload fails**
- Ensure your `BLOB_READ_WRITE_TOKEN` is valid
- Check that the PDF file is not corrupted
- Verify file size is within limits

**No responses to questions**
- Verify your `OPENAI_API_KEY` is valid and has sufficient credits
- Check that your Pinecone index is properly configured
- Ensure you've uploaded a PDF first

**Build errors**
- Run `pnpm install` to ensure all dependencies are installed
- Check that all environment variables are set
- Verify TypeScript types with `pnpm build`

### Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are correctly set
3. Ensure your API keys are valid and have proper permissions
4. Check network connectivity for API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
