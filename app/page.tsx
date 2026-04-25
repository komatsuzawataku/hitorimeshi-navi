"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type Restaurant = {
  id: number;
  name: string;
  area: string;
  genre: string;
  price_min: number;
  price_max: number;
  solo_score: number;
  solo_reason: string;
  google_maps_url: string;
};

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [area, setArea] = useState("");
  const [genre, setGenre] = useState("");
  const [budget, setBudget] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, [area, genre, budget, score]);

  async function fetchRestaurants() {
    let query = supabase.from("restaurants").select("*");

    if (area) query = query.eq("area", area);
    if (genre) query = query.eq("genre", genre);
    if (budget) query = query.lte("price_max", Number(budget));
    if (score) query = query.gte("solo_score", Number(score));

    const { data, error } = await query.order("solo_score", {
      ascending: false,
    });

    if (error) {
      console.error(error);
      return;
    }

    setRestaurants(data || []);
  }

  function resetFilters() {
    setArea("");
    setGenre("");
    setBudget("");
    setScore("");
  }

  return (
    <main style={styles.page}>
      <div style={styles.app}>
        <header style={styles.header}>
          <div>
            <p style={styles.label}>SOLO FOOD APP</p>
            <h1 style={styles.title}>ひとり飯ナビ</h1>
            <p style={styles.subtitle}>
              一人暮らしの「今日どこで食べる？」を10秒で解決。
            </p>
          </div>
        </header>

        <section style={styles.searchBox}>
          <div style={styles.searchTitle}>条件で探す</div>

          <div style={styles.grid}>
            <select value={area} onChange={(e) => setArea(e.target.value)} style={styles.select}>
              <option value="">エリア</option>
              <option value="新宿">新宿</option>
              <option value="池袋">池袋</option>
              <option value="渋谷">渋谷</option>
            </select>

            <select value={genre} onChange={(e) => setGenre(e.target.value)} style={styles.select}>
              <option value="">ジャンル</option>
              <option value="牛丼">牛丼</option>
              <option value="そば">そば</option>
              <option value="定食">定食</option>
              <option value="カレー">カレー</option>
              <option value="中華">中華</option>
            </select>

            <select value={budget} onChange={(e) => setBudget(e.target.value)} style={styles.select}>
              <option value="">予算</option>
              <option value="800">〜800円</option>
              <option value="1000">〜1,000円</option>
              <option value="1500">〜1,500円</option>
              <option value="2000">〜2,000円</option>
            </select>

            <select value={score} onChange={(e) => setScore(e.target.value)} style={styles.select}>
              <option value="">スコア</option>
              <option value="80">80点以上</option>
              <option value="90">90点以上</option>
            </select>
          </div>

          <button onClick={resetFilters} style={styles.resetButton}>
            条件をリセット
          </button>
        </section>

        <section style={styles.resultHeader}>
          <div>
            <p style={styles.resultLabel}>検索結果</p>
            <h2 style={styles.resultCount}>{restaurants.length}件</h2>
          </div>
          <div style={styles.sortBadge}>スコア順</div>
        </section>

        {restaurants.length === 0 && (
          <div style={styles.empty}>
            条件に合う店舗がありません。条件を変えて検索してください。
          </div>
        )}

        <div style={styles.list}>
          {restaurants.map((shop) => (
            <article key={shop.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <div style={styles.tags}>
                    <span style={styles.tag}>{shop.area}</span>
                    <span style={styles.tag}>{shop.genre}</span>
                  </div>
                  <h3 style={styles.shopName}>{shop.name}</h3>
                </div>

                <div style={styles.score}>
                  <span style={styles.scoreNumber}>{shop.solo_score}</span>
                  <span style={styles.scoreText}>点</span>
                </div>
              </div>

              <div style={styles.infoRow}>
                <span>💰</span>
                <span>
                  {shop.price_min}円〜{shop.price_max}円
                </span>
              </div>

              <p style={styles.reason}>{shop.solo_reason}</p>

              <a
                href={shop.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.mapButton}
              >
                Googleマップで見る
              </a>
            </article>
          ))}
        </div>

        <nav style={styles.bottomNav}>
          <div style={styles.navItemActive}>🏠<span>探す</span></div>
          <div style={styles.navItem}>⭐<span>保存</span></div>
          <div style={styles.navItem}>🗺️<span>地図</span></div>
        </nav>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #111827 0%, #050505 100%)",
    color: "white",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  app: {
    maxWidth: "430px",
    margin: "0 auto",
    minHeight: "100vh",
    padding: "22px 16px 90px",
    position: "relative",
  },
  header: {
    padding: "18px 4px 22px",
  },
  label: {
    fontSize: "12px",
    letterSpacing: "0.12em",
    color: "#22c55e",
    fontWeight: 700,
    marginBottom: "8px",
  },
  title: {
    fontSize: "34px",
    lineHeight: "1.1",
    margin: 0,
    fontWeight: 800,
  },
  subtitle: {
    marginTop: "10px",
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  searchBox: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "24px",
    padding: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    backdropFilter: "blur(12px)",
    marginBottom: "22px",
  },
  searchTitle: {
    fontSize: "15px",
    fontWeight: 700,
    marginBottom: "12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "#0b1220",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  resetButton: {
    marginTop: "12px",
    width: "100%",
    padding: "13px",
    borderRadius: "16px",
    border: "none",
    background: "#334155",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  resultLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    margin: 0,
  },
  resultCount: {
    margin: "2px 0 0",
    fontSize: "24px",
  },
  sortBadge: {
    background: "rgba(34,197,94,0.16)",
    color: "#86efac",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },
  empty: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "18px",
    color: "#cbd5e1",
    fontSize: "14px",
  },
  list: {
    display: "grid",
    gap: "14px",
  },
  card: {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "18px",
    boxShadow: "0 18px 35px rgba(0,0,0,0.28)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "14px",
  },
  tags: {
    display: "flex",
    gap: "6px",
    marginBottom: "8px",
  },
  tag: {
    background: "rgba(255,255,255,0.08)",
    color: "#cbd5e1",
    padding: "5px 9px",
    borderRadius: "999px",
    fontSize: "12px",
  },
  shopName: {
    margin: 0,
    fontSize: "19px",
    lineHeight: 1.35,
  },
  score: {
    minWidth: "58px",
    height: "58px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 800,
    boxShadow: "0 12px 25px rgba(34,197,94,0.25)",
  },
  scoreNumber: {
    fontSize: "21px",
    lineHeight: 1,
  },
  scoreText: {
    fontSize: "11px",
  },
  infoRow: {
    display: "flex",
    gap: "8px",
    color: "#e2e8f0",
    marginBottom: "12px",
    fontSize: "14px",
  },
  reason: {
    color: "#cbd5e1",
    lineHeight: 1.7,
    fontSize: "14px",
    margin: 0,
  },
  mapButton: {
    marginTop: "16px",
    display: "block",
    textAlign: "center",
    padding: "13px",
    background: "#2563eb",
    color: "white",
    borderRadius: "16px",
    textDecoration: "none",
    fontWeight: 800,
  },
  bottomNav: {
    position: "fixed",
    left: "50%",
    bottom: "14px",
    transform: "translateX(-50%)",
    width: "min(400px, calc(100% - 28px))",
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "24px",
    padding: "10px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    boxShadow: "0 16px 35px rgba(0,0,0,0.35)",
    backdropFilter: "blur(14px)",
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
    color: "#94a3b8",
    fontSize: "12px",
  },
  navItemActive: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
    color: "#22c55e",
    fontSize: "12px",
    fontWeight: 800,
  },
};