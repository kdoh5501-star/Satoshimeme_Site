import { NextRequest, NextResponse } from 'next/server';

// Mock transaction data storage (in production, use a proper database)
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

// GET - Retrieve all transactions
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status');
    const network = url.searchParams.get('network');

    let filteredTransactions = [...transactions];

    // Filter by status
    if (status) {
      filteredTransactions = filteredTransactions.filter(tx => tx.status === status);
    }

    // Filter by network
    if (network) {
      filteredTransactions = filteredTransactions.filter(tx => tx.network === network);
    }

    // Sort by creation date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    const response = NextResponse.json({
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit)
      }
    }, { status: 200 });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    return addCorsHeaders(response);
  }
}

// POST - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['walletAddress', 'amount', 'tokenAmount', 'network', 'txHash'];
    for (const field of requiredFields) {
      if (!(field in body)) {
        const response = NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
        return addCorsHeaders(response);
      }
    }

    // Create new transaction
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      walletAddress: body.walletAddress,
      amount: body.amount,
      tokenAmount: body.tokenAmount,
      network: body.network,
      txHash: body.txHash,
      status: body.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    transactions.push(newTransaction);

    console.log('New transaction created:', newTransaction);

    const response = NextResponse.json({
      message: 'Transaction created successfully',
      transaction: newTransaction
    }, { status: 201 });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error creating transaction:', error);
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
