// Barcode scanning tuned for food packaging (EAN-13, EAN-8, UPC-A, UPC-E).
//
// 1. Uses the phone's built-in barcode detector when there is one (Chrome on Android):
//    it is fast and reliable, and needs no extra download.
// 2. Otherwise falls back to ZXing, limited to product barcodes and set to "try harder".
// 3. Asks for a sharp HD picture with continuous autofocus; the default is often a blurry
//    640x480 picture that small barcodes cannot be read from.
// 4. Only accepts a code whose check digit is valid and that was read the same way twice,
//    so a half-read barcode never looks up the wrong product.

type DetectedBarcode = { rawValue: string };
type NativeDetector = { detect: (source: CanvasImageSource) => Promise<DetectedBarcode[]> };
type NativeDetectorClass = {
  new (options: { formats: string[] }): NativeDetector;
  getSupportedFormats?: () => Promise<string[]>;
};

export type BarcodeScanner = {
  stop: () => void;
  /** Turns the flashlight on or off; resolves false when the phone has no controllable torch. */
  setTorch: (on: boolean) => Promise<boolean>;
  hasTorch: boolean;
};

const NATIVE_FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e"];

/** True when the code has a valid EAN/UPC check digit (8, 12 or 13 digits). */
export function isValidProductCode(code: string): boolean {
  if (!/^\d+$/.test(code) || ![8, 12, 13].includes(code.length)) return false;
  const digits = code.split("").map(Number);
  const check = digits.pop() ?? 0;
  const sum = digits
    .reverse()
    .reduce((acc, digit, index) => acc + digit * (index % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check;
}

/** UPC-E barcodes are a compressed UPC-A; expand them so the product database can find them. */
function expandUpcE(code: string): string {
  if (!/^[01]\d{7}$/.test(code)) return code;
  const [n, d1, d2, d3, d4, d5, d6, c] = code.split("");
  let body: string;
  if (d6 === "0" || d6 === "1" || d6 === "2") body = `${d1}${d2}${d6}0000${d3}${d4}${d5}`;
  else if (d6 === "3") body = `${d1}${d2}${d3}00000${d4}${d5}`;
  else if (d6 === "4") body = `${d1}${d2}${d3}${d4}00000${d5}`;
  else body = `${d1}${d2}${d3}${d4}${d5}0000${d6}`;
  return `${n}${body}${c}`;
}

function normalise(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (isValidProductCode(digits)) return digits;
  // An 8-digit UPC-E's check digit belongs to its expanded 12-digit form.
  if (digits.length === 8) {
    const expanded = expandUpcE(digits);
    if (isValidProductCode(expanded)) return expanded;
  }
  return null;
}

async function openCamera(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
  });
  const track = stream.getVideoTracks()[0];
  // Continuous autofocus where the phone supports it (most Android phones do).
  try {
    const caps = (track?.getCapabilities?.() ?? {}) as { focusMode?: string[] };
    if (track && caps.focusMode?.includes("continuous")) {
      await track.applyConstraints({ advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet] });
    }
  } catch {
    // focus control not available: the camera's default is used
  }
  return stream;
}

async function nativeDetector(): Promise<NativeDetector | null> {
  const Detector = (globalThis as { BarcodeDetector?: NativeDetectorClass }).BarcodeDetector;
  if (!Detector) return null;
  try {
    const supported = (await Detector.getSupportedFormats?.()) ?? NATIVE_FORMATS;
    const formats = NATIVE_FORMATS.filter((f) => supported.includes(f));
    return formats.length ? new Detector({ formats }) : null;
  } catch {
    return null;
  }
}

/** Starts the camera in `video` and calls `onCode` once with a confirmed product barcode. */
export async function startBarcodeScanner(
  video: HTMLVideoElement,
  onCode: (code: string) => void,
): Promise<BarcodeScanner> {
  const stream = await openCamera();
  const track = stream.getVideoTracks()[0];
  let stopped = false;
  let lastSeen: string | null = null;

  const accept = (raw: string) => {
    if (stopped) return;
    const code = normalise(raw);
    if (!code) return;
    // Require the same code on two reads in a row before accepting it.
    if (lastSeen !== code) {
      lastSeen = code;
      return;
    }
    stopped = true;
    cleanup();
    onCode(code);
  };

  let cleanupReader = () => {};
  const cleanup = () => {
    cleanupReader();
    stream.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  };

  const detector = await nativeDetector();
  if (detector) {
    video.srcObject = stream;
    await video.play().catch(() => undefined);
    let timer = 0;
    const tick = async () => {
      if (stopped) return;
      if (video.readyState >= 2) {
        try {
          const found = await detector.detect(video);
          for (const item of found) accept(item.rawValue);
        } catch {
          // a frame that could not be read; try the next one
        }
      }
      if (!stopped) timer = window.setTimeout(() => void tick(), 120);
    };
    void tick();
    cleanupReader = () => window.clearTimeout(timer);
  } else {
    const [{ BrowserMultiFormatOneDReader }, { BarcodeFormat, DecodeHintType }] = await Promise.all([
      import("@zxing/browser"),
      import("@zxing/library"),
    ]);
    const hints = new Map<number, unknown>([
      [
        DecodeHintType.POSSIBLE_FORMATS,
        [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E],
      ],
      [DecodeHintType.TRY_HARDER, true],
    ]);
    const reader = new BrowserMultiFormatOneDReader(hints, { delayBetweenScanAttempts: 100 });
    const controls = await reader.decodeFromStream(stream, video, (result) => {
      if (result) accept(result.getText());
    });
    cleanupReader = () => controls.stop();
  }

  const caps = (track?.getCapabilities?.() ?? {}) as { torch?: boolean };
  return {
    hasTorch: Boolean(caps.torch),
    stop: () => {
      if (stopped) return;
      stopped = true;
      cleanup();
    },
    setTorch: async (on: boolean) => {
      if (!track || !caps.torch) return false;
      try {
        await track.applyConstraints({ advanced: [{ torch: on } as MediaTrackConstraintSet] });
        return true;
      } catch {
        return false;
      }
    },
  };
}

/** Codes to try in the product database, since the same product is often stored as UPC-A or EAN-13. */
export function lookupVariants(code: string): string[] {
  const variants = [code];
  if (code.length === 12) variants.push(`0${code}`);
  if (code.length === 13 && code.startsWith("0")) variants.push(code.slice(1));
  return variants;
}
