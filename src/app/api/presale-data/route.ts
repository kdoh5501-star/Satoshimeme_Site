import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for presale data (in production, use a proper database)
let presaleData = {
  // Stage 1 (완료됨)
  stage1: {
    tokenPrice: 0.0000725,
    raisedAmount: 580000,
    targetAmount: 580000,
    tokensSold: 8000000000,
    totalTokens: 8000000000,
    startDate: '2025-08-01T18:00:00+09:00',
    endDate: '2025-08-07T18:00:00+09:00',
    completed: true
  },
  // Stage 2 (Second Presale)
  stage2: {
    tokenPrice: 0.00008,
    raisedAmount: 0,
    targetAmount: 580000,
    tokensSold: 0,
    totalTokens: 7250000000,
    startDate: '2025-08-13T18:00:00+09:00',
    endDate: '2025-08-20T18:00:00+09:00',
    active: true
  },
  // 공통 정보
  walletAddresses: {
    tron: 'TAAxiJ4zvWLjusbJjqc6dMuiNKCNuXn1R1',
    bsc: '0xe9e8e63fe2ebaa092bf6149e05431229c04765bf',
    solana: '84Xp2jNM53UQimcEfCwY857kmarFxEKHnxVuDFjgrizD'
  },
  currentStage: 1,
  minPurchase: 1000000,
  lastUpdated: new Date().toISOString()
};

// GET - Retrieve presale data
export async function GET(request: NextRequest) {
  try {
    // Get current stage data
    const currentStageData = presaleData.currentStage === 1 ? presaleData.stage1 : presaleData.stage2;

    // Flatten the response to match expected format
    const responseData = {
      tokenPrice: currentStageData.tokenPrice,
      raisedAmount: currentStageData.raisedAmount,
      targetAmount: currentStageData.targetAmount,
      tokensSold: currentStageData.tokensSold,
      totalTokens: currentStageData.totalTokens,
      walletAddresses: presaleData.walletAddresses,
      stage: presaleData.currentStage,
      startDate: currentStageData.startDate,
      endDate: currentStageData.endDate,
      minPurchase: presaleData.minPurchase,
      lastUpdated: presaleData.lastUpdated
    };

    // Add CORS headers
    const response = NextResponse.json(responseData, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error('Error fetching presale data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Update presale data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['tokenPrice', 'raisedAmount', 'targetAmount', 'tokensSold', 'totalTokens'];
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Update presale data
    presaleData = {
      ...presaleData,
      ...body,
      lastUpdated: new Date().toISOString()
    };

    console.log('Presale data updated:', presaleData);

    const response = NextResponse.json({
      message: 'Presale data updated successfully',
      data: presaleData
    }, { status: 200 });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error('Error updating presale data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
