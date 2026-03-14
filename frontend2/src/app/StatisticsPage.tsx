import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { clsx } from 'clsx';
import { Bell, LogOut } from 'lucide-react';
import svgPaths from "../imports/svg-ubr093inv5";
import { ImageWithFallback } from './components/figma/ImageWithFallback';

/**
 * Phoneme data structure for UK pronunciation
 * p: Phoneme symbol in IPA format
 * w: Example word containing the phoneme
 * s: Practice status (none/excellent/good/poor)
 * ex: Example word for display
 */
const PHONEMES_UK = [
  { p: '/iː/', w: 'see', s: 'none', ex: 'see' },
  { p: '/ɪ/', w: 'sit', s: 'excellent', ex: 'sit' },
  { p: '/e/', w: 'bed', s: 'good', ex: 'bed' },
  { p: '/æ/', w: 'cat', s: 'poor', ex: 'cat' },
  { p: '/ɑː/', w: 'father', s: 'none', ex: 'father' },
  { p: '/ɒ/', w: 'dog', s: 'none', ex: 'dog' },
  { p: '/ɔː/', w: 'saw', s: 'none', ex: 'saw' },
  { p: '/ʊ/', w: 'put', s: 'none', ex: 'put' },
  { p: '/uː/', w: 'too', s: 'excellent', ex: 'too' },
  { p: '/ʌ/', w: 'cut', s: 'none', ex: 'cut' },
  { p: '/ɜː/', w: 'bird', s: 'none', ex: 'bird' },
  { p: '/ə/', w: 'about', s: 'none', ex: 'about' },
  { p: '/eɪ/', w: 'say', s: 'good', ex: 'say' },
  { p: '/aɪ/', w: 'my', s: 'none', ex: 'my' },
  { p: '/ɔɪ/', w: 'boy', s: 'poor', ex: 'boy' },
  { p: '/aʊ/', w: 'how', s: 'none', ex: 'how' },
  { p: '/əʊ/', w: 'no', s: 'none', ex: 'no' },
  { p: '/ɪə/', w: 'near', s: 'none', ex: 'near' },
  { p: '/eə/', w: 'hair', s: 'none', ex: 'hair' },
  { p: '/ʊə/', w: 'tour', s: 'none', ex: 'tour' },
  { p: '/p/', w: 'pen', s: 'good', ex: 'pen' },
  { p: '/b/', w: 'boy', s: 'none', ex: 'boy' },
  { p: '/t/', w: 'tea', s: 'none', ex: 'tea' },
  { p: '/d/', w: 'day', s: 'none', ex: 'day' },
  { p: '/k/', w: 'cat', s: 'none', ex: 'cat' },
  { p: '/g/', w: 'go', s: 'none', ex: 'go' },
  { p: '/f/', w: 'five', s: 'none', ex: 'five' },
  { p: '/v/', w: 'van', s: 'none', ex: 'van' },
  { p: '/θ/', w: 'thin', s: 'poor', ex: 'thin' },
  { p: '/ð/', w: 'this', s: 'poor', ex: 'this' },
  { p: '/s/', w: 'see', s: 'none', ex: 'see' },
  { p: '/z/', w: 'zoo', s: 'none', ex: 'zoo' },
  { p: '/ʃ/', w: 'she', s: 'none', ex: 'she' },
  { p: '/ʒ/', w: 'vision', s: 'none', ex: 'vision' },
  { p: '/tʃ/', w: 'chin', s: 'none', ex: 'chin' },
  { p: '/dʒ/', w: 'jump', s: 'none', ex: 'jump' },
];

/**
 * Phoneme data structure for US pronunciation
 * p: Phoneme symbol in IPA format
 * w: Example word containing the phoneme
 * s: Practice status (none/excellent/good/poor)
 * ex: Example word for display
 */
const PHONEMES_US = PHONEMES_UK.map((p, i) => ({ 
  ...p, 
  s: i % 5 === 0 ? 'excellent' : i % 3 === 0 ? 'good' : i % 7 === 0 ? 'poor' : 'none' 
}));

