import { useEffect, useRef, useState, type CSSProperties } from 'react';

// 로컬에서 띄운 image-resizer 서버 주소 (현재 9999 포트)
const RESIZER = 'http://localhost:9999';

// 일부러 큰 원본 사진 (picsum 고정 시드 → 항상 같은 3840x2160 JPEG, 수 MB)
const SAMPLE = 'https://picsum.photos/seed/kitlib/3840/2160';

function resizeUrl(src: string, params: Record<string, string | number>): string {
  const qs = new URLSearchParams({ url: src });
  for (const [k, v] of Object.entries(params)) qs.set(k, String(v));
  return `${RESIZER}/resize?${qs.toString()}`;
}

function kb(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
}

interface PanelStat {
  ms?: number; // img onLoad 까지 걸린 시간 (체감 속도)
  bytes?: number; // 실제 전송 용량
}

const App = () => {
  const [src, setSrc] = useState(SAMPLE);
  const [loadKey, setLoadKey] = useState(0); // 증가시키면 동시에 다시 로드(캐시 무력화)
  const [opt, setOpt] = useState<PanelStat>({});
  const [raw, setRaw] = useState<PanelStat>({});
  const startRef = useRef(0);

  // 최적화본: 800px webp q50 (작음) / 원본: 변환 없이 그대로(큼)
  const optUrl = resizeUrl(src, { w: 800, format: 'webp', quality: 50, _t: loadKey });
  const rawUrl = resizeUrl(src, { _t: loadKey });

  // 로드 시작 시각 기록 + 용량은 별도 fetch로 측정 (이미지 타이밍과 무관)
  useEffect(() => {
    startRef.current = performance.now();
    setOpt({});
    setRaw({});

    let cancelled = false;
    const measure = async (url: string, set: (u: (p: PanelStat) => PanelStat) => void) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        if (!cancelled) set((p) => ({ ...p, bytes: blob.size }));
      } catch {
        /* 용량 측정 실패는 무시 (이미지 표시엔 영향 없음) */
      }
    };
    // 캐시 무력화 위해 용량 측정도 별도 _t 사용 (이미지 onLoad 타이밍과 분리)
    measure(resizeUrl(src, { w: 800, format: 'webp', quality: 50, _t: `m${loadKey}` }), setOpt);
    measure(resizeUrl(src, { _t: `m${loadKey}` }), setRaw);

    return () => {
      cancelled = true;
    };
  }, [src, loadKey]);

  const onLoaded = (set: (u: (p: PanelStat) => PanelStat) => void) => () => {
    const ms = performance.now() - startRef.current;
    set((p) => ({ ...p, ms }));
  };

  const winner =
    opt.ms != null && raw.ms != null ? (opt.ms < raw.ms ? 'opt' : 'raw') : null;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>최적화 vs 원본 — 로딩 속도 체감</h1>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <label style={{ flex: '1 1 360px' }}>
          원본 URL:&nbsp;
          <input value={src} onChange={(e) => setSrc(e.target.value)} style={{ width: '70%' }} />
        </label>
        <button onClick={() => setLoadKey((k) => k + 1)} style={btn}>
          ⟳ 동시에 다시 로드
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Panel
          title="✅ 최적화 (800px · webp · q50)"
          imgUrl={optUrl}
          stat={opt}
          isWinner={winner === 'opt'}
          onLoad={onLoaded(setOpt)}
        />
        <Panel
          title="🐢 원본 (리사이즈/변환 없음)"
          imgUrl={rawUrl}
          stat={raw}
          isWinner={winner === 'raw'}
          onLoad={onLoaded(setRaw)}
        />
      </div>

      <p style={{ fontSize: 13, color: '#666', marginTop: 16 }}>
        “동시에 다시 로드”를 누르면 두 이미지를 같은 순간에 새로 요청합니다(캐시 무력화). 숫자는
        요청 시작부터 이미지가 화면에 뜰 때까지의 시간이에요. localhost라 절대 시간은 짧지만, 원본이
        클수록 두 패널의 차이가 또렷해집니다.
      </p>
    </div>
  );
};

const Panel = ({
  title,
  imgUrl,
  stat,
  isWinner,
  onLoad,
}: {
  title: string;
  imgUrl: string;
  stat: PanelStat;
  isWinner: boolean;
  onLoad: () => void;
}) => (
  <figure
    style={{
      margin: 0,
      flex: '1 1 380px',
      border: `2px solid ${isWinner ? '#137333' : '#ddd'}`,
      borderRadius: 8,
      padding: 12,
    }}
  >
    <figcaption style={{ fontWeight: 700, marginBottom: 8 }}>{title}</figcaption>
    <div style={{ fontSize: 28, fontWeight: 800, color: isWinner ? '#137333' : '#222' }}>
      {stat.ms != null ? `${stat.ms.toFixed(0)} ms` : '로딩…'}
      {isWinner && <span style={{ fontSize: 14, marginLeft: 8 }}>더 빠름 🎉</span>}
    </div>
    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
      전송 용량: {stat.bytes != null ? kb(stat.bytes) : '측정 중…'}
    </div>
    <img
      key={imgUrl}
      src={imgUrl}
      alt={title}
      onLoad={onLoad}
      style={{ width: '100%', maxWidth: 480, height: 'auto', display: 'block', background: '#fafafa' }}
    />
  </figure>
);

const btn: CSSProperties = {
  padding: '8px 16px',
  cursor: 'pointer',
  borderRadius: 6,
  border: '1px solid #2d6cdf',
  background: '#2d6cdf',
  color: '#fff',
  fontWeight: 600,
};

export default App;
