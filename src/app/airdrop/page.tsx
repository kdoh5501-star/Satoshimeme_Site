'use client';

import { useState } from 'react';

export default function AirdropPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', { walletAddress, email }); // 디버깅용

    if (!walletAddress.trim()) {
      alert('Please enter your Wonpay wallet address');
      return;
    }

    setIsSubmitted(true);
    console.log('Starting submission...'); // 디버깅용

    try {
      // Netlify Forms로 전송 (엑셀/CSV는 Netlify 대시보드에서 다운로드)
      const payload = new URLSearchParams({
        'form-name': 'airdrop',
        walletAddress: walletAddress.trim(),
        email: (email || '').trim(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        timestamp: new Date().toISOString(),
      }).toString();

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload,
      });

      console.log('Netlify Forms Response:', response.status);

      if (response.ok) {
        // Google Ads 컨버전 트래킹 실행 (더 안전하게)
        try {
          if (typeof window !== 'undefined') {
            const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
            if (typeof w.gtag === 'function') {
              w.gtag('event', 'conversion', {
                'send_to': 'AW-17384712576/airdrop_submission',
                'value': 1.0,
                'currency': 'KRW'
              });
              console.log('Google Ads conversion tracked'); // 디버깅용
            }
          }
        } catch (gtagError) {
          console.log('Google Ads tracking error:', gtagError); // 디버깅용
        }

        alert('🎉 Application Completed! Your airdrop will be distributed within 24 hours.');
        setWalletAddress('');
        setEmail('');
        console.log('Application submitted successfully (Netlify Forms)');
      } else {
        console.error('Application submission failed (Netlify Forms)');
        alert('❌ Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('🔧 Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitted(false);
      console.log('Submission completed'); // 디버깅용
    }
  };

  const scrollToForm = () => {
    document.getElementById('event-application')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 직접 클릭 핸들러 (폼 제출이 안 될 때 백업용)
  const handleButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🚀 Direct button click handler triggered!');

    if (isSubmitted) return;

    // 모바일에서 키보드 숨기기
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      (document.activeElement as HTMLElement)?.blur();
    }

    // handleSubmit 함수를 직접 호출
    const fakeEvent = {
      preventDefault: () => {}
    } as React.FormEvent;

    await handleSubmit(fakeEvent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
     <form name="airdrop" method="POST" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input type="hidden" name="form-name" value="airdrop" />
  <input type="text" name="walletAddress" />
  <input type="email" name="email" />
  <input type="text" name="userAgent" />
  <input type="text" name="timestamp" />
  <input type="text" name="bot-field" />
</form>
      {/* Header Section - Video Background */}
      <header className="relative overflow-hidden bg-gradient-to-r from-yellow-100 to-orange-100 min-h-[100svh] flex items-center justify-center">
        {/* Background Video - Responsive */}

        {/* Desktop Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
            (e.target as HTMLVideoElement).style.display = 'none';
          }}
        >
          <source src="/uploads/Satoshimeme_airdrop_Video_0826_v2.mp4" type="video/mp4" />
        </video>

        {/* Mobile Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block md:hidden absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
            (e.target as HTMLVideoElement).style.display = 'none';
          }}
        >
          <source src="/uploads/Satoshimeme_airdrop_Video_0826_mobile.mp4" type="video/mp4" />
        </video>

        {/* Video Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/40 to-orange-200/40 z-10"></div>
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        {/* Desktop: Centered content */}
        <div className="hidden sm:block relative max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-16 text-center z-20">
          <div className="bg-yellow-400 text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-4 rounded-full inline-block mb-6 sm:mb-12 font-bold text-sm sm:text-xl lg:text-2xl shadow-md">
            🎉 Satoshi Nakamoto Return Celebration 🎉
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 sm:mb-8 leading-tight px-2 drop-shadow-2xl" style={{fontFamily: 'Montserrat, sans-serif', textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}>
            FREE AIRDROP EVENT
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-yellow-400 mb-6 sm:mb-12 font-semibold px-2 drop-shadow-xl" style={{textShadow: '2px 2px 6px rgba(0,0,0,0.7)'}}>
            Get 10,000 SATOSHI Tokens
          </p>
          <button
            onClick={scrollToForm}
            className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white px-6 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-full font-bold text-lg sm:text-xl lg:text-2xl transition-all duration-200 shadow-lg min-h-[52px] sm:min-h-[60px] touch-manipulation select-none"
            style={{WebkitTapHighlightColor: 'transparent'}}
          >
            Join Now →
          </button>
        </div>

        {/* Mobile: Bottom-positioned content (around Satoshi character's belly area) */}
        <div className="sm:hidden absolute bottom-16 left-0 right-0 z-20 px-4">
          <div className="text-center space-y-4 py-[348px]">
            <div className="bg-yellow-400 text-white px-4 py-2 rounded-full inline-block font-bold text-sm shadow-md">
              🎉 Satoshi Nakamoto Return Celebration 🎉
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight drop-shadow-2xl" style={{fontFamily: 'Montserrat, sans-serif', textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}>
              FREE AIRDROP EVENT
            </h1>
            <p className="text-lg text-yellow-400 font-semibold drop-shadow-xl" style={{textShadow: '2px 2px 6px rgba(0,0,0,0.7)'}}>
              Get 10,000 SATOSHI Tokens
            </p>
            <button
              onClick={scrollToForm}
              className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 shadow-lg min-h-[52px] touch-manipulation select-none w-full max-w-xs mx-auto block"
              style={{WebkitTapHighlightColor: 'transparent'}}
            >
              Join Now →
            </button>
          </div>
        </div>
      </header>

      {/* Combined Satoshi Returns + Why SatoshiMeme Section */}
      <section className="py-6 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-12 lg:mb-16">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-6 px-2 leading-tight" style={{fontFamily: 'Montserrat, sans-serif'}}>
            Satoshi Nakamoto returns as a meme.
          </h2>
          <p className="text-base sm:text-xl lg:text-2xl text-gray-600 leading-relaxed px-2">
            Satoshi Meme Coin is a bold experiment to reclaim Bitcoin's forgotten spirit — money without banks, order without power, freedom without surveillance — and to ignite a new era of financial democracy through laughter.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Links Section - Better Mobile Layout */}
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-8 max-w-2xl mx-auto">
            <a
              href="https://satoshimemes.com"
              className="flex flex-col items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <span className="text-xs sm:text-base font-medium">Website</span>
            </a>

            <a
              href="/satoshi-meme-whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs sm:text-base font-medium">Whitepaper</span>
            </a>

            <a
              href="https://x.com/SatoshimemesCom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <span className="text-xs sm:text-base font-medium">Twitter</span>
            </a>

            <a
              href="https://t.me/+887Sr-VpLy4yNmZl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <span className="text-xs sm:text-base font-medium">Telegram</span>
            </a>
          </div>
        </div>
      </section>

      {/* Unified Single Box Layout - Enhanced Mobile */}
      <section id="event-application" className="py-6 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          {/* Main Title with Better Mobile Sizing */}
          <div className="text-center mb-6 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 sm:gap-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black shadow-2xl mb-4 sm:mb-6">
              <span className="text-xl sm:text-3xl lg:text-4xl animate-bounce">🎁</span>
              <span className="text-center leading-tight">FREE AIRDROP - Apply Now!</span>
              <span className="text-xl sm:text-3xl lg:text-4xl animate-bounce delay-100">🚀</span>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-5xl mx-auto leading-relaxed px-2">
              Join 5,000 lucky participants and claim your 10,000 SATOSHI tokens completely free!
            </p>
          </div>

          {/* Single Unified Box - Mobile First Layout */}
          <div className="bg-white p-3 sm:p-6 lg:p-8 xl:p-12 rounded-xl sm:rounded-2xl sm:rounded-3xl shadow-2xl border border-orange-300 sm:border-2 sm:border-4 border-orange-300">
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
              {/* Left Side - Information Section (1/3 space) */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                {/* Title */}
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-8 flex items-center gap-2">
                  🎁 Airdrop Information
                </h2>

                {/* Main Benefits - Mobile Optimized */}
                <div className="mb-4 sm:mb-8">
                  <div className="text-xl sm:text-3xl font-black text-gray-800 mb-1 sm:mb-2 leading-tight">
                    10,000 SATOSHI TOKENS
                  </div>
                  <div className="text-sm sm:text-lg text-gray-600 mb-2 sm:mb-4">per person</div>
                  <div className="text-sm sm:text-lg font-semibold text-orange-600">
                    Limited to 5,000 participants!
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 my-4 sm:my-8"></div>

                {/* How to Participate - Compact Mobile */}
                <div className="mb-4 sm:mb-8">
                  <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-6">How to Participate</h3>
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-gray-600 font-medium text-base sm:text-lg">①</span>
                      <span className="text-gray-700 text-sm sm:text-base">Install Wonpay Wallet</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-gray-600 font-medium text-base sm:text-lg">②</span>
                      <span className="text-gray-700 text-sm sm:text-base">Submit Wallet Address</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-gray-600 font-medium text-base sm:text-lg">③</span>
                      <span className="text-gray-700 text-sm sm:text-base">Receive Tokens within 24 hours</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 my-4 sm:my-8"></div>

                {/* Important Notes - Mobile Friendly */}
                <div>
                  <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-6">Important Notes</h3>
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-gray-600">⚠️</span>
                      <span className="text-gray-700 text-sm sm:text-base">One participation per person</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-gray-600">⚠️</span>
                      <span className="text-gray-700 text-sm sm:text-base">Invalid address = No distribution</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-gray-600">⚠️</span>
                      <span className="text-gray-700 text-sm sm:text-base">Event may end early if limit is reached</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Application Form (2/3 space) - Mobile First */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="lg:sticky lg:top-8">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-3 sm:p-6 lg:p-8 xl:p-12 rounded-xl sm:rounded-2xl border border-orange-400 sm:border-2 sm:border-4 border-orange-400 shadow-xl">
                    <div className="text-center mb-4 sm:mb-8">
                      <div className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-6 animate-pulse">
                        <span className="text-2xl sm:text-4xl lg:text-5xl text-white">🚀</span>
                      </div>
                      <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">Apply for Airdrop</h3>
                      <div className="text-base sm:text-xl text-orange-600 font-bold">Join 5,000 lucky winners!</div>
                      <div className="text-sm sm:text-lg text-gray-600 mt-1 sm:mt-2">Complete the form below to claim your free tokens</div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
                      <div>
                        <label className="block text-gray-800 font-bold mb-2 sm:mb-4 text-base sm:text-xl flex items-center gap-2 sm:gap-3">
                          <span className="text-lg sm:text-2xl">🔑</span>
                          <span>Wonpay Wallet Address</span>
                          <span className="text-red-500 text-lg sm:text-2xl">*</span>
                        </label>
                        <input
                          type="text"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          placeholder="Enter your wallet address"
                          className="w-full p-4 sm:p-5 lg:p-6 bg-white border-2 sm:border-3 border-gray-300 rounded-lg sm:rounded-xl text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none text-base sm:text-lg lg:text-xl transition-all duration-300 shadow-md min-h-[48px] sm:min-h-[60px] touch-manipulation"
                          required
                          autoComplete="off"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck="false"
                        />
                        <p className="text-xs sm:text-base lg:text-lg text-gray-600 mt-1 sm:mt-3 flex items-center gap-1 sm:gap-2">
                          <span>💡</span>
                          <span className="text-xs sm:text-base">Enter your complete Wonpay wallet address</span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-gray-800 font-bold mb-2 sm:mb-4 text-base sm:text-xl flex items-center gap-2 sm:gap-3">
                          <span className="text-lg sm:text-2xl">📧</span>
                          <span>Email Address</span>
                          <span className="text-gray-500 text-sm sm:text-lg">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full p-4 sm:p-5 lg:p-6 bg-white border-2 sm:border-3 border-gray-300 rounded-lg sm:rounded-xl text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none text-base sm:text-lg lg:text-xl transition-all duration-300 shadow-md min-h-[48px] sm:min-h-[60px] touch-manipulation"
                          autoComplete="email"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck="false"
                        />
                        <p className="text-xs sm:text-base lg:text-lg text-gray-600 mt-1 sm:mt-3 flex items-center gap-1 sm:gap-2">
                          <span>📬</span>
                          <span className="text-xs sm:text-base">For result notifications only</span>
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitted}
                        onClick={handleButtonClick}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:from-orange-700 active:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 sm:py-7 lg:py-8 px-6 sm:px-10 lg:px-12 rounded-xl sm:rounded-2xl transition-all duration-200 text-lg sm:text-xl lg:text-2xl shadow-2xl disabled:transform-none flex items-center justify-center gap-2 sm:gap-4 min-h-[56px] sm:min-h-[70px] touch-manipulation select-none"
                        style={{WebkitTapHighlightColor: 'transparent'}}
                      >
                        {isSubmitted ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 sm:h-7 sm:w-7 lg:h-8 lg:w-8 border-b-2 sm:border-b-3 border-white"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl sm:text-3xl">🎯</span>
                            <span>Submit Application</span>
                            <span className="text-xl sm:text-3xl">✨</span>
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                        Distribution within 24 hours after verification
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wonpay Installation Guide - Mobile Optimized */}
      <section className="py-6 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-12 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>
            Wonpay Installation Guide
          </h2>

          <div className="bg-white p-4 sm:p-8 lg:p-12 rounded-lg sm:rounded-xl border border-gray-200 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-3 sm:space-y-6 text-gray-700 text-sm sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-12">
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <span className="bg-orange-500 text-white w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-base flex-shrink-0 mt-0.5 sm:mt-1">1</span>
                  <span className="text-sm sm:text-lg">Download Wonpay app from App Store or Google Play</span>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <span className="bg-orange-500 text-white w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-base flex-shrink-0 mt-0.5 sm:mt-1">2</span>
                  <span className="text-sm sm:text-lg">Create your new wallet account</span>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <span className="bg-orange-500 text-white w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-base flex-shrink-0 mt-0.5 sm:mt-1">3</span>
                  <span className="text-sm sm:text-lg">Copy your wallet address</span>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <span className="bg-orange-500 text-white w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-base flex-shrink-0 mt-0.5 sm:mt-1">4</span>
                  <span className="text-sm sm:text-lg">Submit your address in the form above</span>
                </div>
              </div>

              {/* Download Wallet Section - Mobile Grid */}
              <div className="text-center">
                <h4 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-6">Download Wallet</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 max-w-4xl mx-auto">
                  <a
                    href="https://apps.apple.com/us/app/wonpay/id6554001420"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white px-3 sm:px-6 py-2 sm:py-4 rounded-md sm:rounded-lg transition-colors border border-blue-700 shadow-lg"
                  >
                    <img src="/apple_logo.png" alt="Apple" className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3" />
                    <div className="text-left">
                      <div className="text-xs text-white/90">Download on the</div>
                      <div className="text-sm sm:text-base font-bold text-yellow-300">App Store</div>
                    </div>
                  </a>

                  <a
                    href="https://play.google.com/store/apps/details?id=com.wonpaywallet&pcampaignid=web_share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white px-3 sm:px-6 py-2 sm:py-4 rounded-md sm:rounded-lg transition-colors border border-blue-700 shadow-lg"
                  >
                    <img src="/google_logo.png" alt="Google Play" className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3" />
                    <div className="text-left">
                      <div className="text-xs text-white/90">GET IT ON</div>
                      <div className="text-sm sm:text-base font-bold text-yellow-300">Google Play</div>
                    </div>
                  </a>

                  <a
                    href="https://microbitcoinorg.github.io/wallet/#/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white px-3 sm:px-6 py-2 sm:py-4 rounded-md sm:rounded-lg transition-colors border border-blue-700 shadow-lg"
                  >
                    <img src="/1_mbc_logo_191021.png" alt="MicroBitcoin" className="h-5 sm:h-7 w-auto mr-2 sm:mr-3 object-contain" />
                    <div className="text-left">
                      <div className="text-xs text-lime-400 font-medium">MicroBitcoin</div>
                      <div className="text-sm sm:text-base font-bold text-white">WEB Wallet</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Mobile optimized */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-6 sm:py-12" style={{fontFamily: 'Noto Sans KR, Malgun Gothic, Apple SD Gothic Neo, Arial, sans-serif'}}>
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-4 sm:mb-8">
            {/* Foundation Partners */}
            <div className="text-center lg:text-left">
              <h4 className="font-bold mb-2 sm:mb-4 text-yellow-400 text-sm sm:text-lg">Foundation Partners</h4>
              <div className="space-y-1 sm:space-y-3">
                <a href="https://p2pfoundation.net/" target="_blank" rel="noopener noreferrer" className="block group transition-all duration-300 hover:scale-105">
                  <img
                    src="/p2pf-logo-title.svg"
                    alt="P2P Foundation"
                    className="h-2 sm:h-4 lg:h-5 w-auto mx-auto lg:mx-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300 object-contain"
                    style={{filter: 'brightness(0) invert(1)'}}
                  />
                </a>
                <a href="https://commons.foundation/" target="_blank" rel="noopener noreferrer" className="block group transition-all duration-300 hover:scale-105">
                  <img
                    src="/COMMONS-FOUNDATION.png"
                    alt="Commons Foundation"
                    className="h-8 sm:h-12 lg:h-14 w-auto object-contain mx-auto lg:mx-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </a>
              </div>
            </div>

            {/* Key Links */}
            <div className="text-center">
              <h4 className="font-bold mb-2 sm:mb-4 text-yellow-400 text-sm sm:text-lg">Essential Links</h4>
              <div className="space-y-1 sm:space-y-3 text-gray-300 text-xs sm:text-base">
                <div><a href="/satoshi-meme-whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">📜 White Paper</a></div>
                <div><a href="https://wonpay.io/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">💳 Satoshi Wallet (Wonpay)</a></div>
                <div><a href="https://microbitcoin.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">🌐 MBC Homepage</a></div>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center lg:text-right sm:col-span-2 lg:col-span-1">
              <h4 className="font-bold mb-2 sm:mb-4 text-yellow-400 text-sm sm:text-lg">Community</h4>
              <div className="flex justify-center lg:justify-end space-x-2 sm:space-x-4">
                <a href="https://t.me/+887Sr-VpLy4yNmZl" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" title="Telegram">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="https://x.com/SatoshimemesCom" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" title="X (Twitter)">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@MicroBitcoin" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" title="YouTube">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimer - Mobile Optimized */}
          <div className="border-t border-gray-700 pt-3 sm:pt-6 mb-3 sm:mb-6">
            <div className="max-w-2xl mx-auto p-3 sm:p-6">
              <h4 className="text-yellow-400 font-bold text-sm sm:text-lg mb-2 sm:mb-4 text-center">DISCLAIMER</h4>
              <div className="text-gray-300 text-xs sm:text-sm leading-relaxed space-y-1 sm:space-y-3 text-justify">
                <p>
                  $SATOSHI is a meme-based token created purely for entertainment and community interaction. It has no inherent value, utility, or backing of any kind.
                </p>
                <p>
                  It is not a financial instrument, security, or investment vehicle, and should not be treated as such. Cryptocurrencies are inherently volatile and involve substantial risk. Only engage with funds you are willing to lose.
                </p>
                <p>
                  Engaging in the purchase, trade, or holding of this Token is entirely at your own risk, with no assurances of value, liquidity, or future usefulness associated with the Token.
                </p>
                <p className="text-yellow-300 font-semibold">
                  Individuals in the U.S. or in regions where cryptocurrency is restricted are advised not to engage with or purchase this token.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-2 sm:pt-4 text-center text-gray-400 text-xs sm:text-sm">
            <p>Satoshimeme © 2025 - "In Mathematics We Trust, In Community We Thrive"</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
