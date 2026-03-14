import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { clsx } from 'clsx';
import { Bell, LogOut } from 'lucide-react';
import svgPaths from "../imports/svg-ubr093inv5";
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { fetchHistory, type HistoryEntry } from './utils/historyApi';

/**
 * Phoneme data structure for UK pronunciation
 * p: Phoneme symbol in IPA format
 * w: Example word containing the phoneme
 * s: Practice status (none/excellent/good/poor)
 * ex: Example word for display
 */
const PHONEMES_UK = [
  { p: '/iː/', w: 'see', s: 'none', ex: 'see' },
  { p: '/ɪ/', w: 'sit', s: 'none', ex: 'sit' },
  { p: '/e/', w: 'bed', s: 'none', ex: 'bed' },
  { p: '/æ/', w: 'cat', s: 'none', ex: 'cat' },
  { p: '/ɑː/', w: 'father', s: 'none', ex: 'father' },
  { p: '/ɒ/', w: 'dog', s: 'none', ex: 'dog' },
  { p: '/ɔː/', w: 'saw', s: 'none', ex: 'saw' },
  { p: '/ʊ/', w: 'put', s: 'none', ex: 'put' },
  { p: '/uː/', w: 'too', s: 'none', ex: 'too' },
  { p: '/ʌ/', w: 'cut', s: 'none', ex: 'cut' },
  { p: '/ɜː/', w: 'bird', s: 'none', ex: 'bird' },
  { p: '/ə/', w: 'about', s: 'none', ex: 'about' },
  { p: '/eɪ/', w: 'say', s: 'none', ex: 'say' },
  { p: '/aɪ/', w: 'my', s: 'none', ex: 'my' },
  { p: '/ɔɪ/', w: 'boy', s: 'none', ex: 'boy' },
  { p: '/aʊ/', w: 'how', s: 'none', ex: 'how' },
  { p: '/əʊ/', w: 'no', s: 'none', ex: 'no' },
  { p: '/ɪə/', w: 'near', s: 'none', ex: 'near' },
  { p: '/eə/', w: 'hair', s: 'none', ex: 'hair' },
  { p: '/ʊə/', w: 'tour', s: 'none', ex: 'tour' },
  { p: '/p/', w: 'pen', s: 'none', ex: 'pen' },
  { p: '/b/', w: 'boy', s: 'none', ex: 'boy' },
  { p: '/t/', w: 'tea', s: 'none', ex: 'tea' },
  { p: '/d/', w: 'day', s: 'none', ex: 'day' },
  { p: '/k/', w: 'cat', s: 'none', ex: 'cat' },
  { p: '/g/', w: 'go', s: 'none', ex: 'go' },
  { p: '/f/', w: 'five', s: 'none', ex: 'five' },
  { p: '/v/', w: 'van', s: 'none', ex: 'van' },
  { p: '/θ/', w: 'thin', s: 'none', ex: 'thin' },
  { p: '/ð/', w: 'this', s: 'none', ex: 'this' },
  { p: '/s/', w: 'see', s: 'none', ex: 'see' },
  { p: '/z/', w: 'zoo', s: 'none', ex: 'zoo' },
  { p: '/ʃ/', w: 'she', s: 'none', ex: 'she' },
  { p: '/ʒ/', w: 'vision', s: 'none', ex: 'vision' },
  { p: '/tʃ/', w: 'chin', s: 'none', ex: 'chin' },
  { p: '/dʒ/', w: 'jump', s: 'none', ex: 'jump' },
// 👇 在这里追加缺失的 8 个辅音，凑齐 24 个辅音
  { p: '/m/', w: 'man', s: 'none', ex: 'man' },
  { p: '/n/', w: 'now', s: 'none', ex: 'now' },
  { p: '/ŋ/', w: 'sing', s: 'none', ex: 'sing' },
  { p: '/l/', w: 'leg', s: 'none', ex: 'leg' },
  { p: '/r/', w: 'red', s: 'none', ex: 'red' },
  { p: '/j/', w: 'yes', s: 'none', ex: 'yes' },
  { p: '/w/', w: 'wet', s: 'none', ex: 'wet' },
  { p: '/h/', w: 'hat', s: 'none', ex: 'hat' },
];

