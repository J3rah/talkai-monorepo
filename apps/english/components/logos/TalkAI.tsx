import Image from "next/image";
import { useTheme } from "next-themes";

export type TalkAILogoProps = {
  className?: string;
};

export default function TalkAILogo({ className }: TalkAILogoProps) {
  const { resolvedTheme } = useTheme();

  // Use resolved theme for accurate detection
  // Use static asset versioning instead of dynamic timestamp for production compatibility
  const ASSET_VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION || '1';
  const logoSrc = resolvedTheme === "dark" 
    ? `/talkAI_white_letters.png?v=${ASSET_VERSION}` 
    : `/talkAI_dark_letters.png?v=${ASSET_VERSION}`;
  
  return (
    <div className={`relative ${className}`}>
      <Image
        src={logoSrc}
        alt="TalkAI Logo"
        width={150}
        height={150}
        className="object-contain"
        priority
        unoptimized={false}
      />
    </div>
  );
} 