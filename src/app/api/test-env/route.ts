import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasPrivateKey = !!process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const hasClientEmail = !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const hasSpreadsheetId = !!process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const privateKeyLength = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.length || 0;

    return NextResponse.json({
      status: 'Environment Variables Check',
      hasPrivateKey,
      hasClientEmail,
      hasSpreadsheetId,
      clientEmail: clientEmail || 'NOT_SET',
      spreadsheetId: spreadsheetId || 'NOT_SET',
      privateKeyLength,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check environment variables' },
      { status: 500 }
    );
  }
}
