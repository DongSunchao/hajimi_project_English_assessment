import clsx from "clsx";
import imgTextAutoHeight from "figma:asset/ece298d0ec2c16f10310d45724b276a6035cb503.png";
type TextAutoHeightBackgroundImage1Props = {
  additionalClassNames?: string;
};

function TextAutoHeightBackgroundImage1({ children, additionalClassNames = "" }: React.PropsWithChildren<TextAutoHeightBackgroundImage1Props>) {
  return (
    <div className={clsx("absolute bg-[#b8ad2c] left-0 size-[75px]", additionalClassNames)}>
      <div className="overflow-clip rounded-[inherit] size-full">{children}</div>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex items-start relative size-full">
      <div className="flex flex-[1_0_0] flex-col font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] h-full justify-center leading-[0] min-h-px min-w-px relative text-[0px] text-[18px] text-black text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        {children}
      </div>
    </div>
  );
}
type TextAutoHeightBackgroundImageProps = {
  additionalClassNames?: string;
};

function TextAutoHeightBackgroundImage({ additionalClassNames = "" }: TextAutoHeightBackgroundImageProps) {
  return (
    <div className={clsx("absolute size-[75px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      <BackgroundImageAndText1 text="Input text" />
    </div>
  );
}
type BackgroundImageProps = {
  text: string;
  text1: string;
  text2: string;
};

function BackgroundImage({ text, text1, text2 }: BackgroundImageProps) {
  return (
    <BackgroundImage1>
      <p className="leading-[26px] mb-0">{text}</p>
      <p>
        <span className="leading-[26px]">{text1}</span>
        <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {text2}
        </span>
      </p>
    </BackgroundImage1>
  );
}
type BackgroundImageAndText1Props = {
  text: string;
  additionalClassNames?: string;
};

function BackgroundImageAndText1({ text, additionalClassNames = "" }: BackgroundImageAndText1Props) {
  return (
    <div className={clsx("content-stretch flex items-start relative size-full", additionalClassNames)}>
      <div className="flex flex-[1_0_0] flex-col font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] h-full justify-center leading-[0] min-h-px min-w-px relative text-[18px] text-black text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[26px]">{text}</p>
      </div>
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
};

function BackgroundImageAndText({ text }: BackgroundImageAndTextProps) {
  return (
    <div className="overflow-clip rounded-[inherit] size-full">
      <BackgroundImageAndText1 text={text} />
    </div>
  );
}
type Frame19TextAutoHeightBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function Frame19TextAutoHeightBackgroundImageAndText({ text, additionalClassNames = "" }: Frame19TextAutoHeightBackgroundImageAndTextProps) {
  return (
    <div className={clsx("absolute size-[75px]", additionalClassNames)}>
      <BackgroundImageAndText text={text} />
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[531px] left-0 top-0 w-[151px]">
        <Frame19TextAutoHeightBackgroundImageAndText text="Good" additionalClassNames="bg-[#b8ad2c] left-0 top-[76px]" />
        <Frame19TextAutoHeightBackgroundImageAndText text="Poor" additionalClassNames="bg-[#cd594e] left-[76px] top-[76px]" />
        <div className="absolute left-0 size-[75px] top-[152px]" data-name="Text/AutoHeight">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div className="absolute bg-gradient-to-l from-[#2e7dc3] inset-0 to-[#0c2c48]" />
            <img alt="" className="absolute max-w-none object-cover opacity-20 size-full" src={imgTextAutoHeight} />
          </div>
          <BackgroundImageAndText text="UK IPA" />
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
        </div>
        <div className="absolute left-[76px] size-[75px] top-[152px]" data-name="Text/AutoHeight">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(-90deg, rgb(166, 200, 231) 0%, rgb(86, 164, 233) 100%)" }} />
            <img alt="" className="absolute max-w-none object-cover opacity-20 size-full" src={imgTextAutoHeight} />
          </div>
          <BackgroundImageAndText text="US IPA" />
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
        </div>
        <TextAutoHeightBackgroundImage1 additionalClassNames="top-[228px]">
          <BackgroundImage text="/eɪ/" text1="s" text2="ay" />
        </TextAutoHeightBackgroundImage1>
        <Frame19TextAutoHeightBackgroundImageAndText text="Input text" additionalClassNames="bg-[#bcbcbc] left-[76px] top-[228px]" />
        <Frame19TextAutoHeightBackgroundImageAndText text="Input text" additionalClassNames="bg-[#bcbcbc] left-0 top-[304px]" />
        <Frame19TextAutoHeightBackgroundImageAndText text="Input text" additionalClassNames="bg-[#bcbcbc] left-[76px] top-[304px]" />
        <Frame19TextAutoHeightBackgroundImageAndText text="Input text" additionalClassNames="bg-[#bcbcbc] left-0 top-[380px]" />
        <Frame19TextAutoHeightBackgroundImageAndText text="Input text" additionalClassNames="bg-[#bcbcbc] left-[76px] top-[380px]" />
        <Frame19TextAutoHeightBackgroundImageAndText text="Input text" additionalClassNames="bg-[#bcbcbc] left-0 top-[456px]" />
        <Frame19TextAutoHeightBackgroundImageAndText text="Input text" additionalClassNames="bg-[#bcbcbc] left-[76px] top-[456px]" />
        <div className="absolute bg-[#0fb891] left-px size-[75px] top-0" data-name="Text/AutoHeight">
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          <BackgroundImageAndText1 text="Excellent" />
        </div>
      </div>
      <div className="absolute h-[531px] left-[924px] top-0 w-[455px]">
        <TextAutoHeightBackgroundImage1 additionalClassNames="top-[227px]">
          <BackgroundImage1>
            <p className="leading-[26px] mb-0">/p/</p>
            <p>
              <span className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                p
              </span>
              <span className="font-['SF_Pro:Light',sans-serif] font-[274.31500244140625] leading-[26px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                en
              </span>
            </p>
          </BackgroundImage1>
        </TextAutoHeightBackgroundImage1>
        <div className="absolute bg-[#bcbcbc] left-[380px] size-[75px] top-0" data-name="Text/AutoHeight">
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          <BackgroundImageAndText1 text="No Record" />
        </div>
        <div className="absolute bg-[#bcbcbc] left-0 size-[75px] top-[76px]" data-name="Text/AutoHeight">
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          <BackgroundImage text="/iː/" text1="s" text2="ee" />
        </div>
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[152px] top-[76px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[304px] top-[76px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[76px] top-[76px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[228px] top-[76px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[380px] top-[76px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-0 top-[152px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[152px] top-[152px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#0fb891] left-[304px] top-[152px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[76px] top-[152px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[228px] top-[152px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[380px] top-[152px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[152px] top-[228px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[304px] top-[228px]" />
        <div className="absolute bg-[#bcbcbc] left-[76px] size-[75px] top-[228px]" data-name="Text/AutoHeight">
          <div aria-hidden="true" className="absolute border-3 border-[#1e5eff] border-solid inset-0 pointer-events-none" />
          <BackgroundImageAndText1 text="Input text" />
        </div>
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[228px] top-[228px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[380px] top-[228px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-0 top-[304px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[152px] top-[304px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[304px] top-[304px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[76px] top-[304px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#cd594e] left-[228px] top-[304px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[380px] top-[304px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-0 top-[380px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[152px] top-[380px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[304px] top-[380px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[76px] top-[380px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[228px] top-[380px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[380px] top-[380px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-0 top-[456px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[152px] top-[456px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[304px] top-[456px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[76px] top-[456px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[228px] top-[456px]" />
        <TextAutoHeightBackgroundImage additionalClassNames="bg-[#bcbcbc] left-[380px] top-[456px]" />
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
          <BackgroundImageAndText1 text="Input text" />
        </div>
      </div>
      <div className="absolute bg-[#bcbcbc] h-[37.5px] left-[550px] top-0 w-[367px]" data-name="Text/AutoHeight">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
        <BackgroundImageAndText1 text="Generate a sentence from your selected" additionalClassNames="py-[5px]" />
      </div>
      <div className="absolute bg-white h-[37px] left-[317px] top-[37px] w-[600px]" data-name="Text/AutoHeight">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
        <BackgroundImageAndText1 text="Input text" additionalClassNames="py-[2px]" />
      </div>
      <div className="absolute bg-[#bcbcbc] h-[37.5px] left-[399px] top-0 w-[151px]" data-name="Text/AutoHeight">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
        <BackgroundImageAndText1 text="Go Practice" additionalClassNames="py-[2px]" />
      </div>
    </div>
  );
}