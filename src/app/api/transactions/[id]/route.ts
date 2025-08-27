import { NextRequest, NextResponse } from 'next/server';

// Mock transaction data storage (shared with transactions/route.ts)
const transactions = [
  {
    id: '1',
    walletAddress: '0x1234...5678',
    amount: 1000,
    tokenAmount: 13793103,
    network: 'BSC',
    txHash: '0xabc123...def456',
    status: 'confirmed',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:05:00Z'
  },
  {
    id: '2',
    walletAddress: '0x9876...4321',
    amount: 500,
    tokenAmount: 6896551,
    network: 'TRON',
    txHash: '0x789xyz...123abc',
    status: 'pending',
    createdAt: '2025-01-01T11:30:00Z',
    updatedAt: '2025-01-01T11:30:00Z'
  },
  {
    id: '3',
    walletAddress: 'TAAxiJ4zvWLjusbJjqc6dMuiNKCNuXn1R1',
    amount: 2000,
    tokenAmount: 27586206,
    network: 'TRON',
    txHash: '0xdef456...ghi789',
    status: 'confirmed',
    createdAt: '2025-01-01T12:15:00Z',
    updatedAt: '2025-01-01T12:20:00Z'
  },
  {
    id: '4',
    walletAddress: '84Xp2jNM53UQimcEfCwY857kmarFxEKHnxVuDFjgrizD',
    amount: 750,
    tokenAmount: 10344827,
    network: 'SOL',
    txHash: '0xghi789...jkl012',
    status: 'failed',
    createdAt: '2025-01-01T14:00:00Z',
    updatedAt: '2025-01-01T14:05:00Z'
  }
];

function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// GET - Retrieve specific transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const transaction = transactions.find(tx => tx.id === resolvedParams.id);

    if (!transaction) {
      const response = NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      return addCorsHeaders(response);
    }

    const response = NextResponse.json(transaction, { status: 200 });
    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    return addCorsHeaders(response);
  }
}

// PUT - Update specific transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const transactionIndex = transactions.findIndex(tx => tx.id === resolvedParams.id);

    if (transactionIndex === -1) {
      const response = NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      return addCorsHeaders(response);
    }

    // Update transaction
    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    console.log('Transaction updated:', transactions[transactionIndex]);

    const response = NextResponse.json({
      message: 'Transaction updated successfully',
      transaction: transactions[transactionIndex]
    }, { status: 200 });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error updating transaction:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    return addCorsHeaders(response);
  }
}

// DELETE - Delete specific transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const transactionIndex = transactions.findIndex(tx => tx.id === resolvedParams.id);

    if (transactionIndex === -1) {
      const response = NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      return addCorsHeaders(response);
    }

    const deletedTransaction = transactions.splice(transactionIndex, 1)[0];

    console.log('Transaction deleted:', deletedTransaction);

    const response = NextResponse.json({
      message: 'Transaction deleted successfully',
      transaction: deletedTransaction
    }, { status: 200 });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    return addCorsHeaders(response);
  }
}

// OPTIONS - Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
