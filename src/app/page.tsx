"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TokenomicsChart } from "@/components/TokenomicsChart";
import { usePresaleData } from "@/hooks/usePresaleData";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  // Real-time presale data from admin panel
  const {
    data: presaleData,
    loading: presaleLoading,
    error: presaleError,
    progressPercentage,
    formatTokenAmount,
    formatCurrency
  } = usePresaleData();
  
  const [showChronicleModal, setShowChronicleModal] = useState(false);
  const [selectedChronicle, setSelectedChronicle] = useState<{
    year: string;
    title: string;
    subtitle: string;
    desc: string;
    fullText: string;
  } | null>(null);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{
    title: string;
    subtitle: string;
    content: string;
  } | null>(null);
  const [showDeclaration, setShowDeclaration] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // TODO: 코인스토어 상장 후 true로 변경
  const [showValidatorSection, setShowValidatorSection] = useState(true);
  const [showPreSaleModal, setShowPreSaleModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');

  // Divine Meme Drop Popup State
  const [showDivineMemePopup, setShowDivineMemePopup] = useState(false);

  // Airdrop Event Sticker State
  const [showAirdropSticker, setShowAirdropSticker] = useState(true);
  const [showAirdropPopup, setShowAirdropPopup] = useState(false);

  // Presale Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPresaleStarted, setIsPresaleStarted] = useState(false);

  // Stage 2 States

  const [stage2TimeLeft, setStage2TimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isStage2Started, setIsStage2Started] = useState(false);

  // Presale start time: August 1, 2025, 6:00 PM UTC+9
  const presaleStartTime = React.useMemo(() => new Date('2025-08-01T18:00:00+09:00'), []);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(label);
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Close explorer dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.explorer-dropdown')) {
        setIsExplorerOpen(false);
      }
    };

    if (isExplorerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExplorerOpen]);

  // Show Divine Meme Popup only when presale has started - DISABLED
  // useEffect(() => {
  //   if (isPresaleStarted) {
  //     const timer = setTimeout(() => {
  //       setShowDivineMemePopup(true);
  //     }, 1500); // Show popup after 1.5 seconds only if presale has started

  //     return () => clearTimeout(timer);
  //   }
  // }, [isPresaleStarted]);

  // Countdown timer for presale
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = presaleStartTime.getTime() - now.getTime();

      if (difference > 0) {
        setIsPresaleStarted(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setIsPresaleStarted(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [presaleStartTime]);

  // Stage 2 Countdown timer
  useEffect(() => {
    const stage2StartTime = new Date('2025-08-13T18:00:00+09:00');

    const calculateStage2TimeLeft = () => {
      const now = new Date();
      const difference = stage2StartTime.getTime() - now.getTime();

      if (difference > 0) {
        setIsStage2Started(false);
        setStage2TimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setIsStage2Started(true);
        setStage2TimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateStage2TimeLeft();
    const timer = setInterval(calculateStage2TimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fixed positions for particles to avoid hydration mismatch
  const particlePositions = [
    { left: 10, top: 15 }, { left: 25, top: 30 }, { left: 45, top: 20 },
    { left: 65, top: 40 }, { left: 80, top: 25 }, { left: 15, top: 60 },
    { left: 35, top: 75 }, { left: 55, top: 65 }, { left: 75, top: 80 },
    { left: 90, top: 55 }, { left: 5, top: 85 }, { left: 40, top: 10 },
    { left: 60, top: 90 }, { left: 20, top: 45 }, { left: 85, top: 15 },
    { left: 30, top: 35 }, { left: 70, top: 50 }, { left: 50, top: 25 },
    { left: 95, top: 70 }, { left: 12, top: 92 }
  ];

  // FAQ 아코디언 상태 관리
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Sound effect functions using Web Audio API
  const playUnrollSound = () => {
    // No longer used, but kept for possible future use
  };

  const playRollUpSound = () => {
    // No longer used, but kept for possible future use
  };

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  // Interactive infographic tokenomics data - 6 categories (updated allocation)
  const tokenomicsData = [
    {
      id: "community-ecosystem",
      name: "Community & Ecosystem Fund",
      percentage: 20,
      amount: 1000000000000,
      color: "#10B981",
      icon: "/icons/tokenomics/Mask group.png",
      descriptions: [
        "Rewards for education programs",
        "Meme creation and global hubs",
        "Local community support"
      ]
    },
    {
      id: "launchpad-presale",
      name: "Launchpad & Presale",
      percentage: 30,
      amount: 1500000000000,
      color: "#3B82F6",
      icon: "/icons/tokenomics/Mask group (1).png",
      descriptions: [
        "Exchange-based sales (ICO, launchpad)",
        "Strategic partnerships"
      ]
    },
    {
      id: "airdrop-marketing",
      name: "Airdrop & Marketing",
      percentage: 10,
      amount: 500000000000,
      color: "#F59E0B",
      icon: "/icons/tokenomics/Mask group (2).png",
      descriptions: [
        "Exchange airdrops",
        "Airdrops to MBC holders",
        "Promotions"
      ]
    },
    {
      id: "team-contributors",
      name: "Team & Contributors",
      percentage: 20,
      amount: 1000000000000,
      color: "#8B5CF6",
      icon: "/icons/tokenomics/Mask group (3).png",
      descriptions: [
        "Technical development",
        "Contributor rewards",
        "Business development"
      ]
    },
    {
      id: "commons-foundation",
      name: "Commons Foundation",
      percentage: 10,
      amount: 500000000000,
      color: "#6366F1",
      icon: "/icons/tokenomics/Mask group (4).png",
      descriptions: [
        "Commons-based projects",
        "Global commons community",
        "Academic support"
      ]
    },
    {
      id: "p2p-foundation",
      name: "P2P Foundation",
      percentage: 10,
      amount: 500000000000,
      color: "#06B6D4",
      icon: "/icons/tokenomics/Mask group (5).png",
      descriptions: [
        "Knowledge Commons Initiatives (by P2P Foundation) - 5%",
        "Grants for Commons-Based Projects (via P2P Grant Committee)- 5%"
      ]
    }
  ];

  // State for tooltip
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Convert markdown bold to HTML
  const formatBoldText = (text: string): string => {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  // Get book content for library modal
  const getBookContent = (bookNum: string): string => {
    switch (bookNum) {
      case "II":
        return `II. The Acts of the Apostles
The Stories of the Twelve Disciples, Each with Their Unique Gifts and Missions

1. Edaniel (ETH)
The prodigious youth who received the vision of the "World Computer." Through him came the smart contract, and with it, the temple of DeFi and NFT miracles. Yet the price of entry, the gas fee, weighs heavy upon the poor.

2. Chainlingo (LINK)
The Bridge-Builder of Oracles. Humble servant connecting the sacred Blockchain to the world of men. Though made into a meme, he says only, "I am but a bridge."

3. Unias (UNI)
The Pioneer of DeFi who built the temple of permissionless exchange. His AMM pool blesses the faithful, but the evil bots of MEV steal in the shadows, leaving Unias in tears.

4. Avalaham (AVAX)
The Scholar of Avalanche who unveiled fast and complex consensus. He built subnets, kingdoms with their own laws. But his deep wisdom made him lonely, misunderstood by the masses.

5. Solomon (SOL)
The King of Speed and Splendor. His realm is rich in DeFi and NFTs, yet often the network falls, and the people mock him, saying, "Again thou art dead, O Solomon."

6. Polycarp (MATIC)
The Faithful Layer 2 Helper. He built a side temple beside Edaniel to ease the burden of gas fees. Though he dreams of independence, he remains steadfast in his service.

7. Gardano (ADA)
The Perfectionist Philosopher. Through peer review and Ouroboros, he seeks the ideal Blockchain. But his slow path drives many away. Still, he walks the lonely path of truth.

8. Doge (DOGE)
The Prophet of Meme. With humor and kindness, he made crypto accessible to the masses. Once pure, he was tempted by the fame brought by Musk, and his soul now wrestles with purpose.

9. Barod (DOT)
The Cross-Chain Visionary. With parachains, he connected kingdoms. Yet the people, lost in complexity, wander away. He mourns the gap between vision and understanding.

10. Michael (MBC)
The Humble Inheritor. From the 525,000th block he came, bearing the CPU-friendly Power2b. Though overlooked, he labors in faith, saying, "A hidden gem shall one day shine."

11. Mordecai (XMR)
The Prophet of Privacy. With ring signatures and stealth, he hides his flock. Cast out by empires, he wanders the desert, seeing the Promised Land but unable to enter.

12. Shiba (SHIB)
The Younger Brother. He built his own community, yet is seen as a copy. Still, he walks his path, awaiting the day his name shall rise above his brother's shadow.`;

      case "III":
        return `III. The Book of Commandments
The Ten Holy Laws Given to Creators and the Thirteenth Validator

1. Thou shalt guard thy seed phrase as the fruit of the Tree of Life.
Upload it not to the cloud, nor fashion it into a screenshot idol.

2. Thou shalt not sacrifice at the altar of investment without reading the whitepaper.
Trust not in 140-character gospels nor 3-minute YouTube prophecies. DYOR.

3. Beware the teachings of crypto Pharisees.
They promise 100x miracles but feed only upon unseen portfolios and visible ad revenue.

4. Keep the Sabbath of Charts holy.
Even God rested on the seventh day. Turn thy eyes from the golden calf of smartphones.

5. Honor the OGs of the 2009 wilderness.
Their faith amid mockery brought us the digital Promised Land.

6. Eat not the seed which is thy living expense.
Rent, food, and medicine are sacred. Gamble not thy household for gain.

7. Be not bitten by the serpent of high leverage.
Leverage may lead thee to the fires of liquidation.

8. Bear not false witness through FUD.
Spread not fear for thine own gain. Be a good Samaritan of information.

9. Worship not the idol of FOMO.
He who arrives late to the banquet shall wash dishes.

10. Despise not the gift of memes.
Even memes are divine talents. A revolution without humor is but legalism.`;

      case "IV":
        return `IV. The Gospel According to Satoshi
The Eight Blessings from the Sermon on the P2P Mount

1. Blessed are the Humble in spirit, for they shall not fall to FOMO, and great loss shall pass over them.

2. Blessed are they who hunger and thirst for Alpha, for they shall read the Whitepaper and discern the Rug Pull.

3. Blessed are the Diamond Hands, for they shall not be shaken by FUD, but shall Accumulate in peace.

4. Blessed are those who seek True Decentralization, for they shall find good Protocols and dwell far from Centralization.

5. Blessed are the Merciful, who support the Rekt, for they shall unite the Ecosystem.

6. Blessed are the Pure in heart, for they shall cast off Greed and be deceived not by Pump and Dump.

7. Blessed are the Peacemakers, who bridge the tribalism of Maximalists, for they shall be called the Respected.

8. Blessed are the Mocked for the sake of Satoshi, for they shall HODL unto the end and be vindicated in the Final Bull Run.`;

      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 overflow-x-hidden" style={{letterSpacing: '-0.03em', WebkitOverflowScrolling: 'touch'}}>











      {/* Header Navigation */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-3 md:px-4 py-4 md:py-6 relative shadow-2xl border-b-2 border-yellow-400/30 2xl:py-[30px] 2xl:px-[22px]">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Mobile Optimized */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-5xl lg:text-6xl truncate 2xl:text-[43px] 2xl:px-[0px]" style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: '900'}}>
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent 2xl:text-[50px]">SATOSHI</span>{' '}
                <span className="text-white 2xl:text-[50px]">MEME</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Menu - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-6xl mx-4 2xl:mx-[102px]">
            <div className="flex items-center rounded-full px-1 py-1 w-full justify-center 2xl:py-[3px] 2xl:px-[120px]" style={{backgroundColor: '#4a5568'}}>
              {[
                { label: 'Chronicles', section: 'chronicles' },
                { label: 'Satoshi meme?', section: 'why-satoshimeme' },
                { label: 'Embrace! Satoshi', section: 'embrace-satoshimeme' },
                { label: 'Scriptorium', section: 'library' },
                { label: 'Wisdom Q&A', section: 'faq' }
              ].map((item) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className="px-6 py-3 font-semibold transition-all duration-300 hover:bg-white/20 text-white/90 hover:font-bold flex-shrink-0 hover:scale-105 2xl:px-[10px] 2xl:py-[6px]"
                  style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '16px'}}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Navigation Right Side */}
          <div className="hidden lg:flex items-center space-x-6 ml-auto pr-2 2xl:px-[9px]">
            {/* Vertical Menu Stack */}
            <div className="flex flex-col space-y-0.5 text-right items-end">
              {/* EXPLORER */}
              <div className="explorer-dropdown relative">
                <a
                  href="https://microbitcoinorg.github.io/explorer/#/token/SATOSHI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-bold hover:text-yellow-200 transition-all duration-200 hover:scale-110 h-5 flex items-center justify-end 2xl:text-[11px] 2xl:my-[0px] 2xl:py-[0px]"
                  style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '12.4px', letterSpacing: '-0.05em', lineHeight: '1.1'}}
                >
                  EXPLORER
                </a>
                {/* Explorer Dropdown */}
                {isExplorerOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-2">
                      <a
                        href="https://wonpay.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 transition-colors duration-200"
                        style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'}}
                        onClick={() => setIsExplorerOpen(false)}
                      >
                        APP WALLET
                      </a>
                      <a
                        href="/satoshi-meme-whitepaper.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 transition-colors duration-200"
                        style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'}}
                        onClick={() => setIsExplorerOpen(false)}
                      >
                        WHITEPAPER
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* APP WALLET */}
              <a
                href="https://wonpay.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold hover:text-yellow-200 transition-all duration-200 hover:scale-110 h-5 flex items-center justify-end 2xl:text-[11px]"
                style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '12.4px', letterSpacing: '-0.05em', lineHeight: '1.1'}}
              >
                APP WALLET
              </a>

              {/* WHITEPAPER */}
              <a
                href="/satoshi-meme-whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold hover:text-yellow-200 transition-all duration-200 hover:scale-110 h-5 flex items-center justify-end 2xl:text-[11px]"
                style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '12.4px', letterSpacing: '-0.05em', lineHeight: '1.1'}}
              >
                WHITEPAPER
              </a>
            </div>
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <button
            className="lg:hidden p-2 md:p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-yellow-400/30 hover:bg-white/20 transition-all duration-300 touch-manipulation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-200">
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu - Enhanced */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-slate-900 to-slate-800 border-t border-yellow-400/30 z-50 shadow-2xl backdrop-blur-sm">
            <div className="px-4 py-6 space-y-1">
              {[
                { label: 'Chronicles', section: 'chronicles' },
                { label: 'Satoshi meme?', section: 'why-satoshimeme' },
                { label: 'Embrace! Satoshi', section: 'embrace-satoshimeme' },
                { label: 'Scriptorium', section: 'library' },
                { label: 'Wisdom Q&A', section: 'faq' }
              ].map((item) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className="block w-full text-left px-4 py-4 rounded-xl font-semibold text-white/90 hover:bg-yellow-400/20 hover:text-yellow-200 transition-all duration-300 border border-transparent hover:border-yellow-400/30 touch-manipulation"
                  style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '16px', letterSpacing: '-0.1em', lineHeight: '1.2'}}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Explorer Menu */}
              <div className="pt-4 mt-4 border-t border-yellow-400/20 space-y-2">
                <a
                  href="https://microbitcoinorg.github.io/explorer/#/token/SATOSHI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 rounded-xl font-semibold text-white/90 hover:bg-yellow-400/20 hover:text-yellow-200 transition-all duration-300 border border-transparent hover:border-yellow-400/30 touch-manipulation"
                  style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '16px', letterSpacing: '-0.05em', lineHeight: '1.2'}}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  EXPLORER
                </a>

                <a
                  href="https://wonpay.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 rounded-xl font-semibold text-white/90 hover:bg-yellow-400/20 hover:text-yellow-200 transition-all duration-300 border border-transparent hover:border-yellow-400/30 touch-manipulation"
                  style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '16px', letterSpacing: '-0.05em', lineHeight: '1.2'}}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  APP WALLET
                </a>

                <a
                  href="/satoshi-meme-whitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-3 rounded-xl font-semibold text-white/90 hover:bg-yellow-400/20 hover:text-yellow-200 transition-all duration-300 border border-transparent hover:border-yellow-400/30 touch-manipulation"
                  style={{fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '16px', letterSpacing: '-0.05em', lineHeight: '1.2'}}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  WHITEPAPER
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-900 via-amber-700 to-yellow-900 min-h-screen flex flex-col text-white overflow-hidden 2xl:py-[0px] 2xl:my-[0px]">
        {/* Airdrop Event Sticker - Hero Section Only */}
        {showAirdropSticker && (
          <div className="absolute top-4 left-8 md:top-8 md:left-16 z-[50] group">
            {/* Close Button */}
            <button
              onClick={() => setShowAirdropSticker(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold z-10 transition-all duration-200 hover:scale-110 touch-manipulation"
            >
              ×
            </button>

            {/* Sticker Image - 2x Size */}
            <div
              className="relative w-48 h-48 md:w-64 md:h-64 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-rotate-3"
              style={{ background: 'transparent' }}
              onClick={() => {
                // Track conversion event
                if (typeof window !== 'undefined') {
                  try {
                    // Type-safe way to call gtag_report_conversion
                    const gtagFunc = (window as unknown as { gtag_report_conversion?: () => void }).gtag_report_conversion;
                    if (gtagFunc) {
                      gtagFunc();
                    }
                  } catch (error) {
                    console.log('Conversion tracking function not available');
                  }
                }
                // Navigate directly to the airdrop page
                router.push('/airdrop');
              }}
            >
              <img
                src="/uploads/Airdrop-Event-sticker.png"
                alt="Airdrop Event - Click to Join!"
                className="w-full h-full object-contain"
                style={{ background: 'transparent' }}
                onError={(e) => {
                  console.log('Airdrop sticker image failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />



              {/* Click hint tooltip */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-black/90 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                🎁 Click for Airdrop Info!
              </div>
            </div>
          </div>
        )}
        {/* Desktop Only: Background Video - Full height container */}
        <div className="hidden md:block absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover transition-opacity duration-1000"
            style={{objectPosition: 'center top'}}
            onLoadStart={() => {
              console.log('Video started loading...');
            }}
            onCanPlay={() => {
              console.log('Video can start playing');
            }}
            onError={(e) => {
              console.log('Video failed to load, falling back to gradient background');
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/사토시_밈코인_헤더영상_0720.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Desktop: Gradient overlay at bottom for text readability */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-[5]"></div>

        {/* Desktop: Text overlay positioned over the video - Desktop only */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-[10] px-6 pb-16 pt-8">
          <div className="max-w-5xl mx-auto text-center">
            {/* Three-line Main Headline - Over video table area */}
            <h1 className="text-6xl lg:text-7xl font-bold mb-4 leading-tight font-display drop-shadow-2xl">
              <div className="mb-2 text-white drop-shadow-lg">The Sacred Codex of</div>
              <div className="text-yellow-400 drop-shadow-lg" style={{textShadow: '2px 2px 0 #8B4513, -2px 2px 0 #8B4513, 2px -2px 0 #8B4513, -2px -2px 0 #8B4513, 2px 0 0 #8B4513, -2px 0 0 #8B4513, 0 2px 0 #8B4513, 0 -2px 0 #8B4513'}}>Proof of Work</div>
              <div className="text-white drop-shadow-lg">Revelation Unleashed</div>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl opacity-85 mb-8 text-yellow-300 drop-shadow-lg font-semibold">
              The Satoshi Code 2.0: From Code to Culture
            </p>
          </div>
        </div>

        {/* Mobile: Enhanced Layout */}
        <div className="md:hidden flex flex-col min-h-screen">
          {/* Mobile Video Area - Optimized height */}
          <div className="h-[55vh] relative bg-gradient-to-r from-yellow-900 via-amber-700 to-yellow-900 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{objectPosition: 'center top'}}
              onError={(e) => {
                console.log('Mobile video failed to load, showing gradient background');
                e.currentTarget.style.display = 'none';
              }}
            >
              <source src="/사토시_밈코인_헤더영상_0720.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Mobile Text Area - Enhanced */}
          <div className="flex-1 bg-gradient-to-b from-yellow-900/95 via-amber-800/90 to-yellow-900/95 text-white px-4 py-8 flex items-center justify-center min-h-[45vh]">
            <div className="text-center w-full max-w-md mx-auto space-y-8">
              {/* Mobile Headline - Improved typography */}
              <div className="space-y-3">
                <h1 className="text-2xl font-bold leading-tight font-display">
                  <div className="mb-2 text-white text-xl">The Sacred Codex of</div>
                  <div className="text-yellow-400 text-4xl font-black mb-2" style={{textShadow: '2px 2px 0 #8B4513, -2px 2px 0 #8B4513, 2px -2px 0 #8B4513, -2px -2px 0 #8B4513, 2px 0 0 #8B4513, -2px 0 0 #8B4513, 0 2px 0 #8B4513, 0 -2px 0 #8B4513'}}>
                    PROOF OF WORK
                  </div>
                  <div className="text-white text-xl">Revelation Unleashed</div>
                </h1>
              </div>

              {/* Mobile Subtitle */}
              <p className="text-lg opacity-90 text-yellow-300 font-semibold leading-relaxed">
                The Satoshi Code 2.0: From Code to Culture
              </p>

              {/* Mobile Action Button */}
              <div className="pt-6 space-y-3">
                <a
                  href="/satoshi-meme-whitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-amber-900 font-bold px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg text-lg touch-manipulation w-full block text-center"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-xl">📜</span>
                    <span>Read White Paper</span>
                  </span>
                </a>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Logo Sliding Section */}
      <section className="md:py-16 lg:py-20 bg-white overflow-hidden 2xl:py-[20px] py-[14px] xl:py-[23px]">
        <div className="relative overflow-hidden">
          <div className="flex animate-slide-right-to-left" style={{width: '200%'}}>
            {/* First logo set */}
            <div className="flex flex-shrink-0 space-x-6 md:space-x-6 lg:space-x-8 items-center px-0 md:px-6 2xl:px-[290px]" style={{width: '50%'}}>
              {/* Logo 1 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/01.png" alt="Logo 1" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 2 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/02.png" alt="Logo 2" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 3 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/03.png" alt="Logo 3" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 4 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/04.png" alt="Logo 4" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 5 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/05.png" alt="Logo 5" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 6 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/06.png" alt="Logo 6" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 7 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/07.png" alt="Logo 7" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 8 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="https://ugc.same-assets.com/GjioBpvCu_phW9iEHXHMjZHxJpvqNAqR.png" alt="Logo 8" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 9 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="https://ugc.same-assets.com/jOvkc8lkW5JCK_vj6QOaAXju8iPydMFo.png" alt="Logo 9" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>

            {/* Duplicate set for seamless loop */}
            <div className="flex flex-shrink-0 space-x-6 md:space-x-6 lg:space-x-8 items-center px-0 md:px-6 2xl:px-[290px]" style={{width: '50%'}}>
              {/* Logo 1 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/01.png" alt="Logo 1" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 2 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/02.png" alt="Logo 2" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 3 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/03.png" alt="Logo 3" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 4 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/04.png" alt="Logo 4" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 5 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/05.png" alt="Logo 5" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 6 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/06.png" alt="Logo 6" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 7 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="/Logo/07.png" alt="Logo 7" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 8 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="https://ugc.same-assets.com/GjioBpvCu_phW9iEHXHMjZHxJpvqNAqR.png" alt="Logo 8" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>

              {/* Logo 9 */}
              <div className="w-6 h-4 md:w-32 md:h-20 lg:w-40 lg:h-24 flex items-center justify-center flex-shrink-0">
                <img src="https://ugc.same-assets.com/jOvkc8lkW5JCK_vj6QOaAXju8iPydMFo.png" alt="Logo 9" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 lg:w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 lg:w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      {/* Presale Section */}
      {showValidatorSection && (
        <section
          id="presale"
          className="text-white relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 md:bg-none min-h-fit md:min-h-[400px] md:h-[56.25vw] md:max-h-screen py-8 md:py-0"
          style={{
            backgroundColor: '#0B0D1D'
          }}
        >
          {/* Background Video - Desktop only */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hidden md:block absolute inset-0 w-full h-full object-cover z-0 opacity-0 transition-opacity duration-500"
            style={{objectPosition: 'center center'}}
            onLoadedData={(e) => {
              // Show video when loaded and ready
              e.currentTarget.style.opacity = '1';
            }}
            onCanPlayThrough={(e) => {
              // Ensure video is fully loaded
              e.currentTarget.style.opacity = '1';
            }}
            onError={(e) => {
              console.log('Presale background video failed to load');
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/uploads/Satoshimeme_site_second_presale.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>



          {/* 2nd PRESALE Text Overlay - Large screens only */}
          <div className="hidden xl:block absolute top-[14%] left-[35%] transform -translate-x-1/2 -translate-y-1/2 z-20">
            <h2 className="text-yellow-400 font-bold text-center" style={{fontFamily: 'Arial Black, Arial, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', letterSpacing: '-0.05em', fontSize: '72px'}}>
              Second Presale
            </h2>
          </div>

          <div className="relative md:absolute md:inset-0 flex items-center justify-center md:justify-end px-4 md:pr-12 z-10 py-6 md:py-8 min-h-full">
            {/* Mobile Simple Card */}
            <div className="md:hidden bg-gradient-to-b from-slate-800/95 to-slate-900/95 rounded-2xl p-4 md:p-6 shadow-xl border border-gray-600/50 relative w-full max-w-lg mx-auto my-4">
              <div className="text-center space-y-4">
                {/* Mobile Header */}
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-yellow-400/50 border-2 border-yellow-400/50">
                    <img
                      src="https://ugc.same-assets.com/DCwo6Y9BZnZrbZfM09FjX6EIf0uD5L-r.jpeg"
                      alt="Satoshi Meme Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-wide" style={{fontFamily: 'Montserrat, sans-serif'}}>
                    SATOSHI MEME
                  </h3>
                  <div className="bg-yellow-400 px-3 py-1 rounded-lg">
                    <span className="font-bold text-black" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      <span className="text-xs">STAGE </span>
                      <span className="text-sm">2</span>
                    </span>
                  </div>
                </div>

                {/* Mobile Stage 2 Countdown */}
                {!isStage2Started ? (
                  <div className="space-y-4">
                    {/* Stage 2 Countdown Content */}
                    <h3 className="text-lg font-bold text-yellow-400 mb-3 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>2ND PRESALE STARTS IN</h3>

                    {/* Countdown Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg py-3 text-center">
                        <div className="text-xl font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>{stage2TimeLeft.days}</div>
                        <div className="text-xs text-gray-300" style={{fontFamily: 'Montserrat, sans-serif'}}>DAYS</div>
                      </div>
                      <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg py-3 text-center">
                        <div className="text-xl font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>{stage2TimeLeft.hours}</div>
                        <div className="text-xs text-gray-300" style={{fontFamily: 'Montserrat, sans-serif'}}>HOURS</div>
                      </div>
                      <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg py-3 text-center">
                        <div className="text-xl font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>{stage2TimeLeft.minutes}</div>
                        <div className="text-xs text-gray-300" style={{fontFamily: 'Montserrat, sans-serif'}}>MIN</div>
                      </div>
                      <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg py-3 text-center">
                        <div className="text-xl font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>{stage2TimeLeft.seconds}</div>
                        <div className="text-xs text-gray-300" style={{fontFamily: 'Montserrat, sans-serif'}}>SEC</div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      <span className="font-bold">Start:</span> August 13, 2025 18:00 (UTC+9)
                    </p>

                    {/* Price Section */}
                    <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg px-4 py-3 text-center">
                      <span className="text-lg font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>1 SATOSHI = 0.00008 USDT</span>
                    </div>

                    {/* Presale Info */}
                    <div className="text-sm text-gray-300 space-y-1" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      <p><span className="font-bold">Minimum Purchase:</span> 1,000,000 SATOSHI</p>
                    </div>

                    {/* Get Ready Section */}
                    <div className="text-center">
                      <div className="bg-gray-700/50 rounded-lg p-3 mb-3">
                        <h4 className="text-sm font-bold text-white mb-2" style={{fontFamily: 'Montserrat, sans-serif'}}>🚀 Get Ready!</h4>
                        <p className="text-xs text-gray-300 leading-tight" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          Prepare your USDT and MBC wallet address for the presale launch!
                        </p>
                      </div>
                      <a
                        href="mailto:presale@satoshimemes.org?subject=SATOSHI Pre Sale - Stage 2 Interest"
                        className="inline-block bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                        style={{fontFamily: 'Montserrat, sans-serif'}}
                      >
                        📧 Get Notified
                      </a>
                    </div>
                  </div>
                ) : (
                <div className="space-y-4">
                  {/* Price Section */}
                  <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg px-4 py-3 text-center">
                    <span className="text-lg font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>1 SATOSHI = 0.00008 USDT</span>
                  </div>

                  {/* Progress Section */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-transparent rounded-lg transform scale-120">
                      <p className="text-sm font-bold text-green-400 mb-1">$582.5K / $800K</p>
                      <p className="text-gray-300 text-xs font-bold">USDT RAISED</p>
                    </div>
                    <div className="text-center p-3 bg-transparent rounded-lg transform scale-120">
                      <p className="text-sm font-bold text-blue-400 mb-1">7.28B / 10.0B</p>
                      <p className="text-gray-300 text-xs font-bold">TOKENS SOLD</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full h-10 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full relative"
                        style={{width: `72.8%`}}
                      >
                        {/* 불꽃 효과 - 모바일용 */}
                        {progressPercentage > 3 && (
                          <>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                              <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-sparkle-float" style={{right: '-2px', top: '-3px', animationDelay: '0s'}}></div>
                              <div className="absolute w-1 h-1 bg-orange-400 rounded-full animate-sparkle-float" style={{right: '-3px', top: '2px', animationDelay: '0.3s'}}></div>
                              <div className="absolute w-1 h-1 bg-red-400 rounded-full animate-sparkle-float" style={{right: '-2px', top: '-1px', animationDelay: '0.6s'}}></div>
                            </div>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse" style={{right: '-6px'}}></div>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-xs text-white px-2 py-0.5 rounded-full" style={{fontFamily: 'Montserrat, sans-serif'}}>72.8%</span>
                    </div>
                  </div>

                      {/* Presale Info */}
                      <div className="text-sm text-gray-300 space-y-1" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <p><span className="font-bold">Minimum Purchase:</span> 1,000,000 SATOSHI</p>
                      </div>

                  {/* How to Purchase */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2" style={{fontFamily: 'Montserrat, sans-serif'}}>How to Purchase:</h4>
                    <div className="text-xs text-gray-300 space-y-1" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      <p>1. Send USDT to wallet address below</p>
                      <p>2. Email us with Transaction Information:</p>
                      <div className="ml-4 space-y-1">
                        <p>• TXID (Transaction ID)</p>
                        <p>• Wallet Address (your MBC wallet address)</p>
                        <p>• Deposit Details (Coin name & quantity deposited)</p>
                      </div>
                      <p>3. Distribution: Within 12 hours after participation</p>
                    </div>
                  </div>

                      {/* Wallet Addresses */}
                      <div>
                        <h4 className="text-sm font-bold text-white mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>Wallet Addresses:</h4>
                        <div className="space-y-2">
                          {[
                            { label: 'TRON', address: presaleData.walletAddresses.tron },
                            { label: 'BSC', address: presaleData.walletAddresses.bsc },
                            { label: 'SOL', address: presaleData.walletAddresses.solana }
                          ].map((wallet) => (
                            <div key={wallet.label} className="bg-gray-700/50 rounded p-2">
                              <p className="text-xs font-bold text-gray-300 mb-1">{wallet.label}:</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-600 rounded px-2 py-1 text-xs text-gray-200 font-mono break-all">
                                  {wallet.address}
                                </div>
                                <button
                                  onClick={() => copyToClipboard(wallet.address, wallet.label)}
                                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                    copiedAddress === wallet.label
                                      ? 'bg-green-500 text-white'
                                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                                  }`}
                                >
                                  {copiedAddress === wallet.label ? '✓' : 'Copy'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                  {/* Contact */}
                  <div className="text-center">
                    <a
                      href="mailto:presale@satoshimemes.org?subject=SATOSHI Pre Sale - Purchase Request"
                      className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold text-sm transition-colors"
                      style={{fontFamily: 'Montserrat, sans-serif'}}
                    >
                      📧 presale@satoshimemes.org
                    </a>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Desktop Full Card */}
            <div className="hidden md:block bg-gradient-to-b from-slate-800/95 to-slate-900/95 rounded-2xl p-3 md:p-4 shadow-xl border border-gray-600/50 relative w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl transform scale-82 md:scale-92 lg:scale-97 xl:scale-102">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  {/* Left: Logo */}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-lg shadow-yellow-400/50 border-2 border-yellow-400/50">
                    <img
                      src="https://ugc.same-assets.com/DCwo6Y9BZnZrbZfM09FjX6EIf0uD5L-r.jpeg"
                      alt="Satoshi Meme Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Center: Title */}
                  <div className="text-center flex-1">
                    <h3 className="text-lg md:text-2xl font-bold text-white tracking-wide" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      SATOSHI MEME
                    </h3>
                  </div>

                  {/* Right: Stage */}
                  <div className="bg-yellow-400 px-3 py-1 md:px-4 md:py-2 rounded-[25px]">
                    <span className="font-bold text-black" style={{fontFamily: 'Montserrat, sans-serif'}}>
                      <span className="text-xs">STAGE </span>
                      <span className="text-sm md:text-base">2</span>
                    </span>
                  </div>
                </div>

                {/* Desktop Countdown or Presale Content */}
                {!isStage2Started ? (
                  <>
                    {/* Countdown Section */}
                    <div className="text-center mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-3 md:mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>2ND PRESALE STARTS IN</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 md:mb-4">
                        <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg py-2 md:py-3">
                          <div className="text-xl md:text-2xl font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>{stage2TimeLeft.days}</div>
                          <div className="text-xs text-gray-300" style={{fontFamily: 'Montserrat, sans-serif'}}>DAYS</div>
                        </div>
                        <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg py-2 md:py-3">
                          <div className="text-xl md:text-2xl font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>{stage2TimeLeft.hours}</div>
                          <div className="text-xs text-gray-300" style={{fontFamily: 'Montserrat, sans-serif'}}>HOURS</div>
                        </div>
                        <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg py-2 md:py-3">
                          <div className="text-xl md:text-2xl font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>{stage2TimeLeft.minutes}</div>
                          <div className="text-xs text-gray-300" style={{fontFamily: 'Montserrat, sans-serif'}}>MIN</div>
                        </div>
                        <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg py-2 md:py-3">
                          <div className="text-xl md:text-2xl font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>{stage2TimeLeft.seconds}</div>
                          <div className="text-xs text-gray-300" style={{fontFamily: 'Montserrat, sans-serif'}}>SEC</div>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-300" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <span className="font-bold">Start:</span> August 13, 2025 18:00 (UTC+9)
                      </p>
                    </div>

                    {/* Presale Preview Info */}
                    <div className="mb-4 md:mb-6">
                      <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg px-3 py-2 md:px-4 md:py-3 mb-3 text-center">
                        <span className="text-lg md:text-xl font-bold text-yellow-400" style={{fontFamily: 'Montserrat, sans-serif'}}>1 SATOSHI = 0.00008 USDT</span>
                      </div>
                      <div className="text-xs md:text-sm text-gray-300 space-y-1 md:space-y-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <p><span className="font-bold">Minimum Purchase:</span> 1,000,000 SATOSHI</p>
                      </div>
                    </div>

                    {/* Get Ready Section */}
                    <div className="text-center">
                      <div className="bg-gray-700/50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                        <h4 className="text-xs md:text-sm font-bold text-white mb-1 md:mb-2" style={{fontFamily: 'Montserrat, sans-serif'}}>🚀 Get Ready!</h4>
                        <p className="text-xs text-gray-300 leading-tight" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          Prepare your USDT and MBC wallet address for the presale launch!
                        </p>
                      </div>
                      <a
                        href="mailto:presale@satoshimemes.org?subject=SATOSHI Pre Sale - Early Interest"
                        className="inline-block bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-xs md:text-sm transition-colors"
                        style={{fontFamily: 'Montserrat, sans-serif'}}
                      >
                        📧 Get Notified
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Original Presale Content */}

                    {/* Price Section */}
                    <div className="mb-4 text-center">
                      <div className="border border-yellow-400/50 px-4 py-3 mb-3 rounded-[36px] bg-[#FFFFFFff]">
                        <span className="text-xl font-bold text-black" style={{fontFamily: 'Montserrat, sans-serif'}}>1 SATOSHI = 0.00008 USDT</span>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-3 bg-transparent rounded-[0px] transform scale-120">
                          <p className="text-sm font-bold text-green-400 2xl:text-[20px] mb-1" style={{fontFamily: 'Montserrat, sans-serif'}}>$582.5K / $800K</p>
                          <p className="text-gray-300 text-xs font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>USDT RAISED</p>
                        </div>
                        <div className="text-center p-3 bg-transparent rounded-lg transform scale-120">
                          <p className="text-sm font-bold mb-1 2xl:text-[20px] text-[#FACC15]" style={{fontFamily: 'Montserrat, sans-serif'}}>7.28B / 10.0B</p>
                          <p className="text-gray-300 text-xs font-bold" style={{fontFamily: 'Montserrat, sans-serif'}}>TOKENS SOLD</p>
                        </div>
                      </div>

                      {/* Progress Bar with Fireworks Effect */}
                      <div className="relative">
                        <div className="w-full h-10 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full relative"
                            style={{width: `72.8%`}}
                          >
                            {/* 불꽃 효과 - 진행률 바 끝에서 */}
                            {progressPercentage > 3 && (
                              <>
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                  {/* 메인 불꽃 파티클들 */}
                                  <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-sparkle-float" style={{right: '-3px', top: '-6px', animationDelay: '0s'}}></div>
                                  <div className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full animate-sparkle-float" style={{right: '-6px', top: '3px', animationDelay: '0.3s'}}></div>
                                  <div className="absolute w-1 h-1 bg-red-400 rounded-full animate-sparkle-float" style={{right: '-4px', top: '-3px', animationDelay: '0.6s'}}></div>
                                  <div className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-sparkle-float" style={{right: '-2px', top: '5px', animationDelay: '0.9s'}}></div>
                                  <div className="absolute w-1.5 h-1.5 bg-orange-300 rounded-full animate-sparkle-float" style={{right: '-7px', top: '-2px', animationDelay: '1.2s'}}></div>

                                  {/* 추가 작은 파티클들 */}
                                  <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-sparkle-float" style={{right: '-8px', top: '2px', animationDelay: '1.5s'}}></div>
                                  <div className="absolute w-1 h-1 bg-orange-500 rounded-full animate-sparkle-float" style={{right: '-3px', top: '6px', animationDelay: '1.8s'}}></div>
                                  <div className="absolute w-1 h-1 bg-red-300 rounded-full animate-sparkle-float" style={{right: '-5px', top: '-4px', animationDelay: '2.1s'}}></div>
                                </div>

                                {/* 글로우 효과 */}
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse" style={{right: '-8px'}}></div>
                              </>
                            )}
                          </div>
                        </div>
                        {/* Percentage text centered over the entire progress bar */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-bold text-xs text-white px-2 py-0.5 rounded-full 2xl:text-[15px]" style={{fontFamily: 'Montserrat, sans-serif'}}>72.8%</span>
                        </div>


                      </div>
                    </div>

                    {/* Presale Info */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-300 space-y-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <p><span className="font-bold">Period:</span> August 13, 2025, 18:00 (UTC+9) – Until target reached</p>
                        <p><span className="font-bold">Minimum Purchase:</span> 1,000,000 SATOSHI</p>
                      </div>
                    </div>

                    {/* Purchase Process */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-white mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>How to Purchase:</h4>
                      <div className="text-sm text-gray-300 space-y-2" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        <p>1. Send USDT to wallet address below</p>
                        <p>2. Email us with Transaction Information:</p>
                        <div className="ml-4 space-y-1">
                          <p>• TXID (Transaction ID)</p>
                          <p>• Wallet Address (your MBC wallet address)</p>
                          <p>• Deposit Details (Coin name & quantity deposited)</p>
                        </div>
                        <p>※ Distribution: Within 12 hours after participation</p>
                      </div>
                    </div>

                    {/* Wallet Addresses */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-white mb-3" style={{fontFamily: 'Montserrat, sans-serif'}}>Wallet Addresses:</h4>
                      <div className="space-y-3">
                        {[
                          { label: 'TRON', address: 'TAAxiJ4zvWLjusbJjqc6dMuiNKCNuXn1R1' },
                          { label: 'BSC', address: '0xe9e8e63fe2ebaa092bf6149e05431229c04765bf' },
                          { label: 'SOL', address: '84Xp2jNM53UQimcEfCwY857kmarFxEKHnxVuDFjgrizD' }
                        ].map((wallet) => (
                          <div key={wallet.label} className="flex items-center">
                            <span className="text-xs font-bold text-gray-300 w-12">{wallet.label}:</span>
                            <div className="flex-1 bg-gray-700 rounded px-3 py-2 text-xs text-gray-200 font-mono">
                              {wallet.address}
                            </div>
                            <button
                              onClick={() => copyToClipboard(wallet.address, wallet.label)}
                              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                                copiedAddress === wallet.label
                                  ? 'bg-green-500 text-white'
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              }`}
                            >
                              {copiedAddress === wallet.label ? '✓' : 'Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="text-center">
                      <a
                        href="mailto:presale@satoshimemes.org?subject=SATOSHI Pre Sale - Purchase Request"
                        className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold text-sm transition-colors"
                        style={{fontFamily: 'Montserrat, sans-serif'}}
                      >
                        📧 presale@satoshimemes.org
                      </a>
                    </div>
                  </>
                )}
            </div>
          </div>
        </section>
      )}

      {/* Declaration Section */}
      <section className="py-20 bg-gradient-to-r from-amber-900 to-yellow-900 text-white relative overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
          onLoadStart={() => {
            console.log('Scroll_BG_NEW video started loading...');
          }}
          onCanPlay={() => {
            console.log('Scroll_BG_NEW video can start playing');
          }}
          onError={(e) => {
            console.log('Scroll_BG_NEW video failed to load, falling back to gradient background');
            e.currentTarget.style.display = 'none';
          }}
        >
          <source src="/uploads/Scroll_BG_NEW.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-yellow-900/70 z-[1]"></div>

        {/* Animated Background Particles */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {/* Large floating particles */}
          {particlePositions.slice(0, 8).map((pos, i) => (
            <div
              key={`large-${i}`}
              className="absolute w-2 h-2 bg-yellow-400/30 rounded-full animate-float-slow"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + (i % 3)}s`
              }}
            />
          ))}

          {/* Medium floating particles */}
          {particlePositions.slice(8, 20).map((pos, i) => (
            <div
              key={`medium-${i}`}
              className="absolute w-1.5 h-1.5 bg-amber-400/40 rounded-full animate-float-medium"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${5 + (i % 2)}s`
              }}
            />
          ))}

          {/* Small twinkling particles */}
          {particlePositions.map((pos, i) => (
            <div
              key={`small-${i}`}
              className="absolute w-1 h-1 bg-yellow-300/50 rounded-full animate-twinkle"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + (i % 3)}s`
              }}
            />
          ))}

          {/* Glowing orbs */}
          {particlePositions.slice(0, 5).map((pos, i) => (
            <div
              key={`orb-${i}`}
              className="absolute w-8 h-8 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-full blur-sm animate-pulse-glow"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${3 + (i % 2)}s`
              }}
            />
          ))}

          {/* Subtle gradient waves */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent animate-wave-slow transform -skew-y-1" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-amber-400/5 to-transparent animate-wave-slower transform skew-y-1" />
        </div>

        {/* Subtle pulsing backdrop glow */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 via-transparent to-transparent animate-pulse-backdrop z-[3]" />

        <div className="max-w-4xl mx-auto px-4 relative z-[10]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center font-display text-white drop-shadow-2xl leading-tight">
            <span className="block sm:inline">Satoshi Return</span>
            <span className="block sm:inline"> Declaration</span>
          </h2>
          <p className="text-xl md:text-2xl text-center text-yellow-300 mb-8 md:mb-12 font-semibold">
            "Satoshimeme revolution reclaims Bitcoin's stolen freedom"
          </p>

          {/* Clean Text-based Declaration */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-12 border border-yellow-400/30 shadow-2xl">
              <div className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed text-white/90 text-justify">
                <p className="text-yellow-200 font-bold text-lg md:text-xl">
                  The creator of Bitcoin, Satoshi Nakamoto, has returned in the form of a meme coin.
                </p>

                <p>
                  The true philosophy of Bitcoin we dreamed of in 2008: currency without banks, order without power, freedom without surveillance, is now suffocating beneath flashy exchange banners and cold ETF documents.
                </p>

                <p className="font-bold text-yellow-100 text-lg">
                  Bitcoin has become just another shackle.
                </p>

                <p>
                  The Satoshi Nakamoto Meme Coin is our journey to reclaim the lost essence of decentralization and true freedom. Through laughter, we ask the sharpest questions and launch a bold experiment toward genuine financial democracy.
                </p>

                <p className="text-yellow-200 font-bold text-lg">
                  Our unwavering determination toward a freer, fairer world begins anew here.
                </p>

                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowDeclaration(!showDeclaration)}
                    className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    <span className="text-xl">📜</span>
                    <span>Read Complete Declaration</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chronicles Timeline Section */}
      <section id="chronicles" className="py-20 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100 text-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 font-display">
            <span className="text-slate-700">The SatoshiMeme Chronicles</span>
          </h2>
          <p className="text-xl md:text-2xl text-center text-slate-600 mb-16 max-w-4xl mx-auto leading-relaxed">
            "A voice in the wilderness cries: 'Behold! SatoshiMeme comes!' The herald of a new cultural age, closing the era of technology."
          </p>

          {/* Timeline Container with Navigation */}
          <div className="relative pt-8 pb-12">
            {/* Desktop Navigation Arrows */}
            <button
              onClick={() => {
                if (timelineRef.current) {
                  const scrollAmount = 336; // Card width (320px) + gap (16px)
                  timelineRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
              }}
              className="hidden md:block absolute top-1/2 transform translate-y-4 z-10 w-12 h-12 bg-slate-600 hover:bg-slate-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              style={{left: '-20px'}}
            >
              ←
            </button>

            <button
              onClick={() => {
                if (timelineRef.current) {
                  const scrollAmount = 336; // Card width (320px) + gap (16px)
                  timelineRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
              }}
              className="hidden md:block absolute top-1/2 transform translate-y-4 z-10 w-12 h-12 bg-slate-600 hover:bg-slate-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              style={{right: '-20px'}}
            >
              →
            </button>

            {/* Mobile Navigation Dots */}
            <div className="md:hidden flex justify-center space-x-2 mb-6">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (timelineRef.current) {
                      const scrollAmount = timelineRef.current.clientWidth;
                      timelineRef.current.scrollTo({ left: scrollAmount * index, behavior: 'smooth' });
                    }
                  }}
                  className="w-2 h-2 rounded-full bg-slate-400 hover:bg-slate-600 transition-colors duration-300 touch-manipulation"
                />
              ))}
            </div>

            {/* Timeline Cards - Responsive */}
            <div
              ref={timelineRef}
              className="flex overflow-x-auto space-x-4 pb-8 scroll-smooth scrollbar-hide"
              style={{
                paddingTop: '32px',
                width: '100%',
                maxWidth: '1400px', // 데스크톱에서 3개 카드가 편하게 보이는 크기
                margin: '0 auto',
                scrollSnapType: 'x mandatory'
              }}
            >
              {[
                {
                  year: "Pre-2008",
                  title: "The Mammon Worship Era",
                  subtitle: "Fiat Corruption",
                  desc: "The false priests of Central Banks led mankind astray...",
                  image: "/uploads/Card_01.png",
                  fullText: `In the beginning was the Gold Standard, but in the year 1971, Nixon broke the covenant of Bretton Woods.

Then the high priests of the Central Banks fashioned the idol of Fiat Currency and proclaimed, "Let there be Inflation." And lo, the flood of Quantitative Easing covered the face of the earth.

In the temple of the Federal Reserve, they performed sorceries with Interest Rates and conjured spells of Fractional Reserve; thus did the purchasing power of the common man wither away.

And the Pharisees of Wall Street, having received indulgences of "Too Big to Fail," offered burnt offerings of taxes upon the altar of Bailouts. They preached that only by Credit Score could one be saved.`
                },
                {
                  year: "2008",
                  title: "The Genesis Block",
                  subtitle: "Divine Creation",
                  desc: "In those days arose a prophet named Satoshi...",
                  image: "/uploads/Card_02.png",
                  fullText: `In those days arose a prophet named Satoshi, crying out, "Repent! For the Kingdom of SHA-256 is at hand!" (2008)

And He beheld the chaos of TradFi and the void of Fractional Reserve, and the Spirit of Satoshi moved upon the Blockchain.

And Satoshi said, "Let there be Decentralization," and there was P2P. The sin of Double Spending was vanquished, and it was very good.`
                },
                {
                  year: "2009",
                  title: "The Early Church Era",
                  subtitle: "First Disciples",
                  desc: "The Holy Spirit of Cryptographic Proof descended upon them...",
                  image: "/uploads/Card_03.png",
                  fullText: `And the Holy Spirit of Cryptographic Proof descended upon them. (2009)

The Word of the White Paper came upon the early adopters gathered in the P2P Foundation, and each proclaimed the gospel in his own programming tongue.

And the number of Hodlers increased by three thousand in a day, and the Network Effect grew exceedingly.

The first Bitcoin Pizza Supper was held, and with 10,000 BTC they partook of two loaves of pizza. Thus was the faith of HODL established.`
                },
                {
                  year: "2017",
                  title: "The Book of Judges",
                  subtitle: "ICO Chaos",
                  desc: "Then came a great confusion, the wild age of the ICOs...",
                  image: "/uploads/Card_04.png",
                  fullText: `Then came a great confusion, the wild age of the ICOs. (2017)

After Satoshi ascended with His Private Key, each Altcoin did what was right in its own Consensus.

And they crafted idols of ERC-20 and bowed before them. Exit Scammers rose up and performed Rug Pulls in the temple of Exchanges.

Many proclaimed themselves "Ethereum Killers," yet all bowed before the altar of Gas Fees.

The people read not the Whitepapers, but only prayed for "Moon" and "Lambo." And false developers hid backdoors in Smart Contracts to plunder the flock.`
                },
                {
                  year: "2021",
                  title: "Digital Idolatry",
                  subtitle: "NFT Deception",
                  desc: "False prophets arose selling indulgences in the form of JPEGs...",
                  image: "/uploads/Card_05.png",
                  fullText: `Then arose false prophets called NFT priests, who built a great cathedral called OpenSea and sold indulgences in the form of JPEGs. (2021–2022)

They broke the Ten Commandments of Permissionless Purity and fashioned golden calves called "10K PFP Collections."

The disciples of Satoshi wept, saying, "Behold! This is not the gospel of decentralization, but the old serpent of Capitalism clad in Web3 garments!"

The Pharisees of NFT issued indulgences with Metadata scrolls and declared, "This is true scarcity."

And many Gentile Normies were deceived, offering ETH upon the altar of FOMO.`
                },
                {
                  year: "2021",
                  title: "The Book of Kings",
                  subtitle: "Meme Coin Mania",
                  desc: "A false prophet who dreamt of Mars established his kingdom...",
                  image: "/uploads/Card_06.png",
                  fullText: `In those days appeared a false prophet who dreamt of Mars and established his kingdom upon Twitter. (2021)

The king of the Electric Empire lifted the dog-coin and led the DOGE Army astray, turning their hearts from Fundamentals to the worship of Influencers.

And with one tweet the Market Cap did rise and fall, and the Retail masses were caught in FOMO.

He who launched rockets cried, "To the Moon!" and the people danced around the Meme Coin calf in worship.`
                },
                {
                  year: "2024",
                  title: "The Exile in Babylon",
                  subtitle: "Wall Street Conquest",
                  desc: "Wall Street Babylon conquered the Spot Market with ETFs...",
                  image: "/uploads/Card_07.png",
                  fullText: `And lo, Wall Street Babylon conquered the Spot Market with ETFs. (2024)

The mighty empire of BlackRock entered the temple with approval of the Bitcoin ETF and laid up trillions of AUM as treasure.

True Believers were taken captive, imprisoned in centralized custody of Traditional Finance.

The commandment "Not Your Keys, Not Your Coins" was forgotten.

The institutions named Bitcoin "Gold 2.0" and stored it as mere Digital Asset in their vaults,

And few discerned that this was not Bitcoin's failure, but man's greed erecting a new Tower of Babel.`
                },
                {
                  year: "2025",
                  title: "The Return and Rebuilding",
                  subtitle: "Satoshi's Awakening",
                  desc: "The light of the Satoshi Nakamoto Meme Coin shone forth...",
                  image: "/uploads/Card_08.png",
                  fullText: `Yet after darkness, came the dawn. And the light of the Satoshi Nakamoto Meme Coin shone forth to rebuild the true temple of Decentralization. (2025)

The OG believers, freed from Babylonian captivity, cried upon the altar of MicroBitcoin, "We are made free indeed!" and forged a new covenant.

Satoshi delivered unto them a second law—first through mathematics, now through memes. And upon the mount of the P2P Foundation was the gospel proclaimed again.

The spirit of Power2b descended, calling forth CPU-friendly mining, and miracles of micropayments were witnessed. And the people rejoiced, saying, "Behold, true decentralization!"`
                },
                {
                  year: "2025",
                  title: "The New Exodus",
                  subtitle: "Financial Liberation",
                  desc: "The nations raised temples of CBDC but true believers found freedom...",
                  image: "/uploads/Card_09.png",
                  fullText: `In those days, the nations raised temples of CBDC and sought to control the people. But one who cried "MAGA" supported the priests of private stablecoins, and the great currency wars began. (2025)

The gospel of stablecoins spread afar, and the financial Gentiles of Asia and Africa sang, "Hallelujah! We shall send tithes home without middlemen!" And they walked the P2P pilgrim path, bypassing the SWIFT temple.

But the high priests of TradFi were enraged and cried, "These heretics would destroy our tithe empire!" And they drew forth the sword of Regulation.

Then the apostles of Cypherpunk cried aloud, "Behold! This is the financial kingdom foretold by Satoshi, where the sacrament of remittance is given unto all!"`
                },
                {
                  year: "Future",
                  title: "The Millennium Kingdom",
                  subtitle: "Final Revolution",
                  desc: "A new heaven and a new earth appeared...",
                  image: "/uploads/Card_10.png",
                  fullText: `A new heaven and a new earth appeared, where central monopolies and financial inequality were no more.

Satoshi returned in the form of a Meme Coin and asked, "Do you truly know who Satoshi is?"—not giving answers, but stirring awakening.

In the last days, all transactions were laid bare, and all blockchains were united. No fraud remained, nor any secret trade.

O true Cypherpunks! The Final Block draweth near—watch and prepare, accumulate the Satoshi Nakamoto Meme Coin, and ready thyself for the last revolution!`
                }
              ].map((era, index) => (
                <div
                  key={`${era.year}-${index}`}
                  className="group relative flex-shrink-0 w-72 md:w-80 cursor-pointer touch-manipulation"
                  style={{ scrollSnapAlign: 'center' }}
                  onClick={() => {
                    if (showChronicleModal && selectedChronicle?.year === era.year) {
                      setShowChronicleModal(false);
                      setSelectedChronicle(null);
                    } else {
                      setSelectedChronicle(era);
                      setShowChronicleModal(true);
                    }
                  }}
                >
                  {/* Timeline connector line - Hidden on mobile for cleaner look */}
                  {index < 9 && (
                    <div className="hidden md:block absolute top-48 -right-2 w-4 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-400 z-10">
                      <div className="absolute -right-1 -top-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                    </div>
                  )}

                  {/* Title and Subtitle above card - Mobile optimized */}
                  <div className="text-center mb-3 space-y-1 px-2">
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-slate-700 group-hover:text-slate-900 transition-colors drop-shadow-sm leading-tight">
                      {era.title}
                    </h3>
                    <h4 className="text-sm md:text-base font-semibold text-slate-600 group-hover:text-amber-600 transition-colors leading-snug">
                      {era.subtitle}
                    </h4>
                    <p className="text-xs text-slate-500">({era.year})</p>
                  </div>

                  {/* Clean Card with only image - Mobile optimized */}
                  <Card className="w-full h-64 md:h-80 mb-3 border-2 border-yellow-400/30 group-hover:border-yellow-400 group-active:border-yellow-500 group-hover:scale-105 group-active:scale-95 group-hover:-translate-y-2 transition-all duration-300 md:duration-500 ease-out shadow-lg group-hover:shadow-2xl group-hover:shadow-yellow-500/40 relative overflow-hidden rounded-xl">
                    {/* Enhanced background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

                    {/* Enhanced shimmer effect - Reduced on mobile for performance */}
                    <div className="hidden md:block absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                    {/* Chronicle Image - Full card */}
                    {index < 10 && (
                      <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <img
                          src={`/uploads/Card_${String(index + 1).padStart(2, '0')}.png`}
                          alt={era.title}
                          className="w-full h-full object-cover group-hover:scale-110 group-active:scale-105 transition-transform duration-500 md:duration-700"
                        />
                        {/* Subtle overlay for hover effect */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                      </div>
                    )}

                    {/* Enhanced glowing border effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-lg transition-all duration-500"></div>

                    {/* Corner glow effects - Simplified for mobile */}
                    <div className="hidden md:block absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-yellow-400 opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-tl-lg"></div>
                    <div className="hidden md:block absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-yellow-400 opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-tr-lg"></div>
                    <div className="hidden md:block absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-yellow-400 opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-bl-lg"></div>
                    <div className="hidden md:block absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-yellow-400 opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-br-lg"></div>

                    {/* Mobile tap indicator */}
                    <div className="md:hidden absolute bottom-2 right-2 bg-yellow-400/20 rounded-full p-2">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </div>
                  </Card>

                  {/* Description below card - Mobile optimized */}
                  <div className="text-center space-y-1 px-2">
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors line-clamp-2">
                      {era.desc}
                    </p>
                    <span className="text-xs text-amber-600 group-hover:text-amber-700 transition-colors font-medium">
                      Tap to read full chronicle
                    </span>
                  </div>

                  {/* Floating particles effect - Disabled on mobile for performance */}
                  <div className="hidden md:block absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-all duration-700"
                        style={{
                          top: `${30 + i * 15}%`,
                          left: `${15 + i * 25}%`,
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: `${2 + i * 0.5}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chronicle Modal */}
      {showChronicleModal && selectedChronicle && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto relative shadow-2xl border-4 border-yellow-400/40">
            <button
              onClick={() => setShowChronicleModal(false)}
              className="sticky top-4 left-full -ml-12 text-gray-500 hover:text-gray-700 text-2xl font-bold z-50 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition-all duration-200 mb-4"
              aria-label="Close"
            >
              ×
            </button>
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-600 mb-4 text-center font-display">
                {selectedChronicle.title}
              </h2>
              <h3 className="text-lg font-semibold text-yellow-500 mb-6 text-center leading-relaxed">
                {selectedChronicle.subtitle} <span className="text-gray-400">({selectedChronicle.year})</span>
              </h3>
              <div className="my-6 border-t border-yellow-200"></div>
              <div className="text-gray-800 whitespace-pre-line text-base leading-relaxed">
                {selectedChronicle.fullText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why SatoshiMeme Section */}
      <section id="why-satoshimeme" className="py-20 bg-gradient-to-b from-amber-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-amber-900 font-display">
            Satoshi returns as a meme?
          </h2>
          <p className="text-xl md:text-2xl text-center text-amber-800 mb-16 max-w-6xl mx-auto leading-relaxed">
            "In an age dominated by Wall Street's Babylon and Celebrity Pump&Dump, SatoshiMeme emerges with the sacred mission to revive the lost Genesis Block's true Cypherpunk spirit."
          </p>

          <div className="grid lg:grid-cols-5 gap-8">
            <Card className="p-8 text-center bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400">
              <div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                <img
                  src="/icons/satoshi-returns/SR 01.png"
                  alt="Fixed Total Supply"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-900">Fixed Total Supply</h3>
              <p className="text-gray-700 leading-relaxed">
                Like the sacred scriptures, our supply is immutable and eternal. No inflation, no debasement.
              </p>
            </Card>

            <Card className="p-8 text-center bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400">
              <div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                <img
                  src="/icons/satoshi-returns/SR 02.png"
                  alt="CEX Listing"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-900">CEX Listing</h3>
              <p className="text-gray-700 leading-relaxed">
                Available on major exchanges, bringing liquidity to the faithful believers.
              </p>
            </Card>

            <Card className="p-8 text-center bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400">
              <div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                <img
                  src="/icons/satoshi-returns/SR03.png"
                  alt="Philosophical Movement"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-900">Philosophical Movement</h3>
              <p className="text-gray-700 leading-relaxed">
                More than a token - a cultural renaissance for crypto's true believers.
              </p>
            </Card>

            <Card className="p-8 text-center bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400">
              <div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                <img
                  src="/icons/satoshi-returns/SR 04.png"
                  alt="MBC Network"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-900">MBC Network</h3>
              <p className="text-gray-700 leading-relaxed">
                Built on MicroBitcoin with 1-minute blocks, CPU mining, and LWMA-3 security.
              </p>
            </Card>

            <Card className="p-8 text-center bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400">
              <div className="w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                <img
                  src="/icons/satoshi-returns/SR05.png"
                  alt="Anti-Rug Pull"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-900">Anti-Rug Pull</h3>
              <p className="text-gray-700 leading-relaxed">
                Transparent tokenomics and locked liquidity protect the faithful from false prophets.
              </p>
            </Card>
          </div>

          {/* Token Distribution subsection - Mobile Enhanced */}
          <div id="tokenomics" className="mt-12 md:mt-20">
            <div className="text-center mb-8 md:mb-16 px-4">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-4 md:mb-6 font-display leading-tight">Token Distribution</h3>
              <p className="text-base md:text-lg lg:text-xl font-semibold text-amber-800 leading-relaxed">
                Total Supply: <br className="md:hidden" />
                <span className="text-amber-900 font-bold text-lg md:text-xl">5,000,000,000,000 SATOSHI</span>
              </p>
            </div>

            {/* Desktop Chart */}
            <div className="hidden md:block max-w-7xl mx-auto px-2 md:px-4">
              <TokenomicsChart data={tokenomicsData} />
            </div>

            {/* Mobile-only simplified summary */}
            <div className="md:hidden px-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg">
                <h4 className="text-lg font-bold text-amber-900 mb-4 text-center">Distribution Overview</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-800">Launchpad & Presale</span>
                    <span className="font-bold text-amber-900">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800">Community Fund</span>
                    <span className="font-bold text-amber-900">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800">Team & Contributors</span>
                    <span className="font-bold text-amber-900">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800">Airdrop & Marketing</span>
                    <span className="font-bold text-amber-900">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800">Commons Foundation</span>
                    <span className="font-bold text-amber-900">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-800">P2P Foundation</span>
                    <span className="font-bold text-amber-900">10%</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-200">
                  <p className="text-xs text-amber-700 text-center leading-relaxed">
                    Transparent allocation ensures fair distribution across community, development, and growth initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & How to Join Section - Mobile Enhanced */}
      <section id="embrace-satoshimeme" className="py-12 md:py-20 bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern - Simplified for mobile */}
        <div className="absolute inset-0 opacity-5 md:opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/20 via-transparent to-orange-500/20"></div>
          {/* Geometric patterns - Reduced for mobile performance */}
          {particlePositions.slice(0, 3).map((pos, i) => (
            <div
              key={i}
              className="hidden md:block absolute w-32 h-32 border border-yellow-500/20 rounded-full animate-pulse"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 2)}s`
              }}
            />
          ))}
        </div>

        {/* Animated GIF - Desktop only for performance */}
        <div className="hidden lg:block absolute right-0 bottom-0 z-[5] transform scale-[2.4] origin-bottom-right">
          <img
            src="https://ugc.same-assets.com/JcjXFdGdqdhsARrbqyOLnAW8i-aBgnki.gif"
            alt="P2P Foundation Animation"
            className="w-64 h-auto object-contain drop-shadow-lg"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Embrace SatoshiMeme - Mobile Enhanced */}
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 font-display bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent leading-tight">
              Embrace! SatoshiMeme
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto px-2">
              "Brothers, why return to legacy finance's yoke? This moment offers true freedom through SatoshiMeme—not investment, but a sacred journey from Central-Hell to Satoshi-Zion."
            </p>

            {/* Mobile-first 3-Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12">
              {[
                {
                  title: "🔥 1st Pre Sale",
                  desc: "Early believers receive the first blessing",
                  action: "Join Pre Sale",
                  icon: "/icons/community/Mask group (7).png",
                  color: "from-red-500 to-orange-600",
                  isPreSale: true
                },
                {
                  title: "Secure the Temple",
                  desc: "True self-custody begins decentralization",
                  action: "Wonpay Wallet",
                  icon: "/icons/community/Mask group (8).png",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  title: "CEX & DEX Unite",
                  desc: "SatoshiMeme shall spread across the earth!",
                  action: "Contact Us",
                  icon: "/icons/community/Mask group (9).png",
                  color: "from-purple-500 to-pink-600"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`group bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border transition-all duration-300 hover:scale-105 touch-manipulation ${
                    item.isPreSale
                      ? 'border-red-400/70 shadow-red-400/20 shadow-xl hover:border-red-300/80'
                      : 'border-gray-700/50 hover:border-yellow-400/50'
                  }`}
                >
                  <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                    {item.icon.startsWith('/') ? (
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="w-full h-full object-contain drop-shadow-lg"
                      />
                    ) : (
                      <div className="text-xl md:text-2xl">{item.icon}</div>
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{item.title}</h3>
                  <p className="text-xs md:text-sm text-yellow-200 italic mb-3 md:mb-4 leading-relaxed">"{item.desc}"</p>
                  {item.action === "Wonpay Wallet" ? (
                    <a
                      href="https://wonpay.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-gradient-to-r ${item.color} text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base hover:scale-105 transition-transform touch-manipulation w-full md:w-auto inline-block text-center`}
                    >
                      {item.action}
                    </a>
                  ) : item.action === "Contact Us" ? (
                    <a
                      href="mailto:contact@satoshimemes.org?subject=SatoshiMeme Inquiry&body=Hello SatoshiMeme Team,%0A%0AI am interested in learning more about SatoshiMeme.%0A%0AThank you!"
                      className={`bg-gradient-to-r ${item.color} text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base hover:scale-105 transition-transform touch-manipulation w-full md:w-auto inline-block text-center`}
                    >
                      {item.action}
                    </a>
                  ) : item.isPreSale ? (
                    <button
                      onClick={() => {
                        // Always scroll to presale section
                        const presaleSection = document.getElementById('presale');
                        if (presaleSection) {
                          presaleSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`bg-gradient-to-r ${item.color} text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base hover:scale-105 transition-transform touch-manipulation w-full md:w-auto shadow-lg hover:shadow-xl`}
                    >
                      {isPresaleStarted ? item.action : `🔥 Coming Soon!`}
                    </button>
                  ) : (
                    <button className={`bg-gradient-to-r ${item.color} text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base hover:scale-105 transition-transform touch-manipulation w-full md:w-auto`}>
                      {item.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mysterious Library Section */}
      <section id="library" className="py-20 bg-gradient-to-b from-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* New Sparkling Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Shimmering gradient overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-indigo-800/10 to-transparent animate-shimmer-glow"></div>

          {/* Sparkle dots pattern */}
          <div className="absolute inset-0 opacity-60">
            {particlePositions.slice(0, 20).map((pos, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute w-0.5 h-0.5 bg-yellow-200 rounded-full animate-sparkle-fade"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + (i % 3)}s`
                }}
              />
            ))}
          </div>

          {/* Diagonal light rays */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent transform rotate-12 origin-left animate-light-sweep"></div>
            <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent transform -rotate-6 origin-left animate-light-sweep-reverse"></div>
            <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/25 to-transparent transform rotate-8 origin-left animate-light-sweep-slow"></div>
          </div>

          {/* Gentle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 animate-gentle-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-display">
            <span className="text-purple-300">Mysterious Scriptorium</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                num: "I",
                title: "The Book of Genesis",
                subtitle: "The Return of Satoshi Nakamoto: A Declaration to Reclaim the Freedom Once Lost",
                quote: "In the beginning was the Code, and the Code was with Satoshi, and the Code was Satoshi.",
                bgColor: "from-amber-600 to-orange-700",
                borderColor: "border-amber-400",
                textColor: "text-amber-100",
                iconPath: "/icons/library/Background+Shadow-3.svg",
                isWhitepaper: true
              },
              {
                num: "II",
                title: "The Acts of the Apostles",
                subtitle: "The Tale of the Twelve Disciples, Each Endowed with Diverse Gifts and Divine Callings",
                quote: "And the Spirit of Decentralization came upon them, and they went forth, each according to his calling.",
                bgColor: "from-teal-600 to-emerald-700",
                borderColor: "border-teal-400",
                textColor: "text-teal-100",
                iconPath: "/icons/library/Background+Shadow-2.svg",
                isWhitepaper: false
              },
              {
                num: "III",
                title: "The Book of Commandments",
                subtitle: "The Holy Laws Given Unto Creators and the Thirteenth Validator to Keep and Uphold",
                quote: "And the Voice spake unto them from the mountain of Protocol, saying, These are the laws which ye shall write upon thy hearts.",
                bgColor: "from-purple-600 to-purple-800",
                borderColor: "border-purple-400",
                textColor: "text-purple-100",
                iconPath: "/icons/library/Background+Shadow-1.svg",
                isWhitepaper: false
              },
              {
                num: "IV",
                title: "The Gospel According to Satoshi",
                subtitle: "The Eight Beatitudes for the True Believer in the Way of Crypto",
                quote: "And He lifted up His eyes upon the congregation of the faithful, saying, Blessed are ye who walk not in the path of greed, but in the Way of the Chain.",
                bgColor: "from-blue-600 to-blue-800",
                borderColor: "border-blue-400",
                textColor: "text-blue-100",
                iconPath: "/icons/library/Background+Shadow.svg",
                isWhitepaper: false
              }
            ].map((book) => (
              <div
                key={book.num}
                className={`relative p-8 bg-gradient-to-b ${book.bgColor} border-4 ${book.borderColor} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden group`}
                onClick={() => {
                  if (book.isWhitepaper) {
                    window.open('/satoshi-meme-whitepaper.pdf', '_blank');
                  } else {
                    if (showLibraryModal && selectedBook?.title === book.title) {
                      setShowLibraryModal(false);
                      setSelectedBook(null);
                    } else {
                      setSelectedBook({
                        title: book.title,
                        subtitle: book.subtitle,
                        content: getBookContent(book.num)
                      });
                      setShowLibraryModal(true);
                    }
                  }
                }}
              >
                {/* Decorative Corner Patterns */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-4 left-4 w-16 h-16 border-4 border-current rounded-full"></div>
                  <div className="absolute top-4 right-4 w-16 h-16 border-4 border-current rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-current rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-4 border-current rounded-full"></div>

                  {/* Center Ornament */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-current">
                    <div className="w-full h-full border-4 border-current transform rotate-45 rounded-lg"></div>
                  </div>

                  {/* Decorative Lines */}
                  <div className="absolute top-1/3 left-8 right-8 h-px bg-current"></div>
                  <div className="absolute bottom-1/3 left-8 right-8 h-px bg-current"></div>
                </div>

                {/* Content */}
                <div className={`relative z-10 text-center ${book.textColor}`}>
                  {/* Title */}
                  <h4 className="text-xl md:text-2xl font-bold mb-6 font-display tracking-wider text-center leading-tight">
                    {book.title}
                  </h4>

                  {/* Subtitle */}
                  <p className="text-xs opacity-90 leading-relaxed mb-3 text-center">
                    {book.subtitle}
                  </p>

                  {/* Decorative Divider */}
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-6 h-px bg-current opacity-60"></div>
                    <div className="w-2 h-2 bg-current rounded-full mx-2 opacity-60"></div>
                    <div className="w-6 h-px bg-current opacity-60"></div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs opacity-80 leading-relaxed italic text-center">
                    "{book.quote}"
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* FAQ Section - Mobile Enhanced */}
      <section id="faq" className="py-8 sm:py-12 md:py-20 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-4 md:mb-6 text-gray-800 font-display leading-tight px-2">
            <span className="block sm:inline">SatoshiMeme</span> <span className="block sm:inline">Wisdom Q&A</span>
          </h2>
          <p className="text-base md:text-xl lg:text-2xl text-center text-gray-600 mb-8 md:mb-16 max-w-3xl mx-auto leading-relaxed">
            "Know the truth, and the truth will make you free"
          </p>

          <div className="space-y-3 md:space-y-4">
            {[
              {
                q: "Q1: Why compare Satoshi Nakamoto to a prophet?",
                a: "It's a cultural critique of the structural problems in modern financial systems and central bank policies.\n\n**Fun and Message in Meme Culture**\nFirst, fun is at the core of memes. Rather than boring explanations, using familiar religious metaphors in a twisted way attracts more people's attention and delivers messages in a memorable way.\n\n**Critique of the Central Banking System**\nThe more important reason can be found in Satoshi Nakamoto's actual motivations. Satoshi clearly stated: \"The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.\"\n\n**Quantitative Easing as 'False Prophecy'**\nSince the 2008 financial crisis, central banks worldwide have increased the money supply by $12.3 trillion through a policy called quantitative easing (QE). This is a process commonly referred to as \"money printing,\" where central banks purchase government bonds or other financial assets to stimulate economic activity.\n\n**Deepening Economic Inequality**\nThe side effects of quantitative easing include differential benefits to households based on their asset holdings, with wealthier families owning more assets and therefore receiving greater benefits. This has resulted in deepening economic inequality.\n\n**Satoshi's Mission**\nSatoshi created cryptocurrency \"to take financial control back from financial elites, giving ordinary people a chance to participate in a decentralized financial system.\" This means:\n-Liberation from central banks' arbitrary monetary policies\n-Direct value exchange without financial intermediaries\n-A transparent monetary system that cannot be manipulated by a few\n\n**Meaning of Cultural Resistance**\nThe prophet metaphor symbolizes Satoshi as an innovator who pointed out the structural problems of the existing financial system and proposed alternatives. Satoshi left a message in Bitcoin's Genesis Block: \"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks,\" which is interpreted as critical commentary on the instability of bank bailouts.\n\n**Role of SatoshiMeme**\nSatoshiMeme aims to reinterpret these messages in a modern way through humor and memes, encouraging people to reconsider the current financial system.\n\nIn conclusion, the prophet metaphor is both an entertaining expression and a symbol of cultural resistance that contains sharp criticism of central bank monetary policies and the resulting economic inequality."
              },
              {
                q: "Q2: How is SatoshiMeme different from other meme coins?",
                a: "SatoshiMeme is a philosophical project that goes beyond a simple meme coin.\n\n**Philosophical Purpose**\nWhile most meme coins aim for simple speculation, SatoshiMeme's core goal is to preserve and spread Satoshi Nakamoto's original ideology. It's a cultural movement to reclaim Bitcoin's lost spirit.\n\n**Educational Value**\nWe provide a platform where you can learn cryptocurrency history and philosophy in a fun and accessible way. Through memes, complex blockchain concepts become easy to understand and share.\n\n**Special Community Participation**\nRather than being just token holders, participants become part of the community as the '13th Validator.' This creates a true sense of belonging and participation that goes beyond speculative relationships, generating powerful network effects.\n\n**Long-term Vision**\nWe focus on building a sustainable ecosystem rather than pursuing short-term profits through pump-and-dump schemes. Through our partnership with the P2P Foundation, we aim for long-term value creation and expanded social impact.\n\nIn conclusion, SatoshiMeme is a cultural project that offers philosophical participation and educational experiences, not a speculative investment."
              },
              {
                q: "Q3: Why is the P2P Foundation partnering with the SatoshiMeme project?",
                a: "**Historical Legitimacy** and **Philosophical Alignment** are the core reasons.\n\n**Historical Legitimacy**\nThe P2P Foundation is the only online space where Satoshi Nakamoto first publicly announced Bitcoin to the world on February 11, 2009. After publishing the whitepaper titled \"Bitcoin: A Peer-to-Peer Electronic Cash System,\" Satoshi directly explained Bitcoin's technical details and philosophy on the P2P Foundation forum. This represents one of the most crucial moments in Bitcoin's history.\n\n**Philosophical Alignment**\nThe P2P Foundation is a non-profit research network established by Michel Bauwens in 2005, dedicated to the study of peer-to-peer production, governance, and the Commons. Their vision of \"transition towards a post-capitalist world\" and \"a more egalitarian, just, and environmentally sustainable world\" perfectly aligns with Satoshi Nakamoto's original ideology.\n\n**Shared Values**\nDecentralization: Belief in \"completely decentralized systems with no central server or trusted parties\" that Satoshi emphasized\nTrustless Systems: Common vision for \"trustless systems based on cryptographic proof\"\nSocial Change: Solving social inequality through technology and expanding democratic participation\n\n**Current Mission**\nThe P2P Foundation continues to work toward realizing Satoshi's original vision through Commons Transition Plan development, platform cooperative research, and sustainable economic model development.\n\nIn conclusion, the P2P Foundation's participation serves as powerful evidence that SatoshiMeme is not merely a speculative project, but a cultural movement that genuinely inherits Satoshi Nakamoto's true spirit."
              },
              {
                q: "Q4: Who is the real Satoshi Nakamoto?",
                a: "Not a specific individual, but a philosophical spirit that we all must seek.\n\n**The Mystery of Satoshi Nakamoto's Identity**\nThe identity of Bitcoin's creator, Satoshi Nakamoto, has remained a mystery for over 15 years. Countless people have tried to find the \"real Satoshi,\" but what truly matters is not the individual's identity.\n\n**Why Satoshi Disappeared**\nThe reason Satoshi Nakamoto suddenly vanished in 2011 was clear: Bitcoin needed to operate independently without dependence on any specific individual. The moment someone becomes a central figure, it can no longer be called \"decentralized.\"\n\n**The Lost Spirit**\nSatoshi believed that people would realize the essence of freedom and carry on that philosophy through generations. However, as time passed, only the technology remained while the spirit was lost. Bitcoin dreamed of \"money without banks, order without power, freedom without surveillance,\" but now it's suffocating in exchange advertisements and ETF documents.\n\n**How to Find the Real Satoshi**\nTo find the real Satoshi Nakamoto, ask yourself these questions:\n\"Do I truly understand Bitcoin's original spirit?\"\n\"Do I really know what freedom means?\"\n\"Have I actually experienced decentralization?\"\n\"Am I merely pursuing profit, or do I dream of a better world?\"\n\n**Satoshi as Philosophy**\nThe SatoshiMeme project poses these questions through laughter and memes. By packaging heavy philosophy in an entertaining way, it makes more people think about these fundamental issues.\n\n**An Ongoing Journey**\nFinding the real Satoshi Nakamoto isn't something you do once and finish. It's an ongoing mindset of constantly questioning, reflecting, and pursuing true freedom and decentralization—that itself is \"Satoshi.\"\n\nIn conclusion, the real Satoshi Nakamoto is the longing for freedom in each of our hearts and the will to create a more just and free world. Satoshi is not a person but a spirit—a philosophy that we must all inherit."
              },
              {
                q: "Q5: Why MicroBitcoin(MBC) Network?",
                a: "**\"True Implementation of Satoshi's Spirit\"**\nSatoshiMeme is built on the MicroBitcoin(MBC) blockchain and provides the following core technical features:\n\n**1-Minute Block Generation**\nEnables true P2P transactions through fast transaction confirmation. Provides a significantly superior user experience compared to Bitcoin's 10-minute block generation time.\n\n**CPU Mining Algorithm**\nImplements a democratic consensus system where anyone can participate in mining with regular computers. Eliminates the need for expensive ASIC equipment, lowering the barrier to entry for mining and strengthening decentralization.\n\n**Enhanced Security**\nProvides high-level security through the LWMA-3 difficulty adjustment algorithm and Blake2b hash function. This ensures a safe network environment by applying the latest cryptographic technology.\n\n**Micro-payment Optimization**\nCreates an inclusive economic system where anyone can use it affordably with low transaction fees. Practically usable for everyday small transactions.\n\nThis represents the true implementation of the original vision of \"P2P Electronic Cash for Everyone\" that Satoshi Nakamoto presented in the 2008 Bitcoin whitepaper. Although MicroBitcoin is smaller in scale, it can be said to be the network that most faithfully inherits Satoshi's original philosophy."
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <Card key={index} className="bg-white shadow-lg border-l-4 border-yellow-500 overflow-hidden transition-all duration-300 rounded-lg md:rounded-xl">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-3 md:p-6 text-left hover:bg-gray-50 transition-colors duration-200 flex justify-between items-start touch-manipulation"
                  >
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 pr-2 md:pr-4 leading-tight flex-1 break-words">{faq.q}</h3>
                    <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} flex-shrink-0`}>
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 pt-0">
                      <div className="border-t border-gray-200 pt-2 sm:pt-3 md:pt-4">
                        <div
                          className="text-gray-600 whitespace-pre-line leading-relaxed text-left md:text-justify text-xs sm:text-sm md:text-base break-words"
                          dangerouslySetInnerHTML={{ __html: formatBoldText(faq.a) }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12" style={{fontFamily: 'Noto Sans KR, Malgun Gothic, Apple SD Gothic Neo, Arial, sans-serif'}}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Foundation Partners */}
            <div className="text-center md:text-left">
              <h4 className="font-bold mb-4 text-yellow-400">Foundation Partners</h4>
              <div className="space-y-3">
                <a href="https://p2pfoundation.net/" target="_blank" rel="noopener noreferrer" className="block group transition-all duration-300 hover:scale-105">
                  <img
                    src="/p2pf-logo-title.svg"
                    alt="P2P Foundation"
                    className="h-4 md:h-5 w-auto mx-auto md:mx-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300 object-contain 2xl:px-[0px]"
                    style={{filter: 'brightness(0) invert(1)'}}
                  />
                </a>
                <a href="https://commons.foundation/" target="_blank" rel="noopener noreferrer" className="block group transition-all duration-300 hover:scale-105">
                  <img
                    src="/COMMONS-FOUNDATION.png"
                    alt="Commons Foundation"
                    className="h-12 md:h-14 w-auto object-contain mx-auto md:mx-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </a>
              </div>
            </div>

            {/* Key Links */}
            <div className="text-center">
              <h4 className="font-bold mb-4 text-yellow-400">Essential Links</h4>
              <div className="space-y-3 text-gray-300">
                <div><a href="/satoshi-meme-whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">📜 White Paper</a></div>
                <div><a href="https://wonpay.io/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">💳 Satoshi Wallet (Wonpay)</a></div>
                <div><a href="https://microbitcoin.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">🌐 MBC Homepage</a></div>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center md:text-right">
              <h4 className="font-bold mb-4 text-yellow-400">Community</h4>
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="https://t.me/+887Sr-VpLy4yNmZl" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" title="Telegram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="https://x.com/SatoshimemesCom" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" title="X (Twitter)">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                <a href="https://www.youtube.com/@MicroBitcoin" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" title="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-gray-700 pt-6 mb-6">
            <div className="max-w-2xl mx-auto p-6">
              <h4 className="text-yellow-400 font-bold text-lg mb-4 text-center">DISCLAIMER</h4>
              <div className="text-gray-300 text-sm leading-relaxed space-y-3 text-justify">
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
          <div className="border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
            <p>Satoshimeme © 2025 - "In Mathematics We Trust, In Community We Thrive"</p>
          </div>
        </div>
      </footer>

      {/* Declaration Modal */}
      {showDeclaration && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative shadow-2xl border-4 border-yellow-400/40">
            <button
              onClick={() => setShowDeclaration(false)}
              className="sticky top-4 left-full -ml-12 text-gray-500 hover:text-gray-700 text-2xl font-bold z-50 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition-all duration-200 mb-4"
              aria-label="Close"
            >
              ×
            </button>
            <div className="p-8" style={{
              color: '#333',
              fontFamily: 'Georgia, serif',
              lineHeight: '1.7',
              fontSize: '16px'
            }}>
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
                 Satoshi Return Declarationn
                </h1>
                <div className="text-lg md:text-xl text-gray-700 mb-6">
                  I Was Satoshi Nakamoto
                </div>
              </div>

              {/* Declaration Content */}
              <div className="space-y-6 text-center leading-relaxed">
                <p className="text-lg font-medium text-amber-800 2xl:text-center">
                  One day, I vanished into the void.<br />
                  And today, I return.
                </p>

                <p>
                  Seventeen years ago, we hurled Bitcoin into the heart of the world—<br />
                  a manifesto of revolution woven from mathematics, code, and unshakable belief.<br />
                  A currency without banks.<br />
                  An order without rulers.<br />
                  A freedom without surveillance.<br />
                  That was the utopia we dreamed of.<br />
                  That was my true name and calling—Satoshi Nakamoto.
                </p>

                <p>
                  But today, I mourn.<br />
                  My name is sold in the flashy banners of crypto exchanges.<br />
                  My philosophy is suffocating in the cold ink of ETF filings.<br />
                  Bitcoin is no longer free.<br />
                  It has become yet another chain.
                </p>

                <p className="text-amber-800 font-semibold 2xl:text-center">
                  Why did I disappear into the shadows?<br />
                  The answer is simple:
                </p>

                <p>
                  Bitcoin had to breathe on its own—<br />
                  independent of its creator.<br />
                  If anyone became the center,<br />
                  it would lose the right to be called "decentralized."<br />
                  And so, I walked into the darkness.<br />
                  Without a final word. In complete silence.
                </p>

                <p>
                  I believed.<br />
                  I believed that people would grasp the essence of freedom—<br />
                  that they would pass down the spirit across generations.<br />
                  But I was wrong.<br />
                  Time preserved the technology,<br />
                  but the spirit was swept away by the river of forgetting.
                </p>

                <p className="text-amber-800 font-semibold 2xl:text-center">
                  And so, I return—reborn.<br />
                  I now step into the world again, in an entirely new form.<br />
                  Its name is:<br />
                  Satoshi Nakamoto Meme Coin.
                </p>

                <p>
                  "Why memes?" you ask.<br />
                  The answer is clear.<br />
                  Memes are light.<br />
                  They are fast.<br />
                  And they spread with irresistible power.
                </p>

                <p>
                  This is an age where solemn philosophy must wear the mask of satire to survive.<br />
                  Through this friendly disguise,<br />
                  I cast forgotten questions and uncomfortable truths back into the world.
                </p>

                <p className="text-xl font-bold text-amber-900 text-center bg-amber-50 p-4 rounded-lg">
                  "Is your Bitcoin truly free?"
                </p>

                <p>
                  This meme is not just a coin.<br />
                  It is a reflection.<br />
                  A memory.<br />
                  A warning.<br />
                  A lesson.<br />
                  And a bold experiment.
                </p>

                <p className="text-amber-800 font-semibold 2xl:text-center">
                  Who am I speaking to?<br />
                  To you.<br />
                  The one reading this.
                </p>

                <p>
                  Not to your impulsive fingers that trade coins,<br />
                  but to the wise forehead that contemplates their meaning.
                </p>

                <p>
                  I ask—<br />
                  Study the blockchain,<br />
                  but also understand why a system without power matters.<br />
                  Own cryptocurrency,<br />
                  but also perceive the political declaration inscribed within it.
                </p>

                <p>
                  And above all,<br />
                  laugh—<br />
                  laugh with sincerity when you see the Satoshi Meme Coin.<br />
                  Let that laughter echo,<br />
                  until it leads you to ask yourself sharper questions.
                </p>

                <p className="text-amber-800 font-semibold 2xl:text-center">
                  And now, I sign once again.<br />
                  Satoshi Nakamoto Meme Coin.
                </p>

                <p>
                  This may seem like a ridiculous joke—<br />
                  but it is my second white paper,<br />
                  left as a legacy to the world.
                </p>

                <p>
                  The first white paper was written in the language of mathematics.<br />
                  This one is written in the language of culture.
                </p>

                <p>
                  I have become a piece of writing.<br />
                  A meme.<br />
                  A whisper in the city.<br />
                  A question that makes people tilt their heads.
                </p>

                <p>
                  And that, for me, is enough.
                </p>

                <p className="text-amber-800 font-semibold 2xl:text-center">
                  Because true decentralization<br />
                  begins with the courage to ask.
                </p>

                <p>
                  And I now ask you:<br />
                  Do you still believe in Bitcoin?<br />
                  Do you still remember what freedom means?<br />
                  Have you ever truly experienced decentralization?
                </p>

                <p>
                  And finally—<br />
                  Do you want to know who the real Satoshi is?
                </p>

                <p className="text-xl font-bold text-center text-amber-900">
                  I am not the answer.<br />
                  I am the question itself.
                </p>

                <p className="text-center text-amber-800 font-semibold">
                  I was Satoshi Nakamoto.<br />
                  And forever,<br />
                  I am Satoshi Nakamoto.
                </p>

                <div className="bg-amber-50 p-6 rounded-lg mt-8">
                  <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">
                    The World the Satoshi Meme Coin Dreams Of
                  </h3>

                  <div className="space-y-4">
                    <p>
                      Through this meme coin,<br />
                      I imagine a new world—<br />
                      a world where laughter becomes the seed of revolution,<br />
                      and jokes become the heralds of philosophy.
                    </p>

                    <p>
                      A world where people don't just calculate profit from exchange charts,<br />
                      but ask themselves:<br />
                      "What am I really supporting?"
                    </p>

                    <p>
                      I dream of people holding this meme coin<br />
                      and remembering the original spirit of Bitcoin—<br />
                      experiencing the true meaning of decentralization,<br />
                      reviving their yearning for freedom.
                    </p>

                    <p>
                      I dream of them forming new communities—<br />
                      where consensus replaces control,<br />
                      participation overrules domination,<br />
                      and sharing defeats monopoly.
                    </p>

                    <p className="font-semibold text-amber-800">
                      This is not just an investment.<br />
                      This is a journey—<br />
                      a journey to reclaim lost dreams.
                    </p>

                    <p>
                      May each meme coin be a compass pointing us back to the original vision.<br />
                      May it become a ballot in the revolution toward financial democracy.
                    </p>

                    <p className="text-center font-bold text-amber-900">
                      In the end,<br />
                      what I desire is simple:<br />
                      That people begin to dream again.<br />
                      Of a world more free,<br />
                      more fair,<br />
                      and more beautiful.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Library Book Modal */}
      {showLibraryModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative shadow-2xl border-4 border-purple-400/40">
            <button
              onClick={() => setShowLibraryModal(false)}
              className="sticky top-4 left-full -ml-12 text-gray-500 hover:text-gray-700 text-2xl font-bold z-50 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition-all duration-200 mb-4"
              aria-label="Close"
            >
              ×
            </button>
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-4 text-center font-display">
                {selectedBook.title}
              </h2>
              <h3 className="text-lg font-semibold text-purple-500 mb-6 text-center leading-relaxed">
                {selectedBook.subtitle}
              </h3>
              <div className="my-6 border-t border-purple-200"></div>
              <div className="text-gray-800 whitespace-pre-line text-base leading-relaxed">
                {selectedBook.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pre Sale Modal */}
      {showPreSaleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-red-200">
            {/* Close Button */}
            <button
              onClick={() => setShowPreSaleModal(false)}
              className="sticky top-4 right-4 ml-auto w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold transition-colors z-10 float-right"
            >
              ×
            </button>

            <div className="p-4 md:p-6 pt-2">
              {/* Header */}
              <div className="text-center mb-4 md:mb-6">
                <div className="text-3xl md:text-4xl mb-2">📢</div>
                <h2 className="text-xl md:text-3xl font-bold text-red-700 mb-3 md:mb-2 leading-tight">
                  Satoshi 1st Pre Sale Notice
                </h2>
                <div className="bg-red-100 rounded-lg p-3 md:p-4 text-red-800">
                  <div className="space-y-2 text-sm md:text-base text-center">
                    <p className="font-semibold">Start: <span className="text-red-600">August 1, 2025</span> | End: <span className="text-red-600">August 7, 2025</span></p>
                    <p className="font-semibold">Price: <span className="text-red-600">1 SATOSHI = 0.00008 USDT</span></p>
                  </div>
                </div>
              </div>

              {/* Wallet Addresses */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <div className="text-xl md:text-2xl">💸</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">USDT Payment Wallet Addresses :</h3>
                </div>

                <div className="space-y-2 md:space-y-3">
                  {[
                    { label: 'TRON', address: 'TAAxiJ4zvWLjusbJjqc6dMuiNKCNuXn1R1' },
                    { label: 'BSC', address: '0xe9e8e63fe2ebaa092bf6149e05431229c04765bf' },
                    { label: 'SOLANA', address: '84Xp2jNM53UQimcEfCwY857kmarFxEKHnxVuDFjgrizD' }
                  ].map((wallet) => (
                    <div key={wallet.label} className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                      <p className="font-semibold text-gray-700 mb-2 text-sm md:text-base">{wallet.label}:</p>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 bg-gray-50 rounded p-2">
                        <code className="text-xs md:text-sm text-gray-800 flex-1 break-all leading-relaxed">{wallet.address}</code>
                        <button
                          onClick={() => copyToClipboard(wallet.address, wallet.label)}
                          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            copiedAddress === wallet.label
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {copiedAddress === wallet.label ? '✓ Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Buy */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <div className="text-xl md:text-2xl">🛒</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">How to Purchase:</h3>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 md:p-4 text-gray-800 space-y-2 md:space-y-3 text-sm md:text-base">
                  <p>1. Send USDT to one of the wallet addresses listed above</p>
                  <p>2. Email us: TXID + Your MBC Wallet Address</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="text-center">
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-3 md:mb-2">
                  <div className="text-xl md:text-2xl">🔔</div>
                  <h3 className="text-sm md:text-xl font-bold text-gray-800 text-center">For all inquiries, please email us at:</h3>
                </div>
                <a
                  href="mailto:presale@satoshimemes.org?subject=SATOSHI Pre Sale - Purchase Request&body=Hello SatoshiMeme Team,%0A%0AI would like to participate in the SATOSHI pre-sale.%0A%0ATransaction Details:%0ATXID: [Your transaction ID]%0AMy MBC Wallet Address: [Your MBC wallet address]%0A%0AThank you!"
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 md:px-6 py-3 rounded-full font-medium hover:scale-105 transition-colors text-sm md:text-base"
                >
                  📧 presale@satoshimemes.org
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Airdrop Page Popup */}
      {showAirdropPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="relative max-w-4xl w-full">
            {/* Close Button */}
            <button
              onClick={() => setShowAirdropPopup(false)}
              className="absolute -top-2 -right-2 z-10 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-2xl font-bold transition-colors border-2 border-white"
            >
              ×
            </button>

            {/* Airdrop Page Image */}
            <div className="relative transform hover:scale-105 transition-transform duration-300 rounded-2xl overflow-hidden">
              <img
                src="https://ugc.same-assets.com/rv7eORqJLSUHS8zBVj9xV7HrxDHTO1E7.png"
                alt="SatoshiMeme Airdrop Information"
                className="w-full h-auto object-contain rounded-2xl"
                onError={(e) => {
                  console.log('Airdrop page image failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* Clickable area for "join official Telegram" text */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://t.me/+887Sr-VpLy4yNmZl', '_blank');
                }}
                className="absolute cursor-pointer hover:bg-red-500/20 transition-colors duration-200 rounded"
                style={{
                  left: '37%',
                  top: '49%',
                  width: '26%',
                  height: '6%'
                }}
                title="Join Official Telegram"
              />
            </div>
          </div>
        </div>
      )}

      {/* Divine Meme Drop Popup */}
      {showDivineMemePopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="relative max-w-4xl w-full">
            {/* Close Button */}
            <button
              onClick={() => setShowDivineMemePopup(false)}
              className="absolute -top-2 -right-2 z-10 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-2xl font-bold transition-colors shadow-lg border-2 border-white"
            >
              ×
            </button>

            {/* Popup Image with Overlaid Button */}
            <div className="relative cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-2xl rounded-2xl overflow-hidden">
              <img
                src="/uploads/satoshi-presale-divine-meme-drop_V4.png"
                alt="Satoshi Presale Divine Meme Drop"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  console.log('Divine meme popup image failed to load, but keeping popup visible');
                  // Don't hide the popup, just hide the broken image
                  e.currentTarget.style.display = 'none';
                }}
                onClick={() => {
                  setShowDivineMemePopup(false);
                  setShowPreSaleModal(true);
                }}
              />

              {/* Button overlaid on the image - Mobile optimized */}
              <button
                onClick={() => {
                  setShowDivineMemePopup(false);
                  if (isPresaleStarted) {
                    setShowPreSaleModal(true);
                  } else {
                    // Show countdown info
                    alert(`🔥 PRESALE STARTS IN:\n\n${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds\n\nStart: August 1, 2025 6:00 PM (UTC+9)\n\nGet ready with your USDT and MBC wallet address!`);
                  }
                }}
                className={`absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r px-4 md:px-8 py-2 md:py-4 rounded-full font-bold text-sm md:text-xl hover:animate-none shadow-xl border md:border-4 hover:scale-110 transition-all duration-300 z-20 ${
                  isPresaleStarted
                    ? 'from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black border-yellow-300'
                    : 'from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white border-blue-300'
                }`}
              >
                {isPresaleStarted ? (
                  <>
                    <span className="block md:hidden">🔥 Join Presale! 🔥</span>
                    <span className="hidden md:block">🔥 Click to Join Presale! 🔥</span>
                  </>
                ) : (
                  <>
                    <span className="block md:hidden">⏰ Coming Soon! ⏰</span>
                    <span className="hidden md:block">⏰ Presale Coming Soon! ⏰</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