/**
 * PhonemeKey Component
 * 
 * Displays a single phoneme as a clickable keyboard-style button.
 * Features 3D press-down effect and color-coding by practice status.
 * 
 * Props:
 * @param phoneme - IPA phoneme symbol (e.g., "/iː/")
 * @param word - Example word containing the phoneme
 * @param state - Practice status: 'none' | 'excellent' | 'good' | 'poor'
 * @param isSelected - Whether this phoneme is currently selected
 * @param onClick - Callback when button is clicked
 */
interface PhonemeKeyProps {
  phoneme: string;
  word: string;
  state: 'none' | 'excellent' | 'good' | 'poor';
  isSelected: boolean;
  onClick: () => void;
}

const PhonemeKey = ({ phoneme, word, state, isSelected, onClick }: PhonemeKeyProps) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const colors: Record<string, string> = {
    none: "bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8]",
    excellent: "bg-gradient-to-b from-[#7fdb9f] to-[#5fc77f]",
    good: "bg-gradient-to-b from-[#f0e68c] to-[#dac86a]",
    poor: "bg-gradient-to-b from-[#ea9999] to-[#d67676]",
  };
  
  const borderColors: Record<string, string> = {
    none: "border-[#3a3a3a]",
    excellent: "border-[#3a6b4a]",
    good: "border-[#6b5f3a]",
    poor: "border-[#6b3a3a]",
  };

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    onClick();
  };

  return (
    <button 
      onClick={handleClick}
      className={clsx(
        "retro-key rounded border-2 text-center font-['Share_Tech_Mono',monospace] transition-all cursor-pointer min-h-[60px] flex flex-col items-center justify-center relative",
        colors[state], 
        borderColors[state],
        isSelected && "ring-4 ring-[#5a8a5a] ring-offset-2 ring-offset-[#d4c5a9] scale-105 z-10",
        isPressed && "retro-key-pressed"
      )}
      title={`${phoneme} - ${word}`}
    >
      <span className="text-base font-bold block text-[#2a2a2a]">{phoneme}</span>
      {word && <span className="text-[9px] block mt-1 text-[#4a4a4a]">{word}</span>}
    </button>
  );
};

