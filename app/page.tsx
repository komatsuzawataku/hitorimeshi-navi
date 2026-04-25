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
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <header style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>
            ひとり飯ナビ
          </h1>
          <p style={{ color: "#aaa", lineHeight: "1.6" }}>
            一人暮らしの「今日どこで食べる？」を10秒で解決。
          </p>
        </header>

        <section
          style={{
            background: "#151515",
            border: "1px solid #2a2a2a",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            <select value={area} onChange={(e) => setArea(e.target.value)} style={selectStyle}>
              <option value="">エリアを選択</option>
              <option value="新宿">新宿</option>
              <option value="池袋">池袋</option>
              <option value="渋谷">渋谷</option>
            </select>

            <select value={genre} onChange={(e) => setGenre(e.target.value)} style={selectStyle}>
              <option value="">ジャンルを選択</option>
              <option value="牛丼">牛丼</option>
              <option value="そば">そば</option>
              <option value="定食">定食</option>
              <option value="カレー">カレー</option>
              <option value="中華">中華</option>
            </select>

            <select value={budget} onChange={(e) => setBudget(e.target.value)} style={selectStyle}>
              <option value="">予算を選択</option>
              <option value="800">〜800円</option>
              <option value="1000">〜1,000円</option>
              <option value="1500">〜1,500円</option>
              <option value="2000">〜2,000円</option>
            </select>

            <select value={score} onChange={(e) => setScore(e.target.value)} style={selectStyle}>
              <option value="">一人向けスコアを選択</option>
              <option value="80">80点以上</option>
              <option value="90">90点以上</option>
            </select>

            <button onClick={resetFilters} style={resetButtonStyle}>
              条件をリセット
            </button>
          </div>
        </section>

        <p style={{ marginBottom: "14px", color: "#ddd" }}>
          検索結果：<strong>{restaurants.length}</strong>件
        </p>

        {restaurants.length === 0 && (
          <div
            style={{
              background: "#151515",
              border: "1px solid #333",
              borderRadius: "14px",
              padding: "20px",
              color: "#aaa",
            }}
          >
            条件に合う店舗がありません。条件を変えて検索してください。
          </div>
        )}

        {restaurants.map((shop) => (
          <article
            key={shop.id}
            style={{
              background: "#151515",
              border: "1px solid #2a2a2a",
              borderRadius: "18px",
              padding: "18px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                  {shop.name}
                </h2>
                <p style={{ color: "#aaa" }}>
                  📍 {shop.area} / 🍜 {shop.genre}
                </p>
              </div>

              <div
                style={{
                  background: "#16a34a",
                  color: "white",
                  borderRadius: "999px",
                  padding: "8px 10px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {shop.solo_score}点
              </div>
            </div>

            <div style={{ marginTop: "14px", lineHeight: "1.8" }}>
              <p>💰 {shop.price_min}円〜{shop.price_max}円</p>
              <p style={{ color: "#bbb" }}>{shop.solo_reason}</p>
            </div>

            <a
              href={shop.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                marginTop: "16px",
                textAlign: "center",
                padding: "12px",
                background: "#2563eb",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Googleマップで見る
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#0f0f0f",
  color: "white",
  fontSize: "16px",
};

const resetButtonStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#333",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};