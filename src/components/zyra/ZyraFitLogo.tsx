import logoAsset from "@/assets/zyrafit-wordmark.png.asset.json";

type ZyraFitLogoProps = {
  className?: string;
  compact?: boolean;
};

export function ZyraFitLogo({ className = "", compact = false }: ZyraFitLogoProps) {
  return (
    <span className={`block overflow-hidden bg-[oklch(0.176_0.019_264)] ${className}`}>
      <img
        src={logoAsset.url}
        alt="ZyraFit"
        className={`${compact ? "h-full max-w-none object-cover object-left" : "h-full w-full object-contain"}`}
      />
    </span>
  );
}