import imgMicFill from "figma:asset/9f223fb03616a308578eb5178d6781b7fd94e2f2.png";
import imgIcon from "figma:asset/62647808f10ebf68a7947c1425eb702c8879bef0.png";
import imgIcon1 from "figma:asset/ae965e62787fafbdf23e3ca16266dc5abbe26d15.png";
import imgIcon2 from "figma:asset/4b28c22130260db8ef2051029e0413bb8205dcc1.png";
import imgIcon3 from "figma:asset/a075c65005f61ac20272a88a6c079ed2a241e91b.png";
import imgTypeLogoutIsNumberNo from "figma:asset/00e9f137946dc53558dc8523a60a7a6c82eac180.png";
import imgTypeListIsNumberNo from "figma:asset/96b31322010c02c474738465d88e34a7ee17c68a.png";
import imgTypeSearchIsNumberNo from "figma:asset/d10fe8b676885edce26f5a1478f4293ee6f9479a.png";
import imgTypePauseIsNumberFill from "figma:asset/960e4a265181bede5f1179c0851659bb59a553d8.png";
import imgTypePauseIsNumberEmpty from "figma:asset/ae965e62787fafbdf23e3ca16266dc5abbe26d15.png";
import imgTypeBellIsNumberNo from "figma:asset/e86ada567ca901d2127f66aba5be8366214002ee.png";
import imgTypeHouseIsNumberNo from "figma:asset/ed8115473f0fada3eaba8cdbc7ede86918767f6d.png";
import imgTypeSettingIsNumberNo from "figma:asset/dc15176acd57dc195fbb3bc4f5df4e6672481115.png";
import imgTypeTasksIsNumberNo from "figma:asset/2c132d66a8ca3ec9c79da90abf0757a8d7a4c513.png";
import imgTypeFileIsNumberNo from "figma:asset/0ce1afd7d5081d0c7124e2ac84797cd7f91861d3.png";
import imgTypeChatIsNumberNo from "figma:asset/b402d2ae901b7ac6d0d59625e63665fb72e391a6.png";
import imgColor from "figma:asset/a84c7ca9095bc60df321579d3750c9a40dc9656e.png";
import imgTypeMicIsNumberOff from "figma:asset/62647808f10ebf68a7947c1425eb702c8879bef0.png";
import imgTypeEventIsNumberNo from "figma:asset/de7fb2a735ef086bf23addd974d5755ebeec190d.png";
import imgColor1 from "figma:asset/178efc590f7fd8cc2b96b846e29b95dc65a31f7b.png";
import svgPaths from "./svg-83idhqs2cy";
import { ImageWithFallback } from "../app/components/figma/ImageWithFallback";
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function PracticePage() {
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  return (
    <div className="relative size-full bg-black overflow-hidden font-['Share_Tech_Mono',monospace]" data-name="Practice Page">
      {/* Background - Server Room with overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1744868562210-fffb7fa882d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByb29tJTIwZGF0YSUyMGNlbnRlcnxlbnwxfHx8fDE3NzM0MDM1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Server Room"
          className="absolute w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#001a00] to-black opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.03),transparent_50%)]" />
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#0f0,#0f0_1px,transparent_1px,transparent_2px)]" />
      </div>

      {/* Animated scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-1 bg-gradient-to-b from-transparent via-[#00ff41] to-transparent opacity-20 animate-[scan_4s_linear_infinite]" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="bg-gradient-to-r from-black via-[#001a00] to-black border-b-2 border-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.3)]">
          <div className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00ff41] rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.5)]">
                <span className="text-black font-bold text-2xl font-mono">IT</span>
              </div>
              <div>
                <h1 className="text-[#00ff41] font-mono text-2xl font-bold tracking-wider drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]">
                  SPEECH.EXE
                </h1>
                <p className="text-[#00cc33] font-mono text-xs">v2.0.26 // BASEMENT EDITION</p>
              </div>
            </div>

            {/* Navigation - with horizontal scroll */}
            <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-[#00ff41] scrollbar-track-[#001a00] max-w-[600px]">
              <div className="flex items-center gap-2 w-max min-w-full">
                <NavButton icon={imgTypeHouseIsNumberNo} label="Welcome" onClick={() => navigate('/')} />
                <NavButton icon={imgTypeMicIsNumberOff} label="Practice" active />
                <NavButton icon={imgColor1} label="Statistics" onClick={() => navigate('/statistics')} />
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4 relative">
              <div className="relative">
                <img src={imgTypeBellIsNumberNo} alt="notifications" className="w-6 h-6 brightness-0 invert opacity-70" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff4400] rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-mono">3</span>
                </div>
              </div>
              
              {/* User Dropdown Button */}
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-[#001a00] border border-[#00ff41] rounded px-3 py-2 hover:bg-[#002200] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-[#00ff41] rounded-full flex items-center justify-center">
                  <span className="text-black font-mono font-bold">M</span>
                </div>
                <span className="text-[#00ff41] font-mono">Moss</span>
                <svg className={clsx("w-3 h-3 text-[#00ff41] transition-transform", userDropdownOpen && "rotate-180")} fill="currentColor" viewBox="0 0 12 6">
                  <path d={svgPaths.p3e42a480} />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-black border-2 border-[#00ff41] rounded shadow-[0_0_20px_rgba(0,255,65,0.3)] z-50 min-w-[200px]">
                  <div className="p-3 border-b border-[#00ff41]/30">
                    <p className="text-[#00ff41] font-mono text-sm font-bold">Moss</p>
                    <p className="text-[#00cc33] font-mono text-xs">IT Department</p>
                  </div>
                  <button 
                    onClick={() => {
                      setUserDropdownOpen(false);
                      // Handle logout
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#001a00] transition-colors text-left"
                  >
                    <img src={imgTypeLogoutIsNumberNo} alt="logout" className="w-4 h-4 brightness-0 invert opacity-70" />
                    <span className="text-[#00ff41] font-mono text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute top-24 left-0 right-0 bottom-0 overflow-auto">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          {/* Terminal-style Welcome Banner */}
          <div className="mb-6 bg-black border-2 border-[#00ff41] rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,65,0.2)] font-mono">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-[#00ff41]">{'>'}</span>
              <div className="flex-1">
                <p className="text-[#00ff41] leading-relaxed">
                  <span className="text-[#ff4400]">SYSTEM:</span> Welcome to Speech Practice Terminal
                </p>
                <p className="text-[#00cc33] text-sm mt-1">
                  // Did you try turning your pronunciation on and off again?
                </p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-6 bg-gradient-to-r from-[#001a00] to-black border-2 border-[#00ff41] rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,65,0.2)]">
            <label className="text-[#00ff41] font-mono text-sm mb-3 block">
              {'> '} ENTER TEXT TO PRACTICE:
            </label>
            <textarea 
              className="w-full bg-black border border-[#00cc33] rounded p-4 text-[#00ff41] font-mono min-h-[120px] focus:outline-none focus:border-[#00ff41] focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] resize-none"
              placeholder="Type your English text here... or freestyle like a true IT professional"
            />
            <div className="flex justify-end mt-4">
              <button className="bg-gradient-to-r from-[#ff4400] to-[#ff6600] text-white font-mono px-6 py-2 rounded border border-[#ff8800] hover:shadow-[0_0_15px_rgba(255,68,0,0.5)] transition-all">
                ⚡ AI_GENERATE.BAT
              </button>
            </div>
          </div>

          {/* Recording Section */}
          <div className="mb-6 grid grid-cols-3 gap-6">
            {/* Record Button */}
            <div className="bg-gradient-to-br from-[#001a00] to-black border-2 border-[#00ff41] rounded-lg p-6 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.2)]">
              <button className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff4400] to-[#ff0000] border-4 border-white shadow-[0_0_30px_rgba(255,68,0,0.6)] hover:scale-110 transition-transform flex items-center justify-center mb-4">
                <img src={imgMicFill} alt="Record" className="w-10 h-10 brightness-0 invert" />
              </button>
              <p className="text-[#00ff41] font-mono text-center">CLICK TO START</p>
              <p className="text-[#00cc33] font-mono text-xs mt-1">RECORDING.EXE</p>
            </div>

            {/* AI Evaluation */}
            <div className="bg-gradient-to-br from-[#001a00] to-black border-2 border-[#00ff41] rounded-lg p-6 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.2)]">
              <div className="mb-4">
                <div className="text-6xl mb-2">🤖</div>
              </div>
              <button className="bg-[#00ff41] text-black font-mono px-6 py-2 rounded border-2 border-[#00cc33] hover:shadow-[0_0_15px_rgba(0,255,65,0.5)] transition-all mb-2">
                AI EVALUATION
              </button>
              <button className="bg-black text-[#00ff41] font-mono px-6 py-2 rounded border border-[#00ff41] hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all">
                SUBMIT RECORDING
              </button>
            </div>

            {/* Processing Status */}
            <div className="bg-gradient-to-br from-[#001a00] to-black border-2 border-[#00ff41] rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,65,0.2)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00ff41] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold font-mono">A</span>
                </div>
                <div className="flex-1">
                  <p className="text-[#00ff41] font-mono text-sm font-bold">WASM EDGE PROC</p>
                  <p className="text-[#00cc33] font-mono text-xs">Status: IDLE</p>
                </div>
              </div>
              <div className="bg-black border border-[#00cc33] rounded p-3">
                <p className="text-[#00ff41] font-mono text-xs leading-relaxed">
                  Noise reduction &amp;<br />
                  silence trimming<br />
                  <span className="text-[#ff4400]">136,533 → 124,053</span><br />
                  samples (-9%)
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* AI Understanding */}
            <ResultCard title="AI RECOGNITION.LOG">
              <div className="mb-3">
                <div className="flex gap-4 text-xs font-mono mb-2">
                  <span className="text-[#00ff41]">■ Excellent</span>
                  <span className="text-[#ffcc00]">■ Good</span>
                  <span className="text-[#ff4400]">■ Poor</span>
                </div>
                <div className="h-px bg-[#00ff41] opacity-30 mb-3" />
              </div>
              <p className="text-[#00cc33] font-mono text-xs mb-2">AI understood:</p>
              <p className="font-mono text-sm leading-relaxed">
                <span className="text-[#00ff41]">Hello </span>
                <span className="text-[#ff4400]">world</span>
                <span className="text-[#00ff41]">, this is </span>
                <span className="text-[#ffcc00]">a</span>
                <span className="text-[#00ff41]"> test. My name is James </span>
                <span className="text-[#ffcc00]">Bond</span>
                <span className="text-[#00ff41]">. Hello, </span>
                <span className="text-[#ffcc00]">everyone</span>
                <span className="text-[#00ff41]">.</span>
              </p>
            </ResultCard>

            {/* Azure Scoring */}
            <ResultCard title="AZURE_SCORE.DAT">
              <div className="space-y-2 font-mono text-sm">
                <div>
                  <p className="text-[#00cc33] text-xs mb-1">Pronunciation Accuracy:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-black border border-[#00ff41] rounded-full h-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#00ff41] to-[#00cc33] h-full" style={{width: '89%'}} />
                    </div>
                    <span className="text-[#00ff41] font-bold">89%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[#00cc33] text-xs mb-1">Fluency:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-black border border-[#00ff41] rounded-full h-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#00ff41] to-[#00cc33] h-full" style={{width: '92%'}} />
                    </div>
                    <span className="text-[#00ff41] font-bold">92%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[#00cc33] text-xs mb-1">Completeness:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-black border border-[#00ff41] rounded-full h-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#00ff41] to-[#00cc33] h-full" style={{width: '95%'}} />
                    </div>
                    <span className="text-[#00ff41] font-bold">95%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#00ff41] opacity-30 mt-3" />
                <p className="text-[#00cc33] text-xs leading-relaxed">
                  <span className="text-[#ff4400]">REVIEW:</span> Fantastic job! Keep up the amazing work!
                </p>
              </div>
            </ResultCard>

            {/* Deep Analysis */}
            <ResultCard title="DEEP_ANALYSIS.EXE">
              <button className="w-full bg-gradient-to-r from-[#ff4400] to-[#ff6600] text-white font-mono px-4 py-3 rounded border border-[#ff8800] hover:shadow-[0_0_15px_rgba(255,68,0,0.5)] transition-all mb-4">
                🔍 GENERATE REPORT
              </button>
              <div className="bg-black border border-[#00cc33] rounded p-3">
                <p className="text-[#00cc33] font-mono text-xs leading-relaxed mb-2">
                  {'> '} Analysis includes:
                </p>
                <ul className="text-[#00ff41] font-mono text-xs space-y-1">
                  <li>• Intonation patterns</li>
                  <li>• Word linking</li>
                  <li>• Rhythm analysis</li>
                  <li>• Stress timing</li>
                  <li>• Phoneme breakdown</li>
                </ul>
              </div>
              <div className="mt-3 text-center">
                <p className="text-[#ff4400] font-mono text-xs animate-pulse">
                  ▶ READY TO PROCESS
                </p>
              </div>
            </ResultCard>
          </div>

          {/* IT Crowd Easter Eggs Footer */}
          <div className="mt-8 mb-4">
            <div className="bg-black/90 border-2 border-[#00ff41] rounded-lg p-4 text-center shadow-[0_0_30px_rgba(0,255,65,0.2)]">
              <p className="text-[#00cc33] font-mono text-sm mb-2">
                "Hello, IT. Have you tried turning your accent off and on again?" - Roy (probably)
              </p>
              <div className="flex justify-center gap-6 mt-3 text-xs">
                <button 
                  onClick={() => navigate('/history')}
                  className="text-[#00ff41] hover:text-white transition-colors border border-[#00ff41] px-4 py-1 rounded hover:bg-[#00ff41] hover:text-black"
                >
                  📊 VIEW HISTORY.LOG
                </button>
                <span className="text-[#00cc33] opacity-70">|</span>
                <span className="text-[#ff4400]">Emergency Number: 0118 999 881 999 119 725 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface NavButtonProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavButton({ icon, label, active = false, onClick }: NavButtonProps) {
  return (
    <button 
      className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-sm border transition-all ${
        active 
          ? 'bg-[#00ff41] text-black border-[#00cc33] shadow-[0_0_10px_rgba(0,255,65,0.5)]' 
          : 'bg-black text-[#00ff41] border-[#00ff41] hover:bg-[#001a00]'
      }`}
      onClick={onClick}
    >
      <img src={icon} alt={label} className={`w-4 h-4 ${active ? '' : 'brightness-0 invert opacity-70'}`} />
      <span>{label}</span>
    </button>
  );
}

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
}

function ResultCard({ title, children }: ResultCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#001a00] to-black border-2 border-[#00ff41] rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,65,0.2)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse" />
        <h3 className="text-[#00ff41] font-mono text-sm font-bold">{title}</h3>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-30 mb-4" />
      {children}
    </div>
  );
}