import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, email } = await request.json();

    // 필수 필드 검증
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트 초기화
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 클라이언트 IP 가져오기
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // User Agent 가져오기
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Supabase에 데이터 삽입
    const { data, error } = await supabase
      .from('airdrop_submissions')
      .insert([
        {
          wallet_address: walletAddress.trim(),
          email: email?.trim() || null,
          ip_address: ip,
          user_agent: userAgent,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting data:', error);
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    console.log('Airdrop application submitted:', {
      id: data.id,
      walletAddress: data.wallet_address,
      email: data.email,
      ip,
      timestamp: data.created_at
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        id: data.id,
        timestamp: data.created_at
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error submitting airdrop application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
