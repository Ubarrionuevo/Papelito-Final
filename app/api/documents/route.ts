import { NextRequest, NextResponse } from 'next/server';
import { Document, DocumentRequest, DocumentsListResponse, DocumentSearchRequest } from '../../../types/api';

// In-memory storage for demo purposes
// In production, you should use a database (PostgreSQL, MongoDB, etc.)
export const documents = new Map<string, Document>();

// Helper function to generate document ID
function generateDocumentId(): string {
  return 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// POST - Guardar documento
export async function POST(request: NextRequest) {
  try {
    const body: DocumentRequest = await request.json();
    const { userId, image, ocrData } = body;

    if (!userId || !image) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId and image are required' 
      }, { status: 400 });
    }

    if (!ocrData) {
      return NextResponse.json({ 
        success: false, 
        error: 'OCR data is required. Process the image with /api/ocr first.' 
      }, { status: 400 });
    }

    const documentId = generateDocumentId();
    const now = new Date();

    const document: Document = {
      id: documentId,
      userId,
      imageUrl: image, // Store base64 for now, in production use cloud storage
      text: ocrData.text,
      metadata: ocrData.metadata || {},
      classification: ocrData.classification || {
        documentType: 'unknown',
        provider: 'unknown'
      },
      createdAt: now,
      updatedAt: now
    };

    documents.set(documentId, document);

    console.log(`✅ Document saved: ${documentId} for user ${userId}`);

    return NextResponse.json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Document save error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET - Listar y filtrar documentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const provider = searchParams.get('provider');
    const project = searchParams.get('project');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId is required' 
      }, { status: 400 });
    }

    // Filter documents by userId
    let userDocuments = Array.from(documents.values())
      .filter(doc => doc.userId === userId);

    // Apply filters
    if (type) {
      userDocuments = userDocuments.filter(doc => 
        doc.metadata.type === type || doc.classification.documentType === type
      );
    }

    if (provider) {
      userDocuments = userDocuments.filter(doc => 
        doc.metadata.provider?.toLowerCase().includes(provider.toLowerCase()) ||
        doc.classification.provider?.toLowerCase().includes(provider.toLowerCase())
      );
    }

    if (project) {
      userDocuments = userDocuments.filter(doc => 
        doc.classification.project?.toLowerCase().includes(project.toLowerCase())
      );
    }

    if (month) {
      userDocuments = userDocuments.filter(doc => 
        doc.classification.month === month
      );
    }

    if (year) {
      userDocuments = userDocuments.filter(doc => 
        doc.classification.year === year
      );
    }

    // Sort by createdAt (newest first)
    userDocuments.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Apply pagination
    const total = userDocuments.length;
    const paginatedDocuments = userDocuments.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedDocuments,
      total
    });

  } catch (error) {
    console.error('Documents list error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Borrar documento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!documentId || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'id and userId are required' 
      }, { status: 400 });
    }

    const document = documents.get(documentId);

    if (!document) {
      return NextResponse.json({ 
        success: false, 
        error: 'Document not found' 
      }, { status: 404 });
    }

    if (document.userId !== userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 403 });
    }

    documents.delete(documentId);

    console.log(`🗑️ Document deleted: ${documentId}`);

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Document delete error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

