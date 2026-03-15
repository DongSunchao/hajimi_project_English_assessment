import clsx from "clsx";
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
import svgPaths from "./svg-ubr093inv5";
import imgHitoryPage from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";

function BackgroundImage5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div style={{ fontVariationSettings: "'wdth' 132" }} className="bg-clip-text bg-gradient-to-r flex flex-col font-['SF_Pro:Expanded_Light',sans-serif] font-[270.32501220703125] from-[#2e7dc3] from-[NaN%] justify-center leading-[0] relative shrink-0 text-[28px] text-[transparent] to-[#0c2c48] to-[NaN%] whitespace-nowrap">
      <p className="leading-[36px]">{children}</p>
    </div>
  );
}

function BackgroundImage4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex items-start relative size-full">
      <div className="flex flex-[1_0_0] flex-col font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] h-full justify-center leading-[0] min-h-px min-w-px relative text-[0px] text-[18px] text-black text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </div>
    </div>
  );
}
type BackgroundImage3Props = {
  additionalClassNames?: string;
};

function BackgroundImage3({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImage3Props>) {
  return (
    <div className={clsx("absolute size-[75px]", additionalClassNames)}>
      <div className="overflow-clip rounded-[inherit] size-full">{children}</div>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-[-1px] pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[10px] py-[5px] relative">{children}</div>
      </div>
    </div>
  );
}
type HitoryPageTextAutoHeightBackgroundImageProps = {
  additionalClassNames?: string;
};

function HitoryPageTextAutoHeightBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<HitoryPageTextAutoHeightBackgroundImageProps>) {
  return (
    <div className={clsx("absolute bg-[rgba(255,255,255,0.2)] left-0 w-[1440px]", additionalClassNames)}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start relative w-full">
          <div className="flex-[1_0_0] font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[0] min-h-px min-w-px relative text-[0px] text-[18px] text-black whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
type Frame21TextAutoHeightBackgroundImageProps = {
  additionalClassNames?: string;
};

function Frame21TextAutoHeightBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<Frame21TextAutoHeightBackgroundImageProps>) {
  return (
    <div className={clsx("absolute bg-white h-[37.5px] left-0 w-[151px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start py-[2px] relative size-full">
        <div className="flex flex-[1_0_0] flex-col font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] h-full justify-center leading-[0] min-h-px min-w-px relative text-[18px] text-black text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[26px] whitespace-pre-wrap">{children}</p>
        </div>
      </div>
    </div>
  );
}
type TextAutoHeightBackgroundImage1Props = {
  additionalClassNames?: string;
};

function TextAutoHeightBackgroundImage1({ additionalClassNames = "" }: TextAutoHeightBackgroundImage1Props) {
  return (
    <div className={clsx("absolute size-[75px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <BackgroundImageAndText text="Input text" />
    </div>
  );
}
type TextAutoHeightBackgroundImageProps = {
  additionalClassNames?: string;
};

function TextAutoHeightBackgroundImage({ additionalClassNames = "" }: TextAutoHeightBackgroundImageProps) {
  return (
    <div className={clsx("absolute bg-[#bcbcbc] size-[75px]", additionalClassNames)}>
      <div className="overflow-clip rounded-[inherit] size-full">
        <BackgroundImageAndText text="Input text" />
      </div>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
    </div>
  );
}
type BackgroundImage1Props = {
  text: string;
  text1: string;
  text2: string;
};

function BackgroundImage1({ text, text1, text2 }: BackgroundImage1Props) {
  return (
    <BackgroundImage4>
      <p className="leading-[26px] mb-0">{text}</p>
      <p>
        <span className="leading-[26px]">{text1}</span>
        <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {text2}
        </span>
      </p>
    </BackgroundImage4>
  );
}

function BackgroundImage() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <div className="absolute bg-gradient-to-l from-[#2e7dc3] inset-0 to-[#0c2c48]" />
      <img alt="" className="absolute max-w-none object-cover opacity-20 size-full" src={imgHitoryPage} />
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText({ text, additionalClassNames = "" }: BackgroundImageAndTextProps) {
  return (
    <div className={clsx("content-stretch flex items-start relative size-full", additionalClassNames)}>
      <div className="flex flex-[1_0_0] flex-col font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] h-full justify-center leading-[0] min-h-px min-w-px relative text-[18px] text-black text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[26px]">{text}</p>
      </div>
    </div>
  );
}
type TextAutoHeightBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextAutoHeightBackgroundImageAndText({ text, additionalClassNames = "" }: TextAutoHeightBackgroundImageAndTextProps) {
  return (
    <div className={clsx("absolute bg-white h-[37.5px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <BackgroundImageAndText text={text} additionalClassNames="py-[2px]" />
    </div>
  );
}
type ButtonIconTextHorizontalBackgroundImageAndTextProps = {
  text: string;
};

function ButtonIconTextHorizontalBackgroundImageAndText({ text }: ButtonIconTextHorizontalBackgroundImageAndTextProps) {
  return (
    <BackgroundImage2>
      <Icon className="relative shrink-0 size-[16px]" />
      <BackgroundImage5>{text}</BackgroundImage5>
    </BackgroundImage2>
  );
}
type IconProps = {
  className?: string;
  isNumber?: "Yes" | "No" | "off" | "Empty" | "Fill";
  type?: "Bell" | "Logout" | "Pause" | "Notification" | "House" | "Setting" | "Tasks" | "Event" | "Chat" | "Action" | "File" | "Statistics" | "List" | "Search" | "Mic";
};

function Icon({ className, isNumber = "No", type = "Logout" }: IconProps) {
  const isBellAndNo = type === "Bell" && isNumber === "No";
  const isChatAndNo = type === "Chat" && isNumber === "No";
  const isEventAndNo = type === "Event" && isNumber === "No";
  const isFileAndNo = type === "File" && isNumber === "No";
  const isHouseAndNo = type === "House" && isNumber === "No";
  const isListAndNo = type === "List" && isNumber === "No";
  const isMicAndOff = type === "Mic" && isNumber === "off";
  const isNoAndIsActionOrStatistics = isNumber === "No" && ["Action", "Statistics"].includes(type);
  const isNotificationAndYes = type === "Notification" && isNumber === "Yes";
  const isPauseAndEmpty = type === "Pause" && isNumber === "Empty";
  const isPauseAndFill = type === "Pause" && isNumber === "Fill";
  const isSearchAndNo = type === "Search" && isNumber === "No";
  const isSettingAndNo = type === "Setting" && isNumber === "No";
  const isStatistics = type === "Statistics";
  const isTasksAndNo = type === "Tasks" && isNumber === "No";
  return (
    <div className={className || `relative ${isMicAndOff ? "h-[22px] w-[16px]" : isNoAndIsActionOrStatistics ? "size-[24px]" : isChatAndNo ? "h-[19px] w-[18px]" : isFileAndNo ? "h-[19px] w-[20px]" : isNumber === "No" && ["Setting", "Tasks", "Event"].includes(type) ? "size-[20px]" : isHouseAndNo ? "h-[17.99px] w-[16px]" : isBellAndNo ? "h-[21px] w-[16px]" : isNotificationAndYes ? "bg-[#1e5eff] rounded-[999px] size-[16px]" : isPauseAndEmpty ? "h-[20px] w-[15.714px]" : isPauseAndFill ? "h-[20px] w-[16px]" : isSearchAndNo ? "size-[14.167px]" : isListAndNo ? "h-[10px] w-[16px]" : "size-[16px]"}`}>
      {((type === "Logout" && isNumber === "No") || isListAndNo || isSearchAndNo || isPauseAndFill || isPauseAndEmpty || isBellAndNo || isHouseAndNo || isSettingAndNo || isTasksAndNo || isFileAndNo || isChatAndNo || isMicAndOff || isEventAndNo) && <img alt="" className="absolute block max-w-none size-full" height={isMicAndOff ? "22" : isNumber === "No" && ["File", "Chat"].includes(type) ? "19" : isHouseAndNo ? "17.99" : isBellAndNo ? "21" : isPauseAndFill || isPauseAndEmpty || isSettingAndNo || isTasksAndNo || isEventAndNo ? "20" : isSearchAndNo ? "14.167" : isListAndNo ? "10" : "16"} src={isEventAndNo ? imgTypeEventIsNumberNo : isMicAndOff ? imgTypeMicIsNumberOff : isChatAndNo ? imgTypeChatIsNumberNo : isFileAndNo ? imgTypeFileIsNumberNo : isTasksAndNo ? imgTypeTasksIsNumberNo : isSettingAndNo ? imgTypeSettingIsNumberNo : isHouseAndNo ? imgTypeHouseIsNumberNo : isBellAndNo ? imgTypeBellIsNumberNo : isPauseAndEmpty ? imgTypePauseIsNumberEmpty : isPauseAndFill ? imgTypePauseIsNumberFill : isSearchAndNo ? imgTypeSearchIsNumberNo : isListAndNo ? imgTypeListIsNumberNo : imgTypeLogoutIsNumberNo} width={isChatAndNo ? "18" : isNumber === "No" && ["Setting", "Tasks", "File", "Event"].includes(type) ? "20" : isPauseAndEmpty ? "15.714" : isSearchAndNo ? "14.167" : "16"} />}
      {isNoAndIsActionOrStatistics && (
        <div className={`absolute ${isStatistics ? "inset-[12.5%_0.93%_-4.17%_12.5%]" : "inset-[8.33%_20.83%]"}`} data-name="color">
          <img alt="" className="absolute block max-w-none size-full" height={isStatistics ? "22" : "20"} src={isStatistics ? imgColor1 : imgColor} width={isStatistics ? "20.778" : "14"} />
        </div>
      )}
      {isNotificationAndYes && (
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center relative size-full">
            <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[0px] relative shrink-0 text-[7px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              1
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
type HeaderProps = {
  className?: string;
  title?: string;
  type?: "Navs" | "Title" | "User";
  user?: string;
};

function Header({ className, title = "Title", type = "Navs", user = "User" }: HeaderProps) {
  const isTitle = type === "Title";
  const isTitleOrUser = ["Title", "User"].includes(type);
  const isUser = type === "User";
  return (
    <div className={className || `relative rounded-[5px] ${isUser ? "h-[40px] w-[181px]" : isTitle ? "" : "bg-white w-[405px]"}`}>
      <div aria-hidden={isTitleOrUser ? "true" : undefined} className={isTitleOrUser ? "absolute border border-[#0f0f0f] border-solid inset-[-0.5px] pointer-events-none rounded-[5.5px]" : "flex flex-row items-center size-full"}>
        {type === "Navs" && (
          <div className="content-stretch flex gap-[20px] items-center px-[10px] py-[5px] relative w-full">
            <ButtonIconTextHorizontalBackgroundImageAndText text="Logout" />
            <ButtonIconTextHorizontalBackgroundImageAndText text="Logout" />
            <ButtonIconTextHorizontalBackgroundImageAndText text="Logout" />
            <ButtonIconTextHorizontalBackgroundImageAndText text="Logout" />
            <ButtonIconTextHorizontalBackgroundImageAndText text="Logout" />
          </div>
        )}
      </div>
      {isTitleOrUser && (
        <div className={isUser ? "absolute border border-[#0f0f0f] border-solid left-[10px] rounded-[5px] size-[40px] top-0" : "flex flex-row items-center size-full"}>
          {isTitle && (
            <div className="content-stretch flex gap-[10px] items-center px-[10px] relative">
              <div className="relative rounded-[5px] shrink-0 size-[50px]">
                <div aria-hidden="true" className="absolute border border-[#0f0f0f] border-solid inset-0 pointer-events-none rounded-[5px]" />
              </div>
              <div className="flex flex-col font-['SF_Pro:Expanded_Light',sans-serif] font-[270.32501220703125] justify-center leading-[0] relative shrink-0 text-[#0f0f0f] text-[32px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 132" }}>
                <p className="leading-[40px]">{title}</p>
              </div>
            </div>
          )}
        </div>
      )}
      {isUser && (
        <>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['SF_Pro:Bold',sans-serif] font-bold justify-center leading-[0] left-[104.5px] text-[#0f0f0f] text-[18px] text-center top-[20px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[26px]">{user}</p>
          </div>
          <div className="absolute h-[6px] left-[159px] top-[26px] w-[12px]" data-name="Dropdown">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 6">
              <path clipRule="evenodd" d={svgPaths.p3e42a480} fill="var(--fill-0, #0F0F0F)" fillRule="evenodd" id="Dropdown" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

export default function HitoryPage() {
  return (
    <div className="relative size-full" data-name="Hitory Page">
      <BackgroundImage />
      <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex items-start left-0 py-[20px] top-[96px] w-[1440px]" data-name="F">
        <p className="flex-[1_0_0] font-['SF_Pro:Expanded_Light',sans-serif] font-[270.32501220703125] leading-[36px] min-h-px min-w-px relative text-[#0f0f0f] text-[28px]" style={{ fontVariationSettings: "'wdth' 132" }}>
          Welcome, Here is Your Personal History Practice Analysis.
        </p>
      </div>
      <div className="absolute bg-[rgba(74,68,89,0.5)] bottom-0 h-[202px] left-0 w-[1440px]" />
      <div className="absolute h-[20px] left-0 top-[70px] w-[1440px]" />
      <div className="absolute h-[20px] left-0 top-[76px] w-[1440px]" />
      <div className="-translate-x-1/2 absolute bg-[rgba(255,255,255,0.6)] content-stretch flex gap-[200px] items-center justify-center left-1/2 px-[30px] py-[10px] top-0 w-[1440px]" data-name="Header">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-[-0.5px] pointer-events-none" />
        <Header className="relative rounded-[5px] shrink-0" type="Title" />
        <div className="bg-white relative rounded-[5px] shrink-0 w-[405px]" data-name="Header">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex gap-[20px] items-center px-[10px] py-[5px] relative w-full">
              <BackgroundImage2>
                <Icon className="relative shrink-0 size-[16px]" type="Bell" />
                <BackgroundImage5>Welcome</BackgroundImage5>
              </BackgroundImage2>
              <BackgroundImage2>
                <Icon className="relative shrink-0 size-[16px]" isNumber="Fill" type="Pause" />
                <BackgroundImage5>History</BackgroundImage5>
              </BackgroundImage2>
              <ButtonIconTextHorizontalBackgroundImageAndText text="Logout" />
              <ButtonIconTextHorizontalBackgroundImageAndText text="Logout" />
              <ButtonIconTextHorizontalBackgroundImageAndText text="Logout" />
            </div>
          </div>
        </div>
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
          <Icon className="col-1 h-[22.75px] ml-0 mt-[6.5px] relative row-1 w-[17.333px]" type="Bell" />
          <Icon className="bg-[#1e5eff] col-1 ml-[8.67px] mt-0 relative rounded-[999px] row-1 size-[17.333px]" isNumber="Yes" type="Notification" />
        </div>
        <Header className="h-[40px] relative rounded-[5px] shrink-0 w-[181px]" type="User" />
      </div>
      <div className="absolute h-[75px] left-[calc(16.67%+30px)] top-[1097px] w-[1139px]">
        <TextAutoHeightBackgroundImageAndText text="Input text" additionalClassNames="left-[calc(13.33%+0.13px)] top-0 w-[835px]" />
        <TextAutoHeightBackgroundImageAndText text="Input text" additionalClassNames="left-[calc(13.33%+0.13px)] top-[38px] w-[835px]" />
        <Frame21TextAutoHeightBackgroundImage additionalClassNames="top-0">{`Auto  Sentence 1`}</Frame21TextAutoHeightBackgroundImage>
        <Frame21TextAutoHeightBackgroundImage additionalClassNames="top-[38px]">{`Auto  Sentence 2`}</Frame21TextAutoHeightBackgroundImage>
        <TextAutoHeightBackgroundImageAndText text="Go Practice" additionalClassNames="left-[calc(86.67%+0.87px)] top-0 w-[151px]" />
        <TextAutoHeightBackgroundImageAndText text="Go Practice" additionalClassNames="left-[calc(86.67%+0.87px)] top-[38px] w-[151px]" />
      </div>
      <div className="absolute h-[75px] left-[calc(16.67%+30px)] top-[1179px] w-[1139px]" />
      <div className="absolute h-[531px] left-[30px] top-[489px] w-[1379px]">
        <div className="absolute h-[531px] left-0 top-0 w-[151px]">
          <BackgroundImage3 additionalClassNames="bg-[#b8ad2c] left-0 top-[76px]">
            <BackgroundImageAndText text="Good" />
          </BackgroundImage3>
          <BackgroundImage3 additionalClassNames="bg-[#cd594e] left-[76px] top-[76px]">
            <BackgroundImageAndText text="Poor" />
          </BackgroundImage3>
          <div className="absolute left-0 size-[75px] top-[152px]" data-name="Text/AutoHeight">
            <BackgroundImage />
            <div className="overflow-clip rounded-[inherit] size-full">
              <BackgroundImageAndText text="UK IPA" />
            </div>
            <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute left-[76px] size-[75px] top-[152px]" data-name="Text/AutoHeight">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(-90deg, rgb(166, 200, 231) 0%, rgb(86, 164, 233) 100%)" }} />
              <img alt="" className="absolute max-w-none object-cover opacity-20 size-full" src={imgHitoryPage} />
            </div>
            <div className="overflow-clip rounded-[inherit] size-full">
              <BackgroundImageAndText text="US IPA" />
            </div>
            <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          </div>
          <BackgroundImage3 additionalClassNames="bg-[#b8ad2c] left-0 top-[228px]">
            <BackgroundImage1 text="/eɪ/" text1="s" text2="ay" />
          </BackgroundImage3>
          <TextAutoHeightBackgroundImage additionalClassNames="left-[76px] top-[228px]" />
          <TextAutoHeightBackgroundImage additionalClassNames="left-0 top-[304px]" />
          <TextAutoHeightBackgroundImage additionalClassNames="left-[76px] top-[304px]" />
          <TextAutoHeightBackgroundImage additionalClassNames="left-0 top-[380px]" />
          <TextAutoHeightBackgroundImage additionalClassNames="left-[76px] top-[380px]" />
          <TextAutoHeightBackgroundImage additionalClassNames="left-0 top-[456px]" />
          <TextAutoHeightBackgroundImage additionalClassNames="left-[76px] top-[456px]" />
          <div className="absolute bg-[#0fb891] left-px size-[75px] top-0" data-name="Text/AutoHeight">
            <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
            <BackgroundImageAndText text="Excellent" />
          </div>
        </div>
        <div className="absolute h-[531px] left-[924px] top-0 w-[455px]">
          <BackgroundImage3 additionalClassNames="bg-[#b8ad2c] left-0 top-[227px]">
            <BackgroundImage4>
              <p className="leading-[26px] mb-0">/p/</p>
              <p>
                <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  p
                </span>
                <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  en
                </span>
              </p>
            </BackgroundImage4>
          </BackgroundImage3>
          <div className="absolute bg-[#bcbcbc] left-[380px] size-[75px] top-0" data-name="Text/AutoHeight">
            <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
            <BackgroundImageAndText text="No Record" />
          </div>
          <div className="absolute bg-[#bcbcbc] left-0 size-[75px] top-[76px]" data-name="Text/AutoHeight">
            <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
            <BackgroundImage1 text="/iː/" text1="s" text2="ee" />
          </div>
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[152px] top-[76px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[304px] top-[76px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[76px] top-[76px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[228px] top-[76px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[380px] top-[76px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-0 top-[152px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[152px] top-[152px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#0fb891] left-[304px] top-[152px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[76px] top-[152px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[228px] top-[152px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[380px] top-[152px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[152px] top-[228px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[304px] top-[228px]" />
          <div className="absolute bg-[#bcbcbc] left-[76px] size-[75px] top-[228px]" data-name="Text/AutoHeight">
            <div aria-hidden="true" className="absolute border-3 border-[#1e5eff] border-solid inset-0 pointer-events-none" />
            <BackgroundImageAndText text="Input text" />
          </div>
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[228px] top-[228px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[380px] top-[228px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-0 top-[304px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[152px] top-[304px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[304px] top-[304px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[76px] top-[304px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#cd594e] left-[228px] top-[304px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[380px] top-[304px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-0 top-[380px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[152px] top-[380px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[304px] top-[380px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[76px] top-[380px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[228px] top-[380px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[380px] top-[380px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-0 top-[456px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[152px] top-[456px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[304px] top-[456px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[76px] top-[456px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[228px] top-[456px]" />
          <TextAutoHeightBackgroundImage1 additionalClassNames="bg-[#bcbcbc] left-[380px] top-[456px]" />
        </div>
        <div className="absolute h-[303px] left-[158px] top-[228px] w-[759px]">
          <div className="absolute bg-white h-[303px] left-0 top-0 w-[759px]" data-name="Text/AutoHeight">
            <div className="overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex items-start relative size-full">
                <p className="flex-[1_0_0] font-['SF_Pro:Expanded_Light',sans-serif] font-[270.32501220703125] leading-[36px] min-h-px min-w-px relative text-[28px] text-black text-center" style={{ fontVariationSettings: "'wdth' 132" }}>{`Analysis Report (Based on stats: Last 3 months) `}</p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute bg-white h-[264px] left-0 top-[39px] w-[759px]" data-name="Text/AutoHeight">
            <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
            <BackgroundImageAndText text="Input text" />
          </div>
        </div>
        <div className="absolute bg-[#bcbcbc] h-[37.5px] left-[550px] top-0 w-[367px]" data-name="Text/AutoHeight">
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          <BackgroundImageAndText text="Generate a sentence from your selected" additionalClassNames="py-[5px]" />
        </div>
        <div className="absolute bg-white h-[37px] left-[317px] top-[37px] w-[600px]" data-name="Text/AutoHeight">
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          <BackgroundImageAndText text="Input text" additionalClassNames="py-[2px]" />
        </div>
        <div className="absolute bg-[#bcbcbc] h-[37.5px] left-[399px] top-0 w-[151px]" data-name="Text/AutoHeight">
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          <BackgroundImageAndText text="Go Practice" additionalClassNames="py-[2px]" />
        </div>
      </div>
      <HitoryPageTextAutoHeightBackgroundImage additionalClassNames="top-[342px]">
        <p className="leading-[26px] mb-0">{`Consonants `}</p>
        <p className="mb-0">
          <span className="leading-[26px]">{`UK IPA, US IPA: /p/ /b/, /t/ /d/, /k/ /g/; /f/ /v/, /θ/ /ð/, /s/ /z/, /ʃ/ /ʒ/; /tʃ/ /dʒ/; /m/ /n/ /ŋ/; /l/ /r//ɹ/ /j/ /w/; `}</span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            /h/
          </span>
          <span className="leading-[26px]">;</span>
        </p>
        <p className="mb-0">
          <span className="leading-[26px]">ARPAbet: P B, T D, K G; F V, TH DH, S Z, SH ZH; CH JH; M N NX(NG); L R Y W;</span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>{` HH`}</span>
          <span className="leading-[26px]">;</span>
        </p>
        <p>
          <span className="leading-[26px]">{`E.g.: `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            p
          </span>
          <span className="leading-[26px]">{`en `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            b
          </span>
          <span className="leading-[26px]">{`oy, `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            t
          </span>
          <span className="leading-[26px]">{`ea `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            d
          </span>
          <span className="leading-[26px]">{`ay, `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            c
          </span>
          <span className="leading-[26px]">{`at `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            g
          </span>
          <span className="leading-[26px]">{`o; `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            f
          </span>
          <span className="leading-[26px]">{`ive `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            v
          </span>
          <span className="leading-[26px]">{`an, `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            s
          </span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`ee `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            z
          </span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            oo
          </span>
          <span className="leading-[26px]">,</span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>{` `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            th
          </span>
          <span className="leading-[26px]">{`in `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            th
          </span>
          <span className="leading-[26px]">{`is, `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            sh
          </span>
          <span className="leading-[26px]">e vi</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            s
          </span>
          <span className="leading-[26px]">{`ion; `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            ch
          </span>
          <span className="leading-[26px]">{`in `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            j
          </span>
          <span className="leading-[26px]">{`ump; `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            m
          </span>
          <span className="leading-[26px]">{`an `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            n
          </span>
          <span className="leading-[26px]">o si</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            ng;
          </span>
          <span className="leading-[26px]">{` `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            l
          </span>
          <span className="leading-[26px]">{`eg `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            r
          </span>
          <span className="leading-[26px]">{`ed `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            y
          </span>
          <span className="leading-[26px]">{`es `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            w
          </span>
          <span className="leading-[26px]">{`e; `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            h
          </span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            e
          </span>
          <span className="leading-[26px]">;</span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>{` `}</span>
        </p>
      </HitoryPageTextAutoHeightBackgroundImage>
      <HitoryPageTextAutoHeightBackgroundImage additionalClassNames="top-[192px]">
        <p className="leading-[26px] mb-0">{`Vowels `}</p>
        <p className="mb-0">
          <span className="leading-[26px]">UK IPA: /iː/ /ɪ/ /e/ /æ/; /ʌ/</span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>{` /ɜː/ /ə/;`}</span>
          <span className="leading-[26px]">{` /ɑː/ /ɒ/ /ɔː/ /ʊ/ /uː/; /eɪ/ /ɔɪ/ /aɪ/; /aʊ/ /əʊ/; /ɪə/ /eə/ /ʊə/;`}</span>
        </p>
        <p className="mb-0">
          <span className="leading-[26px]">US IPA: /i/ /ɪ/ /ɛ/ /æ; /ʌ/</span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>{` /ɝ/ /ə/;`}</span>
          <span className="leading-[26px]">{` /ɑ/ /ɑ/(/ɔ/) /ɔ/ /ʊ/ /u/; /eɪ/ /ɔɪ/ /aɪ/; /aʊ/ /oʊ/; /ɪr/ /ɛr/ /ʊr/;`}</span>
        </p>
        <p className="mb-0">
          <span className="leading-[26px]">ARPAbet: IY IH EH AE; AH</span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>{` ER AH(AH0);`}</span>
          <span className="leading-[26px]">{` AA AA(AO) AO UH UW; EY OY AY; AW OW; IH_R EH_R UH_R;`}</span>
        </p>
        <p>
          <span className="leading-[26px]">E.g.: s</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            ee
          </span>
          <span className="leading-[26px]">{` s`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            i
          </span>
          <span className="leading-[26px]">t b</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            e
          </span>
          <span className="leading-[26px]">d c</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            a
          </span>
          <span className="leading-[26px]">t; c</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            u
          </span>
          <span className="leading-[26px]">t</span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>{` b`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            ir
          </span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            d
          </span>
          <span className="leading-[26px]">{` `}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            a
          </span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            bout
          </span>
          <span className="leading-[26px]">;</span>
          <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>{` `}</span>
          <span className="leading-[26px]">f</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            a
          </span>
          <span className="leading-[26px]">ther d</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            o
          </span>
          <span className="leading-[26px]">g s</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            aw
          </span>
          <span className="leading-[26px]">{` p`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            u
          </span>
          <span className="leading-[26px]">t t</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            oo;
          </span>
          <span className="leading-[26px]">{` s`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            ay
          </span>
          <span className="leading-[26px]">{` b`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            oy
          </span>
          <span className="leading-[26px]">{` m`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            y;
          </span>
          <span className="leading-[26px]">{` h`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            ow
          </span>
          <span className="leading-[26px]">{` n`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            o;
          </span>
          <span className="leading-[26px]">{` n`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            ear
          </span>
          <span className="leading-[26px]">{` h`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            air
          </span>
          <span className="leading-[26px]">{` t`}</span>
          <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            our;
          </span>
        </p>
      </HitoryPageTextAutoHeightBackgroundImage>
    </div>
  );
}