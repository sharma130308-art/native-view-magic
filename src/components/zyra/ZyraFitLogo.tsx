import logoAsset from "@/assets/zyrafit-logo.png.asset.json";

type ZyraFitLogoProps = {
  className?: string;
  compact?: boolean;
};

export function ZyraFitLogo({ className = "", compact = false }: ZyraFitLogoProps) {
  return (
    <img
      src={logoAsset.url}
      alt="ZyraFit"
      className={`${compact ? "aspect-square object-cover object-left" : "object-contain"} ${className}`}
    />
  );
}