/**
 * Phoneme data structure for US pronunciation
 * p: Phoneme symbol in IPA format
 * w: Example word containing the phoneme
 * s: Practice status (none/excellent/good/poor)
 * ex: Example word for display
 */
const PHONEMES_US = PHONEMES_UK.map((p) => ({
  ...p,
  s: 'none',
}));

type PhonemeState = 'none' | 'excellent' | 'good' | 'poor';

const MAX_RED_PHONEMES = 5;
const MAX_YELLOW_PHONEMES = 8;
const RECENT_WINDOW = 5;
const RECENT_MIN_SAMPLES_FOR_RECOVERY = 3;
const RECENT_RECOVERY_SCORE = 80;
const MIN_VALID_SCORE = 1;

const getRepresentativeScore = (historyScores: number[], recentScores: number[]): number | undefined => {
  if (historyScores.length === 0 && recentScores.length === 0) {
    return undefined;
  }

  let robustHistoryWorst: number | undefined;
  if (historyScores.length > 0) {
    const sortedHistory = [...historyScores].sort((a, b) => a - b);
    const outlierDrop = sortedHistory.length >= 8 ? 2 : sortedHistory.length >= 5 ? 1 : 0;
    robustHistoryWorst = sortedHistory[Math.min(outlierDrop, sortedHistory.length - 1)];
  }

  let recentWorstAverage: number | undefined;
  if (recentScores.length > 0) {
    const sortedRecent = [...recentScores].sort((a, b) => a - b);
    const worstSamples = sortedRecent.slice(0, Math.min(2, sortedRecent.length));
    recentWorstAverage = worstSamples.reduce((sum, score) => sum + score, 0) / worstSamples.length;
  }

  if (recentWorstAverage === undefined) return robustHistoryWorst;
  if (robustHistoryWorst === undefined) return recentWorstAverage;

  if (recentScores.length >= RECENT_MIN_SAMPLES_FOR_RECOVERY) {
    // Recent repeated data should dominate to avoid permanent historical poisoning.
    return recentWorstAverage;
  }

  return Math.min(robustHistoryWorst, recentWorstAverage);
};

const scoreToState = (score: number): PhonemeState => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  return 'poor';
};

const normalizePhoneme = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z]/g, ''); // 极度暴力：非 a-z 的英文字母全部删掉！
};