export default function StatisticsPage() {
  const navigate = useNavigate();
  const [region, setRegion] = useState<'UK' | 'US'>('UK');
  const [selectedPhoneme, setSelectedPhoneme] = useState<string | null>('/θ/');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [generatedSentence, setGeneratedSentence] = useState('');

  const phonemes = region === 'UK' ? PHONEMES_UK : PHONEMES_US;
  const selectedData = phonemes.find(p => p.p === selectedPhoneme);

  const itCrowdQuotes = [
    "Have you tried turning it off and on again?",
    "I'm disabled! Leg disabled!",
    "I came here to drink milk and kick ass... and I've just finished my milk.",
    "People... what a bunch of bastards!",
    "Four! I mean five! I mean fire!",
    "Dear Sir/Madam, FIRE! FIRE! Looking forward to hearing from you.",
    "We don't need no education... Yes you do, you've just used a double negative.",
  ];

  const generateSentence = () => {
    if (!selectedPhoneme) return;
    const quote = itCrowdQuotes[Math.floor(Math.random() * itCrowdQuotes.length)];
    setGeneratedSentence(`Practice ${selectedPhoneme} with: "${quote}"`);
  };

  return (
    <div className="relative min-h-screen retro-beige-bg text-[#2a2a2a] font-['Share_Tech_Mono',monospace] overflow-hidden">
      
      {/* Background texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1765734482991-7c60829a0bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwb2ZmaWNlJTIwZGVzayUyMDE5ODBzfGVufDF8fHx8MTc3MzQ4MDQzNXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Office texture"
          className="absolute w-full h-full object-cover"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto">
        
        {/* Header */}
        <header className="bg-gradient-to-b from-[#8a7a5f] to-[#6a5a4f] border-b-4 border-[#3a3a3a] py-3 px-8 retro-shadow">
          <div className="flex items-center justify-between gap-8">
            {/* Reynholm Industries Logo & Title */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-[50px] h-[50px] border-3 border-[#3a3a3a] rounded-full bg-gradient-to-b from-[#f5f3e8] to-[#d4cbb8] flex items-center justify-center retro-shadow">
                  <span className="text-[#3a3a3a] font-bold text-2xl">R</span>
                </div>
                <span className="text-[10px] text-[#f5f3e8] font-bold mt-0.5">INDUSTRIES</span>
              </div>
              <div>
                <h1 className="text-[#f5f3e8] font-bold text-xl tracking-wide">
                  Personal History Practice Analysis
                </h1>
                <p className="text-[#d4cbb8] text-xs">Reynholm Industries IT Department</p>
              </div>
            </div>

            {/* Navigation - Horizontally scrollable with custom scrollbar */}
            <div 
              className="flex-1 overflow-x-auto max-w-[500px]" 
              style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#6a5a4f #4a4a3a',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="flex items-center gap-2 pb-1">
                <RetroNavButton label="Welcome" onClick={() => navigate('/')} />
                <RetroNavButton label="Practice" onClick={() => navigate('/practice')} />
                <RetroNavButton label="Statistics" active />
              </div>
            </div>

            {/* User Menu & Notification */}
            <div className="flex items-center gap-3 relative">
              <div className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded p-2 relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#d67676] border border-[#3a3a3a] rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">1</span>
                </div>
              </div>
              
              {/* User Dropdown Button */}
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="retro-key flex items-center gap-2 bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] rounded px-3 py-2"
              >
                <span className="text-[#2a2a2a] font-bold">User menu</span>
                <svg className={clsx("w-3 h-3 text-[#2a2a2a] transition-transform", userDropdownOpen && "rotate-180")} fill="currentColor" viewBox="0 0 12 6">
                  <path d={svgPaths.p3e42a480} />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#f5f3e8] border-2 border-[#3a3a3a] rounded retro-shadow z-50 min-w-[180px]">
                  <div className="p-3 border-b border-[#3a3a3a]">
                    <p className="text-[#2a2a2a] font-bold text-sm">Maurice Moss</p>
                    <p className="text-[#6a6a6a] text-xs">IT Department</p>
                  </div>
                  <button 
                    onClick={() => {
                      setUserDropdownOpen(false);
                      // Handle logout
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#e8e0cd] transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-[#2a2a2a] text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-8 py-6">
          
          {/* Vowels & Consonants Info */}
          <div className="mb-4 retro-paper border-2 border-[#3a3a3a] rounded p-4 text-xs">
            <div className="mb-2">
              <h3 className="font-bold text-[#2a2a2a] mb-1 text-sm">Vowels</h3>
              <p className="text-[#4a4a4a] leading-relaxed">
                <span className="font-bold">UK IPA:</span> /iː/ /ɪ/ /e/ /æ/ /ɑː/ /ɒ/ /ɔː/ /ʊ/ /uː/ /ʌ/ /ɜː/ /ə/ /eɪ/ /aɪ/ /ɔɪ/ /aʊ/ /əʊ/ /ɪə/ /eə/ /ʊə/
              </p>
              <p className="text-[#4a4a4a] leading-relaxed mt-0.5">
                <span className="font-bold">ARPAbet:</span> IY IH EH AE; AH AA AO UH UW; EY AY OY AW OW; E.g.: <span className="font-bold">see</span> sit bed cat; father dog saw put too; say my how no; near hair tour;
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#2a2a2a] mb-1 text-sm">Consonants</h3>
              <p className="text-[#4a4a4a] leading-relaxed">
                <span className="font-bold">UK IPA, US IPA:</span> /p/ /b/, /t/ /d/, /k/ /g/; /f/ /v/, /θ/ /ð/, /s/ /z/, /ʃ/ /ʒ/; /tʃ/ /dʒ/; /m/ /n/ /ŋ/; /l/ /r/ /j/ /w/; /h/;
              </p>
              <p className="text-[#4a4a4a] leading-relaxed mt-0.5">
                <span className="font-bold">E.g.:</span> <span className="font-bold">p</span>en <span className="font-bold">b</span>oy, <span className="font-bold">t</span>ea <span className="font-bold">d</span>ay, <span className="font-bold">c</span>at <span className="font-bold">g</span>o;
              </p>
            </div>
          </div>

          {/* Periodic Table Grid */}
          <div className="grid grid-cols-[151px_1fr_455px] gap-3 mb-6">
            
            {/* LEFT COLUMN - Legend */}
            <div className="space-y-0 flex flex-col">
              {/* Excellent */}
              <div className="h-[75px] retro-key bg-gradient-to-b from-[#7fdb9f] to-[#5fc77f] border-2 border-[#3a6b4a] flex items-center justify-center font-bold text-[#2a2a2a]">
                Excellent
              </div>
              
              {/* Good + Poor */}
              <div className="grid grid-cols-2 gap-0 h-[75px]">
                <div className="retro-key bg-gradient-to-b from-[#f0e68c] to-[#dac86a] border-2 border-[#6b5f3a] flex items-center justify-center font-bold text-sm text-[#2a2a2a]">
                  Good
                </div>
                <div className="retro-key bg-gradient-to-b from-[#ea9999] to-[#d67676] border-2 border-[#6b3a3a] flex items-center justify-center font-bold text-sm text-white">
                  Poor
                </div>
              </div>

              {/* UK IPA + US IPA Toggle */}
              <div className="grid grid-cols-2 gap-0 h-[75px]">
                <button 
                  onClick={() => setRegion('UK')}
                  className={clsx(
                    "retro-key border-2 flex flex-col items-center justify-center font-bold text-xs transition-all relative overflow-hidden",
                    region === 'UK' 
                      ? "bg-gradient-to-br from-[#5a8a8a] to-[#4a7a7a] text-white border-[#2a4a4a]" 
                      : "bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]"
                  )}
                >
                  <span className="relative z-10 text-[10px]">UK</span>
                  <span className="relative z-10">IPA</span>
                </button>
                <button 
                  onClick={() => setRegion('US')}
                  className={clsx(
                    "retro-key border-2 flex flex-col items-center justify-center font-bold text-xs transition-all relative overflow-hidden",
                    region === 'US' 
                      ? "bg-gradient-to-br from-[#7a9aca] to-[#6a8aba] text-white border-[#3a5a7a]" 
                      : "bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]"
                  )}
                >
                  <span className="relative z-10 text-[10px]">US</span>
                  <span className="relative z-10">IPA</span>
                </button>
              </div>

              {/* Sample Phonemes */}
              <div className="grid grid-cols-2 gap-0 h-[75px]">
                <PhonemeKey 
                  phoneme="/eɪ/" 
                  word="say" 
                  state="good" 
                  isSelected={selectedPhoneme === '/eɪ/'} 
                  onClick={() => setSelectedPhoneme('/eɪ/')} 
                />
                <div className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] flex items-center justify-center text-[#6a6a6a] text-[10px]">
                  No Record
                </div>
              </div>

              {/* More empty cells */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="grid grid-cols-2 gap-0 h-[75px]">
                  <div className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] flex items-center justify-center text-[#6a6a6a] text-xs">
                    ---
                  </div>
                  <div className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] flex items-center justify-center text-[#6a6a6a] text-xs">
                    ---
                  </div>
                </div>
              ))}
            </div>

            {/* MIDDLE COLUMN - CRT Analysis Report */}
            <div className="row-span-1 flex flex-col" style={{ marginTop: '228px' }}>
              <div className="crt-screen border-8 border-[#4a4a3a] rounded-lg overflow-hidden retro-shadow" style={{ height: '303px' }}>
                {/* CRT Monitor Frame */}
                <div className="h-full flex flex-col relative z-20">
                  {/* Header */}
                  <div className="border-b-2 border-[#00aa00] p-2 text-center">
                    <h2 className="crt-text text-base font-bold leading-tight">
                      Reynholm Industries Analysis Report
                    </h2>
                    <p className="crt-text opacity-70 text-[9px] mt-0.5">(Based on stats: Last 3 months)</p>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-3 flex items-center justify-center overflow-hidden">
                    {selectedPhoneme && selectedData ? (
                      <div className="text-center space-y-2">
                        <div className="text-5xl crt-text font-bold mb-2">
                          {selectedPhoneme}
                        </div>
                        <div className="space-y-1 text-[10px]">
                          <div className="flex items-center justify-center gap-2">
                            <span className="crt-text opacity-70">EXAMPLE:</span>
                            <span className="crt-text font-bold text-sm">{selectedData.w}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="crt-text opacity-70">STATUS:</span>
                            <span className="crt-text font-bold text-sm">
                              {selectedData.s.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#00aa00]/30">
                          <p className="crt-text opacity-60 text-[9px] italic">
                            Input
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="crt-text text-lg mb-2">
                          &gt; SELECT_PHONEME_
                        </div>
                        <p className="crt-text opacity-50 text-[10px]">
                          Click a key to view analysis
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Phoneme Grid */}
            <div className="grid grid-cols-6 gap-0.5 content-start">
              {phonemes.map((p, idx) => (
                <PhonemeKey 
                  key={idx} 
                  phoneme={p.p} 
                  word={p.w} 
                  state={p.s} 
                  isSelected={selectedPhoneme === p.p}
                  onClick={() => setSelectedPhoneme(p.p)}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => navigate('/practice')}
              className="retro-key bg-gradient-to-b from-[#7fdb9f] to-[#5fc77f] border-2 border-[#3a6b4a] text-[#2a2a2a] px-6 py-2 rounded font-bold text-sm"
            >
              Go Practice
            </button>
            <button 
              onClick={generateSentence}
              className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] text-[#2a2a2a] px-6 py-2 rounded font-bold text-sm flex-1"
              disabled={!selectedPhoneme}
            >
              Generate a sentence from your selected
            </button>
          </div>

          {/* Generated Sentence Display */}
          {generatedSentence && (
            <div className="retro-paper border-2 border-[#3a3a3a] p-3 rounded mb-4 font-mono text-sm text-[#2a2a2a]">
              <div className="flex items-start gap-2">
                <span className="text-[#5a8a5a]">&gt;</span>
                <span>{generatedSentence}</span>
              </div>
            </div>
          )}

          {/* Auto-Generated Sentences */}
          {selectedPhoneme && (
            <div className="space-y-2">
              <div className="text-[#2a2a2a] font-bold text-sm mb-2">
                Auto-Generated Practice Sentences:
              </div>
              <SentenceRow 
                label="Auto Sentence 1" 
                text={`The ${selectedData?.w} sound in "${selectedData?.ex}" needs more practice in the basement.`}
                onPractice={() => navigate('/practice')}
              />
              <SentenceRow 
                label="Auto Sentence 2" 
                text={`Roy says: "Focus on ${selectedPhoneme} - it's pronounced like ${selectedData?.w}!"`}
                onPractice={() => navigate('/practice')}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-b from-[#6a5a4f] to-[#5a4a3f] border-t-4 border-[#3a3a3a] py-3 px-8 text-center mt-6">
          <p className="text-[#d4cbb8] text-xs">
            Reynholm Industries • IT Department • Basement Level -1 • "We're not just here, we're also there!"
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface RetroNavButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function RetroNavButton({ label, active = false, onClick }: RetroNavButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    onClick?.();
  };

  return (
    <button 
      onClick={handleClick}
      className={clsx(
        "retro-key px-4 py-2 rounded border-2 font-bold text-sm transition-all flex-shrink-0",
        active 
          ? "bg-gradient-to-b from-[#5a8a5a] to-[#4a7a4a] text-white border-[#2a4a2a]" 
          : "bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]",
        isPressed && "retro-key-pressed"
      )}
    >
      {label}
    </button>
  );
}

interface SentenceRowProps {
  label: string;
  text: string;
  onPractice: () => void;
}

function SentenceRow({ label, text, onPractice }: SentenceRowProps) {
  return (
    <div className="flex items-center gap-3 retro-paper border-2 border-[#3a3a3a] rounded p-2">
      <div className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] px-3 py-2 text-xs min-w-[140px] text-center text-[#2a2a2a] font-bold">
        {label}
      </div>
      <div className="flex-1 text-sm text-[#4a4a4a]">
        {text}
      </div>
      <button 
        onClick={onPractice}
        className="retro-key bg-gradient-to-b from-[#7fdb9f] to-[#5fc77f] border-2 border-[#3a6b4a] text-[#2a2a2a] px-4 py-2 font-bold text-sm rounded"
      >
        Go Practice
      </button>
    </div>
  );
}