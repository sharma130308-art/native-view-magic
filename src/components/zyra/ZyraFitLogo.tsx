import logoAsset from "@/assets/zyrafit-logo-exact.png";

type ZyraFitLogoProps = {
  className?: string;
  compact?: boolean;
};

export function ZyraFitLogo({ className = "", compact = false }: ZyraFitLogoProps) {
  return (
    <span className={`block shrink-0 ${className}`}>
      <img
        src={logoAsset}
        alt="ZyraFit"
        className={`h-full w-full object-contain ${compact ? "" : ""}`}
      />
    </span>
  );
}