const PHONEME_ALIASES: Record<string, string[]> = {
  // === Vowels (ARPAbet 元音) ===
  '/iː/': ['iy', 'i'],       // see
  '/ɪ/': ['ih'],             // sit
  '/e/': ['eh'],             // bed
  '/æ/': ['ae'],             // cat
  '/ɑː/': ['aa'],            // father
  '/ɒ/': ['aa', 'ao', 'ah'], // dog (美音常发 aa 或 ao)
  '/ɔː/': ['ao'],            // saw
  '/ʊ/': ['uh'],             // put
  '/uː/': ['uw'],            // too
  
  '/ʌ/': ['ah'],             // cut (终于不用管那个该死的 \u028c 了！)
  '/ɜː/': ['er'],            // bird
  '/ə/':  ['ax', 'ah'],      // about (SAPI 里弱读元音是 ax)
  
  '/eɪ/': ['ey'],            // say
  '/aɪ/': ['ay'],            // my
  '/ɔɪ/': ['oy'],            // boy
  '/aʊ/': ['aw'],            // how
  '/əʊ/': ['ow'],            // no
  
  // 英音的集中双元音，美音 SAPI 通常拆分成 元音 + r
  '/ɪə/': ['ih', 'ir'],      // near
  '/eə/': ['eh', 'er'],      // hair
  '/ʊə/': ['uh', 'ur'],      // tour

  // === Consonants (ARPAbet 辅音) ===
  '/p/': ['p'],
  '/b/': ['b'],
  '/t/': ['t'], 
  '/d/': ['d'],
  '/k/': ['k'],
  '/g/': ['g'],              // 绝不会再出现奇怪的 ɡ 编码
  '/f/': ['f'],
  '/v/': ['v'],
  '/θ/': ['th'],             // thin
  '/ð/': ['dh'],             // this
  '/s/': ['s'],
  '/z/': ['z'],
  '/ʃ/': ['sh'],             // she
  '/ʒ/': ['zh'],             // vision
  '/tʃ/': ['ch'],            // chin
  '/dʒ/': ['jh'],            // jump
  '/m/': ['m'],
  '/n/': ['n'],
  '/ŋ/': ['ng'],             // sing
  '/l/': ['l'],
  '/r/': ['r'], 
  '/j/': ['y'],              // yes (ARPAbet 中用 y)
  '/w/': ['w'],
  '/h/': ['hh']              // 🌟 注意：SAPI 里 h 的代码是 hh
};

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
        // 把 min-h-[60px] 换成了 w-[75px] h-[75px]，并加上 p-0 去除可能的内边距干扰
        "retro-key rounded border-2 text-center font-['Share_Tech_Mono',monospace] transition-all cursor-pointer w-[75px] h-[75px] p-0 flex flex-col items-center justify-center relative",
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
// 改为数组类型，支持多选
  const [selectedPhonemes, setSelectedPhonemes] = useState<string[]>(['/θ/']);  
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [generatedSentence, setGeneratedSentence] = useState('');
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
// 👇 新增：用于独立保存两个固定随机句子的状态
  const [autoSentence1, setAutoSentence1] = useState('');
  const [autoSentence2, setAutoSentence2] = useState('');

// 👇 新增：在页面初次加载时，随机生成一次句子并永久固定
  useEffect(() => {
    // 从数据源中随机抽取音标
    const getRandomPhoneme = () => PHONEMES_UK[Math.floor(Math.random() * PHONEMES_UK.length)];
    
    // 给第一个句子随机抽一个词
    const p1 = getRandomPhoneme();
    
    // 给第二个句子随机抽 1~3 个不重复的音标
    const randomCount = Math.floor(Math.random() * 3) + 1;
    const randomPhonemes = [];
    for (let i = 0; i < randomCount; i++) {
      randomPhonemes.push(getRandomPhoneme().p);
    }
    const uniqueRandomPhonemes = Array.from(new Set(randomPhonemes));

    // 设置并固定句子内容
    setAutoSentence1(`The ${p1.w} sound in "${p1.ex}" needs more practice in the basement.`);
    setAutoSentence2(`Roy says: "Focus on ${uniqueRandomPhonemes.join(', ')}!"`);
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchHistory();
        setHistoryEntries(history);
      } catch {
        setHistoryEntries([]);
      }
    };

    loadHistory();
  }, []);

  const phonemeStates = useMemo(() => {
    const sortedHistory = [...historyEntries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const recentHistory = sortedHistory.slice(0, RECENT_WINDOW);

    const scoreSamplesMap = new Map<string, number[]>();
    const weakCountMap = new Map<string, number>();
    const recentScoreSamplesMap = new Map<string, number[]>();
    const recentWeakCountMap = new Map<string, number>();

    sortedHistory.forEach((entry) => {
      Object.entries(entry.phonemeScores || {}).forEach(([phoneme, score]) => {
        const normalized = normalizePhoneme(phoneme);
        if (!normalized) return;

        const numericScore = Number(score);
        if (!Number.isFinite(numericScore)) return;

        if (numericScore < MIN_VALID_SCORE) return;

        const samples = scoreSamplesMap.get(normalized) || [];
        samples.push(numericScore);
        scoreSamplesMap.set(normalized, samples);
      });

      (entry.weakPhonemes || []).forEach((phoneme) => {
        const normalized = normalizePhoneme(phoneme);
        if (!normalized) return;
        weakCountMap.set(normalized, (weakCountMap.get(normalized) || 0) + 1);
      });
    });

    recentHistory.forEach((entry) => {
      Object.entries(entry.phonemeScores || {}).forEach(([phoneme, score]) => {
        const normalized = normalizePhoneme(phoneme);
        if (!normalized) return;

        const numericScore = Number(score);
        if (!Number.isFinite(numericScore)) return;

        if (numericScore < MIN_VALID_SCORE) return;

        const list = recentScoreSamplesMap.get(normalized) || [];
        list.push(numericScore);
        recentScoreSamplesMap.set(normalized, list);
      });

      (entry.weakPhonemes || []).forEach((phoneme) => {
        const normalized = normalizePhoneme(phoneme);
        if (!normalized) return;
        recentWeakCountMap.set(normalized, (recentWeakCountMap.get(normalized) || 0) + 1);
      });
    });

    const details = PHONEMES_UK.map((phoneme) => {
      const candidates = [
        normalizePhoneme(phoneme.p),
        ...(PHONEME_ALIASES[phoneme.p] || []).map((alias) => normalizePhoneme(alias)),
      ];

      const historyScores: number[] = [];
      let weakCount = 0;
      let recentWeakCount = 0;
      const recentScores: number[] = [];

      candidates.forEach((candidate) => {
        const samples = scoreSamplesMap.get(candidate) || [];
        historyScores.push(...samples);
        weakCount += weakCountMap.get(candidate) || 0;
        recentWeakCount += recentWeakCountMap.get(candidate) || 0;
        const recentSamples = recentScoreSamplesMap.get(candidate) || [];
        recentScores.push(...recentSamples);
      });

      const representativeScore = getRepresentativeScore(historyScores, recentScores);

      const recentAvgScore =
        recentScores.length > 0
          ? recentScores.reduce((sum, val) => sum + val, 0) / recentScores.length
          : undefined;

      let baseState: PhonemeState = 'none';
      if (representativeScore !== undefined) {
        baseState = scoreToState(representativeScore);
      } else if (weakCount > 0) {
        baseState = 'poor';
      }

      const recoveredRecently =
        baseState === 'poor' &&
        recentScores.length >= RECENT_MIN_SAMPLES_FOR_RECOVERY &&
        recentWeakCount === 0 &&
        (recentAvgScore ?? 0) >= RECENT_RECOVERY_SCORE;

      if (recoveredRecently) {
        // Recently stable performance: fade red to yellow-green.
        baseState = 'good';
      }

      return {
        symbol: phoneme.p,
        baseState,
        representativeScore,
        weakCount,
        recoveredRecently,
      };
    });

    const issueCandidates = details
      .filter((item) => item.baseState !== 'none' && item.baseState !== 'excellent')
      .sort((a, b) => {
        if (a.recoveredRecently !== b.recoveredRecently) {
          return a.recoveredRecently ? 1 : -1;
        }
        if (b.weakCount !== a.weakCount) return b.weakCount - a.weakCount;
        const aScore = a.representativeScore ?? 101;
        const bScore = b.representativeScore ?? 101;
        if (aScore !== bScore) return aScore - bScore;
        return a.symbol.localeCompare(b.symbol);
      });

    const redTop = new Set(issueCandidates.slice(0, MAX_RED_PHONEMES).map((item) => item.symbol));
    const yellowTop = new Set(
      issueCandidates
        .slice(MAX_RED_PHONEMES, MAX_RED_PHONEMES + MAX_YELLOW_PHONEMES)
        .map((item) => item.symbol)
    );

    const map = new Map<string, PhonemeState>();
    details.forEach((item) => {
      if (item.baseState === 'none' || item.baseState === 'excellent') {
        map.set(item.symbol, item.baseState);
        return;
      }

      if (redTop.has(item.symbol)) {
        map.set(item.symbol, 'poor');
        return;
      }

      if (yellowTop.has(item.symbol)) {
        map.set(item.symbol, 'good');
        return;
      }

      map.set(item.symbol, item.baseState === 'poor' ? 'good' : item.baseState);
    });
    return map;
  }, [historyEntries]);

const basePhonemes = region === 'UK' ? PHONEMES_UK : PHONEMES_US;
  const phonemes = basePhonemes.map((phoneme) => ({
    ...phoneme,
    s: phonemeStates.get(phoneme.p) || 'none',
  }));
  
  // 新增：多选切换函数 (如果已选中则移除，未选中则加入)
  const togglePhoneme = (p: string) => {
    setSelectedPhonemes(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  // 获取所有被选中的音标数据
  const selectedDataList = phonemes.filter(p => selectedPhonemes.includes(p.p));
  const primarySelected = selectedDataList[0]; // 用于在自动生成句子时作为主要参考

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
    if (selectedPhonemes.length === 0) return;
    const quote = itCrowdQuotes[Math.floor(Math.random() * itCrowdQuotes.length)];
    // 用逗号拼接所有选中的音标
    setGeneratedSentence(`Practice ${selectedPhonemes.join(', ')} with: "${quote}"`);
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
                  History Analysis
                </h1>
                <p className="text-[#d4cbb8] text-xs">Evaluate the last 3 months</p>
              </div>
            </div>

            {/* Navigation - Horizontally scrollable with custom scrollbar */}
            <div 
              className="flex-1 overflow-x-auto max-w-[500px]" 
              style={{ 
                overflowX: 'scroll',
                scrollbarWidth: 'thin', 
                scrollbarColor: '#6a5a4f #4a4a3a',
                WebkitOverflowScrolling: 'touch'
              }}
            >
<div className="flex items-center gap-2 pb-1">
              <RetroNavButton label="Welcome" onClick={() => navigate('/')} />
              <RetroNavButton label="Practice" onClick={() => navigate('/practice')} />
              <RetroNavButton label="Statistics" active />
              {/* 新增 History 跳转 */}
              <RetroNavButton label="History" onClick={() => navigate('/history')} />
            </div>            </div>

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
          {/* 外层加上 overflow-x-auto 允许横向滚动，并加上复古滚动条样式 */}
          <div 
            className="mb-4 retro-paper border-2 border-[#3a3a3a] rounded py-3 px-5 text-sm overflow-x-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#8a7a5f transparent' }}
          >
            {/* 增加 min-w-max 保证内容无论多长，内部容器都能被撑开，右侧不会留白截断 */}
            <div className="min-w-max pr-4">
              
              {/* Vowels Section */}
              <div className="mb-2">
                <h3 className="font-bold text-[#2a2a2a] mb-0.5 text-base uppercase tracking-wider">Vowels</h3>
                
                {/* 每一个 <p> 标签都加上了 whitespace-nowrap 强制不换行 */}
                <p className="text-[#4a4a4a] leading-relaxed whitespace-nowrap">
                  <span className="font-bold inline-block w-[75px]">UK IPA:</span> /iː/ /ɪ/ /e/ /æ/; /ʌ/ /ɜː/ /ə/; /ɑː/ /ɒ/ /ɔː/ /ʊ/ /uː/; /eɪ/ /ɔɪ/ /aɪ/; /aʊ/ /əʊ/; /ɪə/ /eə/ /ʊə/;
                </p>
                <p className="text-[#4a4a4a] leading-relaxed mt-0.5 whitespace-nowrap">
                  <span className="font-bold inline-block w-[75px]">US IPA:</span> /i/ /ɪ/ /ɛ/ /æ/; /ʌ/ /ɝ/ /ə/; /ɑ/ /ɑ/(/ɔ/) /ɔ/ /ʊ/ /u/; /eɪ/ /ɔɪ/ /aɪ/; /aʊ/ /oʊ/; /ɪr/ /ɛr/ /ʊr/;
                </p>
                <p className="text-[#4a4a4a] leading-relaxed mt-0.5 whitespace-nowrap">
                  <span className="font-bold inline-block w-[75px]">ARPAbet:</span> IY IH EH AE; AH ER AH(AH0); AA AA(AO) AO UH UW; EY OY AY; AW OW; IH_R EH_R UH_R;
                </p>
                <p className="text-[#4a4a4a] leading-relaxed mt-0.5 whitespace-nowrap">
                  <span className="font-bold inline-block w-[75px]">E.g.:</span> s<b className="text-[#1a1a1a] font-black">ee</b> s<b className="text-[#1a1a1a] font-black">i</b>t b<b className="text-[#1a1a1a] font-black">e</b>d c<b className="text-[#1a1a1a] font-black">a</b>t; c<b className="text-[#1a1a1a] font-black">u</b>t b<b className="text-[#1a1a1a] font-black">ir</b>d <b className="text-[#1a1a1a] font-black">a</b>bout; f<b className="text-[#1a1a1a] font-black">a</b>ther d<b className="text-[#1a1a1a] font-black">o</b>g s<b className="text-[#1a1a1a] font-black">aw</b> p<b className="text-[#1a1a1a] font-black">u</b>t t<b className="text-[#1a1a1a] font-black">oo</b>; s<b className="text-[#1a1a1a] font-black">ay</b> b<b className="text-[#1a1a1a] font-black">oy</b> m<b className="text-[#1a1a1a] font-black">y</b>; h<b className="text-[#1a1a1a] font-black">ow</b> n<b className="text-[#1a1a1a] font-black">o</b>; n<b className="text-[#1a1a1a] font-black">ear</b> h<b className="text-[#1a1a1a] font-black">air</b> t<b className="text-[#1a1a1a] font-black">our</b>;
                </p>
              </div>
              
              {/* Consonants Section */}
              <div>
                <h3 className="font-bold text-[#2a2a2a] mb-0.5 text-base uppercase tracking-wider">Consonants</h3>
                
                {/* 同样加上 whitespace-nowrap */}
                <p className="text-[#4a4a4a] leading-relaxed whitespace-nowrap">
                  <span className="font-bold inline-block w-[110px]">UK/US IPA:</span> /p/ /b/, /t/ /d/, /k/ /g/; /f/ /v/, /θ/ /ð/, /s/ /z/, /ʃ/ /ʒ/; /tʃ/ /dʒ/; /m/ /n/ /ŋ/; /l/ /r//ɹ/ /j/ /w/; /h/;
                </p>
                <p className="text-[#4a4a4a] leading-relaxed mt-0.5 whitespace-nowrap">
                  <span className="font-bold inline-block w-[110px]">ARPAbet:</span> P B, T D, K G; F V, TH DH, S Z, SH ZH; CH JH; M N NX(NG); L R Y W; HH;
                </p>
                <p className="text-[#4a4a4a] leading-relaxed mt-0.5 whitespace-nowrap">
                  <span className="font-bold inline-block w-[110px]">E.g.:</span> <b className="text-[#1a1a1a] font-black">p</b>en <b className="text-[#1a1a1a] font-black">b</b>oy, <b className="text-[#1a1a1a] font-black">t</b>ea <b className="text-[#1a1a1a] font-black">d</b>ay, <b className="text-[#1a1a1a] font-black">c</b>at <b className="text-[#1a1a1a] font-black">g</b>o; <b className="text-[#1a1a1a] font-black">f</b>ive <b className="text-[#1a1a1a] font-black">v</b>an, <b className="text-[#1a1a1a] font-black">s</b>ee <b className="text-[#1a1a1a] font-black">z</b>oo, <b className="text-[#1a1a1a] font-black">th</b>in <b className="text-[#1a1a1a] font-black">th</b>is, <b className="text-[#1a1a1a] font-black">sh</b>e vi<b className="text-[#1a1a1a] font-black">s</b>ion; <b className="text-[#1a1a1a] font-black">ch</b>in <b className="text-[#1a1a1a] font-black">j</b>ump; <b className="text-[#1a1a1a] font-black">m</b>an <b className="text-[#1a1a1a] font-black">n</b>o si<b className="text-[#1a1a1a] font-black">ng</b>; <b className="text-[#1a1a1a] font-black">l</b>eg <b className="text-[#1a1a1a] font-black">r</b>ed <b className="text-[#1a1a1a] font-black">y</b>es <b className="text-[#1a1a1a] font-black">w</b>e; <b className="text-[#1a1a1a] font-black">h</b>e;
                </p>
              </div>

            </div>
          </div>
          
                    {/* Periodic Table Grid */}
          <div className="grid grid-cols-[151px_1fr_455px] gap-3 mb-6 items-end">
            
{/* LEFT COLUMN - Legend */}
            <div className="flex flex-col gap-0.5">
              
              {/* Excellent */}
              <div className="grid grid-cols-2 gap-0.5">
                <div className="retro-key rounded border-2 border-[#3a6b4a] text-center font-['Share_Tech_Mono',monospace] w-[75px] h-[75px] p-0 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#7fdb9f] to-[#5fc77f]">
                  <span className="text-sm font-bold block text-[#2a2a2a]">Excellent</span>
                </div>
                <div className="bg-transparent"></div>
              </div>
              
              {/* Good + Poor */}
              <div className="grid grid-cols-2 gap-0.5">
                <div className="retro-key rounded border-2 border-[#6b5f3a] text-center font-['Share_Tech_Mono',monospace] w-[75px] h-[75px] p-0 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#f0e68c] to-[#dac86a]">
                  <span className="text-sm font-bold block text-[#2a2a2a]">Good</span>
                </div>
                <div className="retro-key rounded border-2 border-[#6b3a3a] text-center font-['Share_Tech_Mono',monospace] w-[75px] h-[75px] p-0 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#ea9999] to-[#d67676]">
                  <span className="text-sm font-bold block text-white">Poor</span>
                </div>
              </div>

              {/* UK IPA + US IPA Toggle */}
              <div className="grid grid-cols-2 gap-0.5">
                <button 
                  onClick={() => setRegion('UK')}
                  className={clsx(
                    "retro-key rounded border-2 text-center font-['Share_Tech_Mono',monospace] transition-all cursor-pointer w-[75px] h-[75px] p-0 flex flex-col items-center justify-center relative active:retro-key-pressed",
                    region === 'UK' 
                      ? "bg-gradient-to-br from-[#5a8a8a] to-[#4a7a7a] text-white border-[#2a4a4a]" 
                      : "bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]"
                  )}
                >
                  <span className="text-base font-bold block relative z-10">UK</span>
                  <span className="text-[9px] block mt-1 opacity-70 relative z-10">IPA</span>
                </button>
                <button 
                  onClick={() => setRegion('US')}
                  className={clsx(
                    "retro-key rounded border-2 text-center font-['Share_Tech_Mono',monospace] transition-all cursor-pointer w-[75px] h-[75px] p-0 flex flex-col items-center justify-center relative active:retro-key-pressed",
                    region === 'US' 
                      ? "bg-gradient-to-br from-[#7a9aca] to-[#6a8aba] text-white border-[#3a5a7a]" 
                      : "bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] text-[#2a2a2a] border-[#3a3a3a]"
                  )}
                >
                  <span className="text-base font-bold block relative z-10">US</span>
                  <span className="text-[9px] block mt-1 opacity-70 relative z-10">IPA</span>
                </button>
              </div>
            

{/* Functional Phoneme Grids (8 个双元音) */}
              <div className="grid grid-cols-2 gap-0.5 mt-0.5 flex-1">
                {/* 从 phonemes 中截取 10 个音标渲染，确保和右边具有相同的功能与形状 */}
                {phonemes.slice(12, 20).map((p, idx) => (
                  <PhonemeKey 
                    key={idx}
                    phoneme={p.p} 
                    word={p.w} 
                    state={p.s} 
isSelected={selectedPhonemes.includes(p.p)}
  onClick={() => togglePhoneme(p.p)}
                    />
                ))}
              </div>
                          </div>

            {/* MIDDLE COLUMN - CRT Analysis Report */}
            <div className="row-span-1 flex flex-col" >
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
{selectedPhonemes.length > 0 ? (
                      <div className="text-center space-y-2 w-full">
                        <div className="text-3xl crt-text font-bold mb-2 flex flex-wrap justify-center gap-2 max-h-[100px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                          {selectedPhonemes.map(p => <span key={p}>{p}</span>)}
                        </div>
                        <div className="space-y-1 text-[10px]">
                          {selectedPhonemes.length === 1 && primarySelected ? (
                            <>
                              <div className="flex items-center justify-center gap-2">
                                <span className="crt-text opacity-70">EXAMPLE:</span>
                                <span className="crt-text font-bold text-sm">{primarySelected.w}</span>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <span className="crt-text opacity-70">STATUS:</span>
                                <span className="crt-text font-bold text-sm">
                                  {primarySelected.s.toUpperCase()}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <span className="crt-text opacity-70">SELECTED:</span>
                              <span className="crt-text font-bold text-sm">{selectedPhonemes.length} SOUNDS</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#00aa00]/30">
                          <p className="crt-text opacity-60 text-[9px] italic">Input</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="crt-text text-lg mb-2">&gt; SELECT_PHONEME_</div>
                        <p className="crt-text opacity-50 text-[10px]">Click keys to multi-select</p>
                      </div>
                    )}
                                      </div>
                </div>
              </div>
            </div>

{/* RIGHT COLUMN - Phoneme Grid */}
            <div className="flex flex-col items-end gap-0.5">
              
{/* 完美统一外观的黄色 Good 方块 */}
              <div className="retro-key rounded border-2 border-[#6b5f3a] text-center font-['Share_Tech_Mono',monospace] w-[75px] h-[75px] p-0 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#f0e68c] to-[#dac86a]">
                <span className="text-sm font-bold block text-[#2a2a2a]">Good</span>
              </div>

{/* 原有的 6x6 网格：前 12 个是单元音，后 24 个是辅音 */}
              <div className="grid grid-cols-6 gap-0.5 content-start">
                {/* 使用扩展运算符拼接：前 12 个单元音 + 后 24 个辅音 */}
                {[...phonemes.slice(0, 12), ...phonemes.slice(20, 44)].map((p, idx) => (
                  <PhonemeKey 
                    key={idx} 
                    phoneme={p.p} 
                    word={p.w} 
                    state={p.s} 
isSelected={selectedPhonemes.includes(p.p)}
  onClick={() => togglePhoneme(p.p)}
                    />
                ))}
              </div>
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
              // 下面这行多加了一个 disabled:opacity-50 让它置灰时更明显
              className="retro-key bg-gradient-to-b from-[#e8e0cd] to-[#d4cbb8] border-2 border-[#3a3a3a] text-[#2a2a2a] px-6 py-2 rounded font-bold text-sm flex-1 disabled:opacity-50"
              disabled={selectedPhonemes.length === 0} // 👈 改成判断数组长度
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

{/* Auto-Generated Sentences (已与上方方块脱钩，固定显示) */}
          <div className="space-y-2">
            <div className="text-[#2a2a2a] font-bold text-sm mb-2">
              Auto-Generated Practice Sentences:
            </div>
            {/* 只有在随机句子生成完毕后才渲染 */}
            {autoSentence1 && autoSentence2 && (
              <>
                <SentenceRow 
                  label="Auto Sentence 1" 
                  text={autoSentence1}
                  onPractice={() => navigate('/practice')}
                />
                <SentenceRow 
                  label="Auto Sentence 2" 
                  text={autoSentence2}
                  onPractice={() => navigate('/practice')}
                />
              </>
            )}
          </div>
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