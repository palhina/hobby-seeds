/**
 * YuruHobbyのモックデータ
 *
 * テスト用のモックデータ。各エネルギーレベル・indoor/outdoorをカバー
 */

import type { YuruHobby } from "@/types";

export const mockHobbies: YuruHobby[] = [
  {
    id: 1,
    name: "雲観察",
    category: "眺める",
    time: 5,
    cost: 0,
    location: "どこでも",
    energy: "low",
    indoor: false,
    tryStep: "窓の外か空を見上げて、3つ雲を見つけて形を想像するだけ",
    emoji: "☁️",
    tags: ["自然", "リラックス", "観察"],
  },
  {
    id: 2,
    name: "落書き",
    category: "作る",
    time: 5,
    cost: 0,
    location: "家",
    energy: "low",
    indoor: true,
    tryStep: "紙とペンで、目の前にあるものを30秒で描いてみる",
    emoji: "✏️",
    tags: ["クリエイティブ", "アート", "手作業"],
  },
  {
    id: 3,
    name: "ストレッチ",
    category: "動く",
    time: 5,
    cost: 0,
    location: "家",
    energy: "medium",
    indoor: true,
    tryStep: "立ち上がって、両手を上に伸ばして5秒キープ。それだけ",
    emoji: "🧘",
    tags: ["フィジカル", "リラックス", "健康"],
  },
  {
    id: 4,
    name: "Podcast散歩",
    category: "聴く",
    time: 15,
    cost: 0,
    location: "外",
    energy: "medium",
    indoor: false,
    tryStep:
      "Spotifyなどで「おすすめPodcast」を検索して、1エピソード流しながら近所を歩く",
    emoji: "🎧",
    tags: ["音声", "学び", "散歩"],
  },
  {
    id: 10,
    name: "プチ筋トレ",
    category: "動く",
    time: 5,
    cost: 0,
    location: "家",
    energy: "high",
    indoor: true,
    tryStep: "スクワット5回だけ。本当に5回だけでOK",
    emoji: "💪",
    tags: ["フィジカル", "健康", "集中"],
  },
  {
    id: 11,
    name: "音楽発掘",
    category: "聴く",
    time: 10,
    cost: 0,
    location: "家",
    energy: "low",
    indoor: true,
    tryStep:
      "SpotifyやYouTubeで知らないジャンルのプレイリストを1曲だけ聴く",
    emoji: "🎵",
    tags: ["音声", "リラックス", "発見"],
  },
  {
    id: 13,
    name: "深呼吸タイム",
    category: "整える",
    time: 3,
    cost: 0,
    location: "どこでも",
    energy: "low",
    indoor: true,
    tryStep: "4秒吸って、4秒止めて、4秒吐く。これを3回だけ",
    emoji: "🌬️",
    tags: ["リラックス", "健康", "マインドフルネス"],
  },
  {
    id: 16,
    name: "星空観察",
    category: "眺める",
    time: 10,
    cost: 0,
    location: "外",
    energy: "low",
    indoor: false,
    tryStep: "夜、外に出て空を見上げる。星を3つ見つけたら完了",
    emoji: "⭐",
    tags: ["自然", "リラックス", "観察"],
  },
  {
    id: 72,
    name: "軽いジョギング",
    category: "動く",
    time: 20,
    cost: 0,
    location: "外",
    energy: "high",
    indoor: false,
    tryStep: "走りやすい靴を履いて、ゆっくり10分だけ走る。歩いてもOK",
    emoji: "🏃",
    tags: ["フィジカル", "健康", "達成感"],
  },
  {
    id: 35,
    name: "今日のニュース1本",
    category: "学ぶ",
    time: 5,
    cost: 0,
    location: "家",
    energy: "low",
    indoor: true,
    tryStep: "ニュースアプリを開いて、気になる記事を1本だけ読む",
    emoji: "📰",
    tags: ["学び", "知識", "読む"],
  },
];

export const mockHobbyById = (id: number): YuruHobby | undefined => {
  return mockHobbies.find((hobby) => hobby.id === id);
};

export const mockHobbiesByEnergy = (
  energy: "low" | "medium" | "high"
): YuruHobby[] => {
  return mockHobbies.filter((hobby) => hobby.energy === energy);
};

export const mockHobbiesByLocation = (
  location: "家" | "外" | "どこでも"
): YuruHobby[] => {
  return mockHobbies.filter((hobby) => hobby.location === location);
};

export const mockHobbiesByIndoor = (indoor: boolean): YuruHobby[] => {
  return mockHobbies.filter((hobby) => hobby.indoor === indoor);
};
