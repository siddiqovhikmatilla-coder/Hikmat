/* Hikmat — Telegram uslubidagi messenjer (Supabase + WebRTC) */
(() => {
"use strict";
const CFG = window.HIKMAT_CONFIG || {};
if (/netlify\.app$/.test(location.hostname)) document.body.classList.add("nl");
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)));
const P = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const IC = {
  send:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10.2 15 12 3.4 13.8z"/></svg>',
  plane:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 11.2 20.6 4c.8-.3 1.6.4 1.3 1.3l-3.9 15.2c-.2.9-1.3 1.2-2 .6l-4.6-3.8-2.5 2.4c-.4.4-1 .1-1-.4v-3.9l8.6-8.1-10.6 6.6-3.6-1.2c-.8-.3-.8-1.3 0-1.5z"/></svg>',
  mic:P('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  micOff:P('<path d="M3 3l18 18M9 9v2a3 3 0 0 0 5 2.2M15 9.3V6a3 3 0 0 0-5.7-1.3M5 11a7 7 0 0 0 11.5 5.3M19 11a7 7 0 0 1-.6 2.8M12 18v3"/>'),
  clip:P('<path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7"/>'),
  smile:P('<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01" stroke-width="3"/>'),
  back:P('<path d="M19 12H5M12 19l-7-7 7-7"/>'), x:P('<path d="M18 6 6 18M6 6l12 12"/>'),
  reply:P('<path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>'), fwd:P('<path d="m15 17 5-5-5-5"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>'),
  copy:P('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>'), edit:P('<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
  trash:P('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>'), pin:P('<path d="M12 17v5M9 3h6l-1 7 4 3v2H6v-2l4-3z"/>'),
  bookmark:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>',
  group:P('<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>'),
  user:P('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'), userPlus:P('<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>'),
  moon:P('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'), info:P('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01" stroke-width="2.5"/>'),
  gear:P('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  down:P('<path d="m6 9 6 6 6-6"/>'), left:P('<path d="m15 18-6-6 6-6"/>'), right:P('<path d="m9 18 6-6-6-6"/>'),
  dots:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
  check:P('<path d="m5 12 4 4 10-10"/>'), checks:P('<path d="m2 12 4 4 10-10M12 15l1 1 10-10"/>'), clock:P('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/>'),
  leave:P('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'), search:P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  camera:P('<path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>'),
  image:P('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>'),
  video:P('<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/>'),
  videoOff:P('<path d="M3 3l18 18M16 16H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2M10 6h4a2 2 0 0 1 2 2v3l6-4v10"/>'),
  round:P('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/>'),
  selfie:P('<circle cx="12" cy="9" r="3.5"/><path d="M6 20a6 6 0 0 1 12 0"/><rect x="2" y="2" width="20" height="20" rx="4"/>'),
  file:P('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>'),
  save:P('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
  phone:P('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  phoneEnd:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-3.2 0-6.2.8-8.9 2.4-.7.4-1.1 1.2-1 2l.3 2c.1.8.9 1.4 1.7 1.2l3.3-.7c.7-.2 1.2-.8 1.2-1.5v-1.6c2.2-.7 4.6-.7 6.8 0v1.6c0 .7.5 1.3 1.2 1.5l3.3.7c.8.2 1.6-.4 1.7-1.2l.3-2c.1-.8-.3-1.6-1-2C18.2 9.8 15.2 9 12 9z"/></svg>',
  flip:P('<path d="M3 7h13l-3-3M21 17H8l3 3"/>'), link:P('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),
  bell:P('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>'),
  sticker:P('<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9.5L21 14.5V5a2 2 0 0 0-2-2z"/><path d="M14 21v-5a2 2 0 0 1 2-2h5"/>'),
  contacts:P('<circle cx="12" cy="9" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/><rect x="2.5" y="2.5" width="19" height="19" rx="4"/>'),
  sun:P('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>',
  stop:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>'
};
const EMOJI = "😀 😁 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😎 🤩 🥳 🤔 🤨 😐 🙄 😏 😅 😢 😭 😤 😡 🤯 😱 😴 🤗 🤭 🙏 👍 👎 👏 🙌 💪 🤝 👋 ✌️ 🤞 👌 ❤️ 🧡 💛 💚 💙 💜 🖤 💔 🔥 ✨ ⭐ 🌟 🎉 🎁 🎈 🌹 🌸 🌷 ☀️ 🌙 ⚡ ❄️ ☕ 🍵 🍉 🍎 🍞 🍕 🍔 🎂 🍫 📚 ✏️ 📌 📷 🎵 ⚽ 🚗 ✈️ 🏠 🕌 💯 ✅ ❌ ❓ ❗ 🤲 🇺🇿".split(" ");
const STK = "😂 😍 🥰 😎 🤩 🥳 😭 😡 🤯 😱 🤔 🙄 😴 🤗 🙏 👍 👏 💪 🤝 👋 ❤️ 💔 🔥 🎉 🌹 ☕ 🎂 💯 🐱 🐶 🦁 🐼".split(" ");
const QUICK = ["❤️","👍","😂","😮","😢","🔥","🙏"];
const COLORS = [["#ff885e","#ff516a"],["#ffcd6a","#ffa85c"],["#82b1ff","#665fff"],["#a0de7e","#54cb68"],["#53edd6","#28c9b7"],["#72d5fd","#2a9ef1"],["#e0a2f3","#d669ed"]];
const MAX = 50 * 1024 * 1024;
const PAGE = 60;

const S = {
  contacts:{}, myPhone:null,
  me:null, profile:null, profiles:{}, chats:[], unread:{}, active:null, msgs:[], hasMore:false, loadingMsgs:false,
  reply:null, editing:null, q:"", draft:{}, search:null, rec:null, audio:null, online:{}, typing:{}, stickers:[],
  pending:{}, presence:null, lastTyping:0, typingTimer:null, offline:false, savedId:null, started:false
};
try { const t = localStorage.getItem("xb-theme"); if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches)) document.body.classList.add("dark"); } catch(e){}

/* ---------- helpers ---------- */
function hash(s){ let h = 0; for (const c of String(s)) h = (h * 31 + c.codePointAt(0)) >>> 0; return h; }
const grad = seed => { const c = COLORS[hash(seed) % COLORS.length]; return `linear-gradient(${c[0]},${c[1]})`; };
function initials(n){ const f = w => [...w].find(ch => /[\p{L}\p{N}]/u.test(ch)) || ""; const w = String(n||"").trim().split(/\s+/).map(f).filter(Boolean); return esc((w[0] || "?") + (w[1] || "")).toUpperCase(); }
const pad = n => String(n).padStart(2,"0");
const hm = t => { const d = new Date(t); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };
const MONTHS = ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"];
const WD = ["Yak","Dush","Sesh","Chor","Pay","Jum","Shan"];
const dayKey = t => { const d = new Date(t); return d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate(); };
function dayLabel(t){ const d = new Date(t), n = new Date(); if (dayKey(t) === dayKey(n)) return "Bugun"; const y = new Date(n); y.setDate(n.getDate()-1); if (dayKey(t) === dayKey(y)) return "Kecha"; return d.getDate()+"-"+MONTHS[d.getMonth()] + (d.getFullYear() !== n.getFullYear() ? " " + d.getFullYear() : ""); }
function shortWhen(t){ if (!t) return ""; const d = new Date(t), n = new Date(); if (dayKey(t) === dayKey(n)) return hm(t); if (n - d < 6*864e5) return WD[d.getDay()]; return pad(d.getDate())+"."+pad(d.getMonth()+1)+"."+String(d.getFullYear()).slice(2); }
const fmtDur = s => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s/60) + ":" + pad(s % 60); };
const fmtSize = b => b > 1048576 ? (b/1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b/1024)) + " KB";
function isEmojiOnly(s){ const t = (s||"").trim(); if (!t || t.length > 12) return false; return /^(\p{Extended_Pictographic}|\p{Regional_Indicator}|‍|️|\s)+$/u.test(t); }
function toast(msg){ document.querySelectorAll(".toast").forEach(t => t.remove()); const el = document.createElement("div"); el.className = "toast"; el.textContent = msg; document.body.appendChild(el); setTimeout(() => el.remove(), 3000); }
const ts = v => typeof v === "number" ? v : (v ? Date.parse(v) : 0);
function linkify(s){ return esc(s).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">$1</a>'); }
const prof = id => S.profiles[id] || {id, name:""};
const contactName = id => { const k = (S.contacts || {})[id]; return k ? [k.first_name, k.last_name].filter(Boolean).join(" ").trim() : ""; };
const nameOf = id => id === S.me ? "Siz" : (contactName(id) || prof(id).name || "Foydalanuvchi");
const MON3 = ["yan","fev","mar","apr","may","iyn","iyl","avg","sen","okt","noy","dek"];
function lastSeen(id, long){
  if (S.online[id]) return "onlayn";
  const t = ts(prof(id).last_seen); if (!t) return long ? "yaqinda faol bo'lgan" : "yaqinda bo'lgan";
  const diff = Date.now() - t, pre = long ? "oxirgi marta: " : "";
  if (diff < 60e3) return pre + "hozirgina";
  if (diff < 3600e3) return pre + Math.round(diff / 60e3) + " daqiqa oldin";
  if (diff < 6 * 3600e3 && dayKey(t) === dayKey(Date.now())) return pre + Math.floor(diff / 3600e3) + " soat oldin";
  if (dayKey(t) === dayKey(Date.now())) return pre + "bugun " + hm(t);
  const y = new Date(); y.setDate(y.getDate() - 1);
  if (dayKey(t) === dayKey(y)) return pre + "kecha " + hm(t);
  const d = new Date(t); return pre + d.getDate() + "-" + MON3[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? " " + d.getFullYear() : "") + " " + hm(t);
}
function dmPeer(c){ return c && c.type === "dm" ? (c.members || []).find(x => x !== S.me) : null; }
function chatTitle(c){ if (!c) return ""; if (c.type === "saved") return "Saqlangan xabarlar"; if (c.type === "dm") { const o = dmPeer(c); return o ? nameOf(o) : "Shaxsiy chat"; } return c.title || "Guruh"; }
function avatarHtml(c, cls = ""){
  if (c.type === "saved") return `<div class="av ${cls}">${IC.bookmark}</div>`;
  if (c.type === "dm") return userAvatar(dmPeer(c), cls);
  const title = chatTitle(c);
  if (c.avatar_url) return `<div class="av ${cls}"><img src="${esc(c.avatar_url)}" alt=""></div>`;
  const label = !/^\p{L}/u.test(title) ? esc([...title][0] || "?") : initials(title);
  return `<div class="av ${cls}" style="background:${grad(c.id)}">${label}</div>`;
}
function userAvatar(id, cls = ""){
  const p = prof(id);
  if (p.avatar_url) return `<div class="av ${cls}"><img src="${esc(p.avatar_url)}" alt=""></div>`;
  return `<div class="av ${cls}" style="background:${grad(id)}">${initials(contactName(id) || p.name || "?")}</div>`;
}
function preview(m){
  if (!m) return "";
  const k = m.kind || "text"; const md = m.media || [];
  if (k === "sticker") return (m.text || "") + " Stiker";
  if (k === "call") { const x = md[0] || {}; return (x.video ? "📹 Video qo'ng'iroq" : "📞 Qo'ng'iroq") + (x.status === "missed" ? " (javobsiz)" : ""); }
  const lab = {photo: md.length > 1 ? `🖼 ${md.length} ta rasm` : "🖼 Rasm", video:"🎬 Video", round:"⏺ Dumaloq video", voice:"🎤 Ovozli xabar", file:"📎 " + ((md[0]||{}).name || "Fayl")}[k];
  return lab ? (lab + (m.text ? ", " + m.text : "")) : (m.text || "");
}
const norm = r => ({...r, from:r.from_id, at: r._at || ts(r.created_at), media:r.media || null, reactions:r.reactions || {}});
const getChat = id => S.chats.find(c => c.id === id);
function sortChats(){ S.chats.sort((a, b) => (a.type === "saved") - (b.type === "saved") || ts(b.last_at) - ts(a.last_at)); const s = S.chats.findIndex(c => c.type === "saved"); if (s > 0) S.chats.unshift(S.chats.splice(s, 1)[0]); }
function storagePath(url){ const i = (url || "").indexOf("/object/public/media/"); return i < 0 ? null : decodeURIComponent(url.slice(i + 21).split("?")[0]); }

/* ---------- boot ---------- */
const root = $("#root");
if (!CFG.SUPABASE_URL || /XXXX/.test(CFG.SUPABASE_URL) || !CFG.SUPABASE_ANON_KEY || /BU_YERGA/.test(CFG.SUPABASE_ANON_KEY)) {
  root.innerHTML = `<div class="setup"><h2>Hikmat hali sozlanmagan</h2><p><code>config.js</code> faylini oching va Supabase loyihangizning <b>URL</b> hamda <b>anon</b> kalitini yozing. Batafsil yo'riqnoma <code>YORIQNOMA.txt</code> faylida.</p></div>`;
  return;
}
if (!window.supabase || !window.supabase.createClient) { root.innerHTML = `<div class="setup"><h2>Internetga ulanib bo'lmadi</h2><p>Sahifani yangilang.</p></div>`; return; }
const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {auth:{persistSession:true, autoRefreshToken:true}});

async function boot(){
  const { data } = await sb.auth.getSession();
  if (data && data.session) start(data.session.user); else showAuth();
  sb.auth.onAuthStateChange((ev, session) => {
    if (ev === "SIGNED_OUT") location.reload();
    else if (session && !S.started && (ev === "SIGNED_IN" || ev === "INITIAL_SESSION")) start(session.user);
  });
}

/* ---------- auth ---------- */
const PHONE_DOMAIN = CFG.PHONE_DOMAIN || "hikmat-chat.netlify.app";
function normPhone(v){ let d = String(v || "").replace(/\D/g, ""); if (d.length === 9) d = "998" + d; return d.length >= 10 && d.length <= 15 ? d : null; }
const phoneEmail = d => d + "@" + PHONE_DOMAIN;
const fmtPhone = d => d && d.startsWith("998") && d.length === 12 ? `+998 ${d.slice(3,5)} ${d.slice(5,8)} ${d.slice(8,10)} ${d.slice(10)}` : (d ? "+" + d : "");
const looksPhone = q => (String(q).replace(/\D/g, "").length >= 9) && !/[a-z]/i.test(q);
async function findByPhone(q){ const d = normPhone(q); if (!d) return []; const { data } = await sb.rpc("find_by_phone", {p:d}); return (data || []).filter(p => p.id !== S.me); }
function showAuth(mode = "in", by){
  by = by || (function(){ try { return localStorage.getItem("hk-auth-by") || "phone"; } catch(e){ return "phone"; } })();
  const ph = by === "phone";
  root.innerHTML = `<div class="auth"><div class="box">
    <div class="logo"><img src="icon-192.png" alt="" style="width:100%;height:100%;border-radius:50%"></div>
    <h1>Hikmat</h1>
    <p>${mode === "in" ? "Hisobingizga kiring" : "Yangi hisob oching. Ismingizni do'stlaringiz ko'radi."}</p>
    <form id="af">
      ${mode === "up" ? '<input id="an" placeholder="Ismingiz" autocomplete="name" maxlength="60" required>' : ""}
      ${ph ? '<input id="ae" type="tel" inputmode="tel" placeholder="+998 90 123 45 67" autocomplete="tel" value="+998 " required>' : '<input id="ae" type="email" placeholder="Email" autocomplete="email" required>'}
      <input id="ap" type="password" placeholder="Parol (kamida 6 belgi)" autocomplete="${mode === "in" ? "current-password" : "new-password"}" minlength="6" required>
      <div class="err" id="aerr"></div>
      <button class="btn" id="ab" type="submit">${mode === "in" ? "Kirish" : "Ro'yxatdan o'tish"}</button>
      <button class="btn ghost" type="button" id="asw">${mode === "in" ? "Hisobim yo'q, ro'yxatdan o'taman" : "Hisobim bor, kiraman"}</button>
      <button class="btn ghost" type="button" id="aby" style="font-weight:500;font-size:14px">${ph ? "Email orqali kirish" : "Telefon raqam orqali kirish"}</button>
      ${mode === "in" ? '<button class="btn ghost" type="button" id="afg" style="font-weight:500;font-size:14px">Parolni unutdim</button>' : ""}
    </form></div></div>`;
  $("#asw").onclick = () => showAuth(mode === "in" ? "up" : "in", by);
  $("#aby").onclick = () => { const nb = ph ? "email" : "phone"; try { localStorage.setItem("hk-auth-by", nb); } catch(e){} showAuth(mode, nb); };
  if ($("#afg")) $("#afg").onclick = async () => {
    if (ph) { $("#aerr").textContent = "Telefon bilan ochilgan hisob parolini ilova egasi tiklab beradi — unga yozing."; return; }
    const email = $("#ae").value.trim(); if (!email) return ($("#aerr").textContent = "Avval emailni yozing");
    const { error } = await sb.auth.resetPasswordForEmail(email, {redirectTo: location.origin + location.pathname});
    $("#aerr").textContent = error ? "Xatolik: " + error.message : "Emailingizga parolni tiklash xati yuborildi.";
  };
  $("#af").onsubmit = async e => {
    e.preventDefault();
    const btn = $("#ab"), err = $("#aerr"); btn.disabled = true; err.textContent = ""; err.style.color = "";
    const password = $("#ap").value;
    let email = $("#ae").value.trim(), phone = null;
    if (ph) { phone = normPhone(email); if (!phone) { err.textContent = "Telefon raqamni to'liq yozing, masalan +998 90 123 45 67"; btn.disabled = false; return; } email = phoneEmail(phone); }
    try {
      if (mode === "up") {
        const name = $("#an").value.trim();
        const { data, error } = await sb.auth.signUp({email, password, options:{data: ph ? {name, phone} : {name}, emailRedirectTo: location.origin + location.pathname}});
        if (error) throw error;
        if (!data.session) {
          if (ph) { err.textContent = "Ro'yxatdan o'tib bo'lmadi: Supabase'da «Confirm email» yoqilgan. Uni o'chiring."; btn.disabled = false; return; }
          err.style.color = "var(--accent)"; err.textContent = "Emailingizga tasdiqlash xati yuborildi. Havolani bosib, keyin kiring."; btn.disabled = false; return;
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({email, password});
        if (error) throw error;
      }
    } catch(ex){
      const m = String(ex.message || ex);
      const what = ph ? "Raqam" : "Email";
      err.textContent = /Invalid login/i.test(m) ? `${what} yoki parol noto'g'ri` : /already registered|already exists/i.test(m) ? `Bu ${ph ? "raqam" : "email"} allaqachon ro'yxatdan o'tgan` : /Email not confirmed/i.test(m) ? "Avval emailingizdagi havolani bosib tasdiqlang" : /invalid/i.test(m) && ph ? "Server raqamni qabul qilmadi (" + m + "). Ilova egasiga xabar bering." : "Xatolik: " + m;
      btn.disabled = false;
    }
  };
}

/* ---------- app shell ---------- */
async function start(user){
  if (S.started) return; S.started = true;
  S.me = user.id;
  root.innerHTML = `<div class="app" id="app">
    <aside class="side">
      <div class="side-top">
        <button class="icon-btn" id="menuBtn" aria-label="Menyu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
        <label class="search">${IC.search}<input id="q" placeholder="Qidirish: raqam yoki @username" autocomplete="off"></label>
      </div>
      <div id="offl"></div>
      <div class="list" id="list"><div class="empty-list">Yuklanmoqda…</div></div>
      <button class="fab" id="fab" aria-label="Yangi chat">${IC.edit}</button>
    </aside>
    <main class="chat" id="chat"><div class="no-chat"><span>Suhbatni tanlang</span></div></main>
  </div>`;
  $("#list").addEventListener("click", e => { const it = e.target.closest(".item"); if (it) openChat(it.dataset.id); });
  $("#q").addEventListener("input", e => { S.q = e.target.value; renderList(); if (S.q.trim().length >= 2) searchPeople(S.q.trim()); });
  $("#fab").onclick = fabMenu;
  $("#menuBtn").onclick = mainMenu;
  await loadMyProfile();
  try { const { data } = await sb.rpc("get_or_create_saved"); S.savedId = data; } catch(e){}
  await loadContacts();
  await loadChats();
  subscribeDb(); startPresence(); listenCalls(); loadStickers(); touchLastSeen();
  sb.from("phones").select("phone").eq("user_id", S.me).maybeSingle().then(r => { if (r && r.data) S.myPhone = r.data.phone; }).catch(() => {});
  setInterval(touchLastSeen, 120e3); setInterval(renderList, 60e3);
  const join = new URLSearchParams(location.search).get("join");
  if (join) { history.replaceState(null, "", location.pathname); try { const { error } = await sb.rpc("join_chat", {c:join}); if (error) throw error; await loadChats(); openChat(join); toast("Guruhga qo'shildingiz ✅"); } catch(e){ toast("Guruh topilmadi"); } }
  window.addEventListener("online", () => { S.offline = false; showOffline(); resync(); });
  window.addEventListener("offline", () => { S.offline = true; showOffline(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { touchLastSeen(); if (S.active) markRead(S.active); } else touchLastSeen(); });
}
function showOffline(){ const o = $("#offl"); if (o) o.innerHTML = S.offline ? '<div class="offline">Internet yo\'q — ulanishni kutmoqda…</div>' : ""; }
async function touchLastSeen(){ try { await sb.from("profiles").update({last_seen:new Date().toISOString()}).eq("id", S.me); } catch(e){} }
async function loadMyProfile(){
  let { data } = await sb.from("profiles").select("id,name,username,avatar_url,bio,last_seen").eq("id", S.me).maybeSingle();
  if (!data) { const u = (await sb.auth.getUser()).data.user; const name = (u && u.user_metadata && u.user_metadata.name) || (u && u.email ? u.email.split("@")[0] : "Foydalanuvchi"); await sb.from("profiles").upsert({id:S.me, name}); data = {id:S.me, name}; }
  S.profile = data; S.profiles[S.me] = data;
}
async function loadProfiles(ids){
  const need = [...new Set(ids.filter(id => id && !S.profiles[id]))];
  if (!need.length) return;
  need.forEach(id => S.profiles[id] = {id, name:""});
  const { data } = await sb.from("profiles").select("id,name,username,avatar_url,bio,last_seen").in("id", need);
  (data || []).forEach(p => S.profiles[p.id] = p);
  renderList(); renderHead(); renderMsgs(false);
}
async function loadChats(){
  const { data, error } = await sb.from("members").select("chat_id,last_read,chats(*)").eq("user_id", S.me);
  if (error) { toast("Chatlarni yuklab bo'lmadi"); return; }
  const chats = (data || []).filter(r => r.chats).map(r => ({...r.chats, members:[], reads:{}}));
  const ids = chats.map(c => c.id);
  if (ids.length) {
    const { data: mem } = await sb.from("members").select("chat_id,user_id,last_read").in("chat_id", ids);
    (mem || []).forEach(m => { const c = chats.find(x => x.id === m.chat_id); if (c) { c.members.push(m.user_id); c.reads[m.user_id] = ts(m.last_read); } });
  }
  S.chats = chats; sortChats();
  const uids = []; chats.forEach(c => { uids.push(...c.members); if (c.last_from) uids.push(c.last_from); });
  try { const { data: u } = await sb.rpc("unread_counts"); S.unread = {}; (u || []).forEach(r => S.unread[r.chat_id] = Number(r.n)); } catch(e){}
  renderList(); renderHead(); renderPin();
  await loadProfiles(uids);
}

/* ---------- realtime ---------- */
let dbChan = null, wasDown = false;
function subscribeDb(){
  dbChan = sb.channel("db-" + S.me)
    .on("postgres_changes", {event:"*", schema:"public", table:"messages"}, onMsgChange)
    .on("postgres_changes", {event:"*", schema:"public", table:"chats"}, onChatChange)
    .on("postgres_changes", {event:"*", schema:"public", table:"members"}, onMemberChange)
    .on("postgres_changes", {event:"UPDATE", schema:"public", table:"profiles"}, p => { if (p.new && S.profiles[p.new.id]) { S.profiles[p.new.id] = {...S.profiles[p.new.id], ...p.new}; renderList(); renderHead(); } })
    .subscribe(status => {
      if (status === "SUBSCRIBED") { if (wasDown) { wasDown = false; resync(); } }
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") wasDown = true;
    });
}
async function resync(){ await loadChats(); if (S.active) reloadMsgs(); }
function onMsgChange(p){
  const ev = p.eventType;
  if (ev === "INSERT") {
    const m = norm(p.new); const c = getChat(m.chat_id);
    if (!c) { loadChats(); return; }
    c.last_at = m.created_at; c.last_from = m.from; c.last_text = preview(m).slice(0, 120);
    if (S.active === m.chat_id) {
      const i = S.msgs.findIndex(x => x.id === m.id);
      if (i >= 0) S.msgs[i] = {...m, at:S.msgs[i].at}; else S.msgs.push(m);
      dropPending(m.chat_id, m.id, true);
      renderMsgs(false);
      if (m.from !== S.me) { markRead(m.chat_id); if (document.hidden) notify(c, m); }
    } else if (m.from !== S.me) { S.unread[c.id] = (S.unread[c.id] || 0) + 1; notify(c, m); }
    sortChats(); renderList();
    loadProfiles([m.from]);
  } else if (ev === "UPDATE") {
    const m = norm(p.new);
    if (S.active === m.chat_id) { const i = S.msgs.findIndex(x => x.id === m.id); if (i >= 0) { S.msgs[i] = {...m, at:S.msgs[i].at}; renderMsgs(false); } }
  } else if (ev === "DELETE") {
    const id = p.old && p.old.id; if (!id) return;
    const before = S.msgs.length; S.msgs = S.msgs.filter(x => x.id !== id); if (S.msgs.length !== before) renderMsgs(false);
  }
}
function onChatChange(p){
  if (p.eventType === "DELETE") {
    const id = p.old && p.old.id; S.chats = S.chats.filter(c => c.id !== id);
    if (S.active === id) { S.active = null; $("#app").classList.remove("open"); renderChat(); }
    renderList(); return;
  }
  const n = p.new; const c = getChat(n.id);
  if (!c) { loadChats(); return; }
  Object.assign(c, n); sortChats(); renderList();
  if (S.active === c.id) { renderHead(); renderPin(); }
}
function onMemberChange(p){
  const ev = p.eventType; const r = ev === "DELETE" ? p.old : p.new; if (!r) return;
  if (ev === "INSERT" && r.user_id === S.me) { loadChats(); return; }
  const c = getChat(r.chat_id); if (!c) return;
  if (ev === "INSERT") { if (!c.members.includes(r.user_id)) c.members.push(r.user_id); c.reads[r.user_id] = ts(r.last_read); loadProfiles([r.user_id]); renderHead(); }
  else if (ev === "UPDATE") { c.reads[r.user_id] = ts(r.last_read); if (S.active === c.id && r.user_id !== S.me) renderMsgs(false); }
  else if (ev === "DELETE") {
    if (r.user_id === S.me) { S.chats = S.chats.filter(x => x.id !== c.id); if (S.active === c.id) { S.active = null; $("#app").classList.remove("open"); renderChat(); } renderList(); }
    else { c.members = c.members.filter(x => x !== r.user_id); renderHead(); }
  }
}

/* ---------- presence & typing ---------- */
function startPresence(){
  const ch = sb.channel("online", {config:{presence:{key:S.me}}});
  ch.on("presence", {event:"sync"}, () => {
    const st = ch.presenceState(); S.online = {}; S.typing = {};
    for (const [uid, metas] of Object.entries(st)) {
      if (uid === S.me) continue; S.online[uid] = true;
      const t = (metas || []).find(x => x.typing); if (t && Date.now() - (t.at || 0) < 8000) S.typing[uid] = {chat:t.typing, rec:t.rec};
    }
    renderList(); renderHead();
  }).subscribe(async status => { if (status === "SUBSCRIBED") { S.presence = ch; trackMe(); } });
}
function trackMe(extra = {}){ if (S.presence) S.presence.track({at:Date.now(), typing:null, ...extra}).catch(() => {}); }
function typing(rec){
  if (!S.presence || !S.active) return;
  clearTimeout(S.typingTimer);
  if (Date.now() - S.lastTyping > 2500) { S.lastTyping = Date.now(); trackMe({typing:S.active, rec:!!rec}); }
  S.typingTimer = setTimeout(() => { S.lastTyping = 0; trackMe(); }, 4000);
}
function stopTyping(){ clearTimeout(S.typingTimer); if (S.lastTyping) { S.lastTyping = 0; trackMe(); } }
function typersIn(cid){ return Object.entries(S.typing).filter(([, t]) => t.chat === cid); }

/* ---------- notifications & sounds ---------- */
let actx = null;
function ac(){
  try {
    if (actx && actx.state === "closed") actx = null;
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state !== "running") actx.resume().catch(() => {});
  } catch(e){}
  return actx;
}
/* Ovozlar oddiy <audio> orqali: iPhone'da mikrofon ishlatilgandan keyin ham ishonchli chalinadi */
function makeWav(len, fn){
  const sr = 22050, n = Math.floor(sr * len), buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
  const st = {};
  for (let i = 0; i < n; i++) { const s = Math.max(-1, Math.min(1, fn(i / sr, i / n, st))); v.setInt16(44 + i * 2, s * 32767, true); }
  return URL.createObjectURL(new Blob([buf], {type:"audio/wav"}));
}
const SND = {};
function sndUrl(name){
  if (SND[name]) return SND[name];
  if (name === "sent") SND.sent = makeWav(0.25, (t, p) => {
    // F — "ting-ting": ikki yengil nota
    let s = 0;
    for (const [f, t0] of [[1046.5, 0], [1318.5, 0.07]]) if (t >= t0) { const lt = t - t0; s += Math.sin(2 * Math.PI * f * lt) * Math.min(1, lt / 0.005) * Math.exp(-lt * 22); }
    return s * 0.25 * Math.min(1, (1 - p) / 0.04);
  });
  if (name === "in") SND.in = makeWav(0.45, (t, p) => {
    // K1 — uchta ko'tariluvchi nota (balandroq)
    let s = 0;
    for (const [f, t0] of [[880, 0], [1046.5, 0.08], [1318.5, 0.16]]) if (t >= t0) { const lt = t - t0; s += (Math.sin(2 * Math.PI * f * lt) + 0.12 * Math.sin(4 * Math.PI * f * lt)) * Math.min(1, lt / 0.005) * Math.exp(-lt * 14); }
    return s * 0.36 * Math.min(1, (1 - p) / 0.025);
  });
  return SND[name];
}
const sndEl = {};
function playSnd(name){
  if (!soundOn()) return;
  try {
    let el = sndEl[name];
    if (!el) { el = sndEl[name] = new Audio(sndUrl(name)); el.preload = "auto"; el.setAttribute("playsinline", ""); }
    el.currentTime = 0; el.volume = 1; const p = el.play(); if (p && p.catch) p.catch(() => {});
  } catch(e){}
}
// birinchi teginishda ovoz elementlarini "ochib" qo'yamiz (iPhone talab qiladi)
document.addEventListener("pointerdown", () => {
  ac();
  for (const n of ["sent", "in"]) { try { if (!sndEl[n]) { const el = sndEl[n] = new Audio(sndUrl(n)); el.setAttribute("playsinline", ""); el.muted = true; const p = el.play(); if (p && p.then) p.then(() => { el.pause(); el.muted = false; el.currentTime = 0; }).catch(() => { el.muted = false; }); else el.muted = false; } } catch(e){} }
}, {once:true, capture:true});
function beep(freqs, dur = .12, vol = .15){
  const a = ac(); if (!a) return; let t = a.currentTime;
  for (const f of freqs) { const o = a.createOscillator(), g = a.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur); t += dur * .9; }
}
function soundOn(){ try { return localStorage.getItem("xb-sound") !== "off"; } catch(e){ return true; } }
/* Telegramga o'xshash qisqa "vush" ovozi */
function sentSound(){ playSnd("sent"); }
function notify(c, m){
  playSnd("in");
  if (!("Notification" in window) || Notification.permission !== "granted" || !document.hidden) return;
  try { const n = new Notification(chatTitle(c), {body:(c.type === "group" ? nameOf(m.from) + ": " : "") + preview(m), tag:c.id, icon:"icon-192.png"}); n.onclick = () => { window.focus(); openChat(c.id); n.close(); }; } catch(e){}
}

/* ---------- chat list ---------- */
let peopleHits = [];
/* Begona odamlarni faqat to'liq raqam yoki @username bo'yicha topamiz; bo'sh qidiruvda — faqat tanishlar */
function knownPeople(){
  const ids = new Set(Object.keys(S.contacts || {})); S.chats.forEach(c => (c.members || []).forEach(u => { if (u !== S.me) ids.add(u); }));
  return [...ids].map(id => ({...prof(id), id, name:nameOf(id)})).sort((a, b) => (S.contacts[b.id] ? 1 : 0) - (S.contacts[a.id] ? 1 : 0) || ts(b.last_seen) - ts(a.last_seen));
}
async function lookupPeople(q){
  q = String(q || "").trim();
  if (!q) return knownPeople().slice(0, 50);
  if (looksPhone(q)) return findByPhone(q);
  const ql = q.toLowerCase().replace(/^@/, "");
  const local = knownPeople().filter(p => (p.name || "").toLowerCase().includes(ql) || (p.username || "").toLowerCase().startsWith(ql));
  let remote = [];
  if (ql.length >= 3 && /^[a-z0-9_]+$/.test(ql)) { const { data } = await sb.rpc("find_by_username", {q:ql}); remote = data || []; }
  const seen = new Set(local.map(p => p.id));
  return [...local, ...remote.filter(p => !seen.has(p.id) && p.id !== S.me)];
}
async function searchPeople(q){
  const hits = await lookupPeople(q.replace(/[,()%*\\]/g, " "));
  if (S.q.trim() !== q) return;
  hits.forEach(p => S.profiles[p.id] = {...S.profiles[p.id], ...p});
  peopleHits = hits; renderList();
}
function renderList(){
  const el = $("#list"); if (!el) return;
  const q = S.q.trim().toLowerCase();
  let html = "";
  for (const c of S.chats) {
    const title = chatTitle(c);
    if (q && !title.toLowerCase().includes(q) && !(c.last_text||"").toLowerCase().includes(q)) continue;
    const who = c.type === "group" && c.last_from && c.last_text ? `<b>${esc(c.last_from === S.me ? "Siz" : nameOf(c.last_from).split(" ")[0])}: </b>` : (c.type === "dm" && c.last_from === S.me && c.last_text ? "<b>Siz: </b>" : "");
    const peer = dmPeer(c); const on = peer && S.online[peer];
    const ty = typersIn(c.id);
    const un = S.active !== c.id ? (S.unread[c.id] || 0) : 0;
    const sub = ty.length ? `<span style="color:var(--accent)">${ty[0][1].rec ? "ovoz yozmoqda…" : (c.type === "group" ? esc(nameOf(ty[0][0]).split(" ")[0]) + " " : "") + "yozmoqda…"}</span>` : who + esc(c.last_text || (c.type === "group" ? "Guruh yaratildi" : c.type === "saved" ? "Muhim narsalarni shu yerda saqlang" : "Chat boshlandi"));
    html += `<div class="item ${S.active === c.id ? "on" : ""}" data-id="${esc(c.id)}">
      <div style="position:relative">${avatarHtml(c)}${on ? '<span style="position:absolute;right:1px;bottom:2px;width:14px;height:14px;border-radius:50%;background:#4fca5a;border:2px solid var(--bg)"></span>' : ""}</div>
      <div class="meta"><div class="row1"><div class="name">${esc(title)}</div><div class="when">${c.last_text ? shortWhen(ts(c.last_at)) : ""}</div></div>
      <div class="row2"><div class="sub">${sub}</div>${un ? `<div class="badge">${un > 99 ? "99+" : un}</div>` : ""}</div></div></div>`;
  }
  if (q && peopleHits.length) {
    const fresh = peopleHits.filter(p => !S.chats.some(c => dmPeer(c) === p.id));
    if (fresh.length) {
      html += `<div style="padding:12px 10px 4px;color:var(--muted);font-size:13px;font-weight:600">Odamlar</div>`;
      html += fresh.map(p => `<div class="item" data-person="${esc(p.id)}">${userAvatar(p.id)}<div class="meta"><div class="name">${esc(p.name || "Foydalanuvchi")}</div><div class="sub">${p.username ? "@" + esc(p.username) : esc(lastSeen(p.id))}</div></div></div>`).join("");
    }
  }
  if (!S.chats.length && !q) html += `<div class="empty-list">Hali chatlar yo'q.<br>Yuqoridagi qidiruvda do'stingizning ismini yozing yoki ✏️ tugmasini bosing.</div>`;
  else if (q && !html) html = `<div class="empty-list">Hech narsa topilmadi</div>`;
  el.innerHTML = html;
  el.querySelectorAll("[data-person]").forEach(d => d.onclick = e => { e.stopPropagation(); openDM(d.dataset.person); });
}

/* ---------- chat view ---------- */
function renderChat(){
  const el = $("#chat"); if (!el) return;
  if (!S.active) { el.innerHTML = '<div class="no-chat"><span>Suhbatni tanlang</span></div>'; return; }
  const c = getChat(S.active);
  const peer = dmPeer(c);
  el.innerHTML = `
    <div class="chat-head">
      <button class="icon-btn back" id="backBtn" aria-label="Orqaga">${IC.back}</button>
      <div id="headAv" style="cursor:pointer"></div>
      <div class="t" id="headT" style="cursor:pointer"><div class="tn" id="headName"></div><div class="ts" id="headSub"></div></div>
      ${peer ? `<button class="icon-btn" id="callA" aria-label="Qo'ng'iroq">${IC.phone}</button><button class="icon-btn" id="callV" aria-label="Video qo'ng'iroq">${IC.video}</button>` : ""}
      <button class="icon-btn" id="srchBtn" aria-label="Chatda qidirish">${IC.search}</button>
      <button class="icon-btn" id="chatMenu" aria-label="Chat menyusi">${IC.dots}</button>
    </div>
    <div id="searchSlot"></div><div id="cbarSlot"></div><div id="pinSlot"></div>
    <div class="msgs" id="msgs"><div class="wrap" id="wrap"></div></div>
    <button class="down" id="downBtn" style="display:none" aria-label="Pastga">${IC.down}</button>
    <div class="comp" id="comp"></div>`;
  renderHead(); renderPin(); renderContactBar(); renderComposer(); renderMsgs(true);
  $("#backBtn").onclick = closeChat;
  $("#chatMenu").onclick = e => chatMenu(e, getChat(S.active));
  $("#srchBtn").onclick = toggleSearch;
  $("#headT").onclick = $("#headAv").onclick = () => chatInfo(getChat(S.active));
  if (peer) { $("#callA").onclick = () => startCall(peer, false); $("#callV").onclick = () => startCall(peer, true); }
  const m = $("#msgs");
  m.addEventListener("scroll", () => {
    $("#downBtn").style.display = (m.scrollHeight - m.scrollTop - m.clientHeight > 300) ? "grid" : "none";
    if (m.scrollTop < 80 && S.hasMore && !S.loadingMsgs) loadOlder();
  }, {passive:true});
  $("#downBtn").onclick = () => m.scrollTo({top:m.scrollHeight, behavior:"smooth"});
}
function renderHead(){
  if (!S.active || !$("#headName")) return;
  const c = getChat(S.active); if (!c) return;
  $("#headName").textContent = chatTitle(c);
  $("#headAv").innerHTML = avatarHtml(c, "sm");
  const sub = $("#headSub"); sub.classList.remove("live");
  const ty = typersIn(c.id);
  if (c.type === "saved") sub.textContent = "faqat siz ko'rasiz";
  else if (ty.length) { sub.textContent = (c.type === "group" ? nameOf(ty[0][0]).split(" ")[0] + " " : "") + (ty[0][1].rec ? "ovoz yozmoqda…" : "yozmoqda…"); sub.classList.add("live"); }
  else if (c.type === "dm") { const t = lastSeen(dmPeer(c)); sub.textContent = t; if (t === "onlayn") sub.classList.add("live"); }
  else { const n = c.members.length; const on = c.members.filter(u => S.online[u]).length; sub.textContent = `${n} a'zo` + (on ? `, ${on + 1} onlayn` : ""); }
}
function renderPin(){
  const slot = $("#pinSlot"); if (!slot) return;
  const c = getChat(S.active);
  if (!c || !c.pinned || !c.pinned.id) { slot.innerHTML = ""; return; }
  slot.innerHTML = `<div class="pinbar" id="pinbar"><span style="color:var(--accent);display:grid">${IC.pin}</span><div class="pb"><b>Qadalgan xabar</b><span>${esc(c.pinned.text || "Xabar")}</span></div><button class="icon-btn" id="unpin" style="width:32px;height:32px">${IC.x}</button></div>`;
  $("#pinbar").onclick = e => { if (!e.target.closest("#unpin")) jumpTo(c.pinned.id); };
  $("#unpin").onclick = async () => { const { error } = await sb.from("chats").update({pinned:null}).eq("id", c.id); if (error) toast("Bo'lmadi"); };
}
function toggleSearch(){
  const slot = $("#searchSlot");
  if (S.search !== null) { S.search = null; slot.innerHTML = ""; renderMsgs(true); return; }
  S.search = "";
  slot.innerHTML = `<div class="searchbar"><input id="sq" placeholder="Chatda qidirish…" autocomplete="off"><span id="sres"></span><button class="icon-btn" id="sx" style="width:34px;height:34px">${IC.x}</button></div>`;
  const i = $("#sq"); i.focus();
  let t; i.oninput = () => { S.search = i.value; renderMsgs(true); clearTimeout(t); t = setTimeout(() => deepSearch(i.value), 500); };
  $("#sx").onclick = toggleSearch;
}
async function deepSearch(q){
  q = q.trim(); if (q.length < 2 || !S.active) return;
  const { data } = await sb.from("messages").select("*").eq("chat_id", S.active).ilike("text", `%${q.replace(/[%_]/g, "")}%`).order("created_at", {ascending:false}).limit(100);
  let added = false;
  (data || []).forEach(r => { if (!S.msgs.some(m => m.id === r.id)) { S.msgs.push(norm(r)); added = true; } });
  if (added) { S.msgs.sort((a, b) => a.at - b.at); renderMsgs(false); }
}

/* ---------- composer ---------- */
function renderComposer(){
  const el = $("#comp"); if (!el) return;
  if (S.rec) {
    el.innerHTML = S.rec.hold
      ? `<div class="inner"><div class="recbar"><span class="dot"></span><span class="rt" id="rt" style="flex:none">0:00</span><div class="lvl" id="lvl"></div><span id="slideHint" style="color:var(--muted);font-size:14px;white-space:nowrap">‹ Bekor uchun chapga</span></div><button class="send" style="transform:scale(1.06);background:var(--danger)" aria-label="Yozilmoqda">${IC.mic}</button></div>`
      : `<div class="inner"><div class="recbar"><span class="dot"></span><span class="rt" id="rt" style="flex:none">0:00</span><div class="lvl" id="lvl"></div><button id="recCancel">Bekor</button></div><button class="send" id="recSend" aria-label="Yuborish">${IC.send}</button></div>`;
    if ($("#recCancel")) { $("#recCancel").onclick = () => stopVoice(false); $("#recSend").onclick = () => stopVoice(true); }
    return;
  }
  const ctx = S.editing ? {t:"Tahrirlash", s:preview(S.editing)} : S.reply ? {t:nameOf(S.reply.from), s:preview(S.reply)} : null;
  el.innerHTML = `<div class="inner">
    <div class="field">
      ${ctx ? `<div class="ctx"><span style="color:var(--accent);display:grid">${S.editing ? IC.edit : IC.reply}</span><div class="bar"><b>${esc(ctx.t)}</b><span>${esc(ctx.s)}</span></div><button class="icon-btn" id="ctxX">${IC.x}</button></div>` : ""}
      <div class="fr"><button class="icon-btn" id="emoBtn" aria-label="Emoji va stikerlar">${IC.smile}</button><textarea id="ta" rows="1" placeholder="Xabar"></textarea>${S.editing ? "" : `<button class="icon-btn" id="attBtn" aria-label="Biriktirish">${IC.clip}</button>`}</div>
    </div>
    <button class="send" id="sendBtn"></button></div>`;
  const ta = $("#ta");
  ta.value = S.editing ? (S.editing.text || "") : (S.draft[S.active] || "");
  autosize(ta); updateSendBtn();
  ta.addEventListener("input", () => { autosize(ta); if (!S.editing) S.draft[S.active] = ta.value; updateSendBtn(); if (ta.value) typing(); });
  ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing && matchMedia("(pointer:fine)").matches) { e.preventDefault(); send(); } if (e.key === "Escape") { S.reply = null; S.editing = null; renderComposer(); } });
  setupSendBtn();
  $("#emoBtn").onclick = togglePanel;
  if ($("#attBtn")) $("#attBtn").onclick = attachMenu;
  if ($("#ctxX")) $("#ctxX").onclick = () => { S.reply = null; S.editing = null; renderComposer(); };
  if (matchMedia("(pointer:fine)").matches || ctx) setTimeout(() => ta.focus(), 30);
}
function hasText(){ const ta = $("#ta"); return !!(ta && ta.value.trim()) || !!S.editing; }
function updateSendBtn(){
  const b = $("#sendBtn"); if (!b) return;
  if (S.editing) { b.innerHTML = IC.check; b.dataset.mode = "send"; }
  else if (hasText()) { b.innerHTML = IC.send; b.dataset.mode = "send"; }
  else { b.innerHTML = S.roundMode ? IC.camera : IC.mic; b.dataset.mode = S.roundMode ? "round" : "voice"; }
  b.setAttribute("aria-label", b.dataset.mode === "send" ? "Yuborish" : b.dataset.mode === "round" ? "Dumaloq video (bosib turing yoki bosing)" : "Ovozli xabar (bosib turing yoki bosing)");
}
/* Telegram uslubi: bir bosish — mikrofon ⇄ kamera; bosib turish — yozish; chapga surish — bekor */
function showTip(text){
  const b = $("#sendBtn"); if (!b) return;
  document.querySelectorAll(".sb-tip").forEach(x => x.remove());
  const r = b.getBoundingClientRect(); const t = document.createElement("div"); t.className = "sb-tip"; t.textContent = text;
  t.style.cssText = `position:fixed;right:${Math.max(8, innerWidth - r.right)}px;bottom:${innerHeight - r.top + 10}px;background:rgba(0,0,0,.78);color:#fff;font-size:13.5px;padding:7px 12px;border-radius:10px;z-index:60;pointer-events:none;max-width:260px`;
  document.body.appendChild(t); setTimeout(() => t.remove(), 1800);
}
function setupSendBtn(){
  const b = $("#sendBtn"); if (!b) return;
  let holdT = null, held = false, x0 = 0;
  const onMove = e => {
    if (!held) return;
    const dx = e.clientX - x0;
    const hint = $("#slideHint"); if (hint) hint.style.transform = `translateX(${Math.min(0, dx / 2)}px)`;
    if (dx < -110) { // chapga surildi — bekor
      cleanup(); held = false; S.suppressTap = Date.now();
      if (S.rec) stopVoice(false); else if (S.roundRec) S.roundRec.finish(false);
      try { navigator.vibrate && navigator.vibrate(20); } catch(_){}
    }
  };
  const onUp = e => {
    S.pressing = false; clearTimeout(holdT); cleanup();
    if (!held) return;
    held = false; S.suppressTap = Date.now();
    if (e && e.type === "pointercancel") {
      // brauzer barmoqni "uzib" qo'ydi (masalan, ruxsat oynasi) — yozish davom etadi, tugma bilan yuboriladi
      if (S.rec && S.rec.hold) { S.rec.hold = false; renderComposer(); }
      if (S.roundRec && S.roundRec.lock) S.roundRec.lock();
      return;
    }
    if (S.rec && S.rec.hold) stopVoice(true);
    else if (S.roundRec && S.roundRec.hold) S.roundRec.finish(true);
  };
  const onTouchEnd = e => { if (e.touches && e.touches.length) return; onUp({type:"pointerup"}); };
  const cleanup = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp); window.removeEventListener("touchend", onTouchEnd); };
  b.addEventListener("pointerdown", e => {
    if (b.dataset.mode === "send") return;
    held = false; S.pressing = true; x0 = e.clientX;
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp); window.addEventListener("pointercancel", onUp); window.addEventListener("touchend", onTouchEnd);
    holdT = setTimeout(() => { held = true; ac(); if (b.dataset.mode === "voice") startVoice(true); else roundRecorder(true); }, 260);
  });
  b.addEventListener("click", () => {
    if (b.dataset.mode === "send") return send();
    if (held || Date.now() - (S.suppressTap || 0) < 700) return;
    // qisqa bosish: rejimni almashtirish
    S.roundMode = !S.roundMode; updateSendBtn();
    b.animate && b.animate([{transform:"scale(.75) rotate(-20deg)"}, {transform:"scale(1)"}], {duration:180, easing:"ease-out"});
    showTip(S.roundMode ? "Dumaloq video uchun bosib turing" : "Ovozli xabar uchun bosib turing");
  });
  b.addEventListener("contextmenu", e => e.preventDefault());
  b.style.touchAction = "none"; b.style.webkitUserSelect = "none"; b.style.userSelect = "none";
}
function autosize(ta){ ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; }

/* ---------- messages render ---------- */
function currentMsgs(){
  const pend = (S.pending[S.active] || []).filter(p => !S.msgs.some(m => m.id === p.id));
  return pend.length ? [...S.msgs, ...pend].sort((a, b) => a.at - b.at) : S.msgs;
}
function seenBy(m){ const c = getChat(m.chat_id); if (!c) return false; return Object.entries(c.reads || {}).some(([u, at]) => u !== S.me && at >= m.at - 1000); }
function mediaHtml(m){
  const md = m.media || []; const k = m.kind;
  const up = m.uploading ? '<div class="upl"><div class="spin"></div></div>' : "";
  if (k === "photo" || k === "video") {
    const n = Math.min(md.length, 10);
    return `<div class="album n${n}">` + md.slice(0, 10).map((x, i) => {
      const isV = x.type === "video";
      const ratio = n === 1 && x.w && x.h ? `style="aspect-ratio:${Math.max(.5, Math.min(2.2, x.w / x.h))}"` : "";
      const inner = isV && !x.poster ? `<video src="${esc(x.url)}#t=0.1" muted playsinline preload="metadata"></video>` : `<img src="${esc(isV ? x.poster : x.url)}" alt="" loading="lazy" onerror="this.style.opacity=.2">`;
      return `<div class="cell" ${ratio} data-view="${esc(m.id)}" data-i="${i}">${inner}${isV ? `<div class="playov"><i>${IC.play}</i></div>${x.dur ? `<span class="dur">${fmtDur(x.dur)}</span>` : ""}` : ""}${up}</div>`;
    }).join("") + `</div>`;
  }
  if (k === "round") {
    const x = md[0] || {};
    return `<div class="roundv" data-round="${esc(m.id)}"><video src="${esc(x.url)}" ${x.poster ? `poster="${esc(x.poster)}"` : ""} playsinline preload="metadata"></video>
      <svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2.5" stroke-dasharray="301.6" stroke-dashoffset="301.6" transform="rotate(-90 50 50)" class="rp"/></svg>
      ${up || `<span class="mute">${x.dur ? fmtDur(x.dur) + " · " : ""}🔈</span>`}</div>`;
  }
  if (k === "voice") {
    const x = md[0] || {}; const playing = S.audio && S.audio.mid === m.id && !S.audio.el.paused;
    let wave = Array.isArray(x.wave) && x.wave.length ? x.wave : null;
    if (wave && Math.max(...wave) - Math.min(...wave) < 6) wave = null;          // tekis chiziq — qayta hisoblaymiz
    if (!wave && x.url && !m.uploading) { wave = (S.waveCache || {})[x.url] || null; if (!wave) fixWave(x.url); }
    if (!wave) { let h = hash(x.url || m.id); wave = []; for (let i = 0; i < 32; i++) { h = (h * 1103515245 + 12345) >>> 0; wave.push(20 + (h % 80)); } }
    const wv = wave.slice(0, 48).map(v => `<i style="height:${Math.max(10, Math.min(100, v))}%"></i>`).join("");
    return `<div class="voice" data-voice="${esc(m.id)}"><button class="pbtn" aria-label="Eshitish">${m.uploading ? '<div class="spin" style="width:24px;height:24px;border-width:2px"></div>' : playing ? IC.pause : IC.play}</button><div style="flex:1;min-width:0"><div class="wv">${wv}</div><div class="vt">${fmtDur(x.dur)}</div></div></div>`;
  }
  if (k === "file") {
    const x = md[0] || {};
    return `<div class="filebox" data-file="${esc(m.id)}"><div class="fi">${m.uploading ? '<div class="spin" style="width:24px;height:24px;border-width:2px"></div>' : IC.file}</div><div style="min-width:0"><div class="fn">${esc(x.name || "Fayl")}</div><div class="fs">${x.size ? fmtSize(x.size) : ""}</div></div></div>`;
  }
  if (k === "sticker") {
    const x = md[0];
    return x && x.url ? `<img class="sticker-img" src="${esc(x.url)}" alt="stiker">` : `<div class="sticker-emoji">${esc(m.text || "🙂")}</div>`;
  }
  if (k === "call") {
    const x = md[0] || {}; const missed = x.status === "missed";
    const own = m.from === S.me;
    return `<div class="callmsg" data-recall="${x.video ? "v" : "a"}"><div class="ci2">${x.video ? IC.video : IC.phone}</div><div><div style="font-weight:500">${own ? "Chiquvchi" : "Kiruvchi"} ${x.video ? "video qo'ng'iroq" : "qo'ng'iroq"}</div><div class="cs ${missed ? "miss" : ""}">${missed ? (own ? "Javob berilmadi" : "O'tkazib yuborilgan") : fmtDur(x.dur)}</div></div></div>`;
  }
  return "";
}
function fixWave(url){
  S.waveCache = S.waveCache || {}; S.waveBusy = S.waveBusy || {};
  if (S.waveBusy[url] || /^blob:/.test(url)) return; S.waveBusy[url] = true;
  fetch(url).then(r => r.blob()).then(b => waveFromBlob(b)).then(w => { if (w) { S.waveCache[url] = w; renderMsgs(false); } }).catch(() => {});
}
function msgHtml(m, i, list, c){
  const dk = dayKey(m.at);
  const own = m.from === S.me;
  const next = list[i + 1], prevM = list[i - 1];
  const tail = !next || next.from !== m.from || dayKey(next.at) !== dk || next.at - m.at > 5*60e3;
  const head = !prevM || prevM.from !== m.from || dayKey(prevM.at) !== dk || m.at - prevM.at > 5*60e3;
  const k = m.kind || "text";
  const isGroup = c && c.type === "group";
  const big = k === "text" && isEmojiOnly(m.text) && !m.reply_to && !m.fwd_from;
  const mediaOnly = (k === "photo" || k === "video") && !m.text && !m.reply_to && !m.fwd_from;
  const round = k === "round", stk = k === "sticker";
  const status = own ? (m.pending || m.uploading ? IC.clock : (c && c.type === "saved") || seenBy(m) ? IC.checks : IC.check) : "";
  const fromLine = isGroup && !own && head && !big && !round && !stk ? `<div class="from" style="color:${COLORS[hash(m.from) % COLORS.length][1]}">${esc(nameOf(m.from))}</div>` : "";
  const fwd = m.fwd_from ? `<div class="fwd">↪ ${esc(nameOf(m.fwd_from))}dan uzatildi</div>` : "";
  const rq = m.reply_to ? `<div class="rq" data-jump="${esc(m.reply_to.id)}"><b>${esc(nameOf(m.reply_to.from))}</b>${esc(m.reply_to.text)}</div>` : "";
  const avatar = isGroup && !own ? userAvatar(m.from, "sm") : "";
  const rx = Object.entries(m.reactions || {}).filter(([, v]) => Array.isArray(v) && v.length);
  const rxHtml = rx.length ? `<div class="reacts">${rx.map(([e, v]) => `<button data-react="${esc(e)}" class="${v.includes(S.me) ? "mine" : ""}">${esc(e)} ${v.length > 1 ? v.length : ""}</button>`).join("")}</div>` : "";
  const text = m.text && !stk ? (k === "text" ? (big ? esc(m.text) : linkify(m.text)) : `<div class="cap">${linkify(m.text)}</div>`) : "";
  const tm = `<span class="tm">${m.edited ? "tahrirlangan " : ""}${hm(m.at)}${status}</span>`;
  const cls = big ? "big" : mediaOnly ? "media-only" : round ? "round" : stk ? "stk" : "";
  return `<div class="m ${own ? "own" : ""} ${tail ? "tail" : ""}" data-mid="${esc(m.id)}">${avatar}<div class="b ${cls}">${fromLine}${fwd}${rq}${mediaHtml(m)}${text}${tm}${rxHtml}</div></div>`;
}
function patchWrap(wrap, items){
  [...wrap.children].forEach(el => { if (!el.dataset.k) el.remove(); });
  const old = new Map([...wrap.children].map(el => [el.dataset.k, el]));
  let prev = null;
  for (const {key, html} of items) {
    let el = old.get(key);
    if (el && el._h === html) old.delete(key);
    else {
      const t = document.createElement("template"); t.innerHTML = html.trim();
      const n = t.content.firstElementChild; n.dataset.k = key; n._h = html;
      if (el) { old.delete(key); el.replaceWith(n); }
      el = n;
    }
    const ref = prev ? prev.nextSibling : wrap.firstChild;
    if (el !== ref) wrap.insertBefore(el, ref);
    prev = el;
  }
  old.forEach(el => el.remove());
}
function renderMsgs(scrollBottom, keepAnchor){
  const wrap = $("#wrap"); if (!wrap) return;
  const box = $("#msgs"); const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 140;
  const prevH = box.scrollHeight, prevTop = box.scrollTop;
  let list = currentMsgs(); const c = getChat(S.active);
  if (S.loadingMsgs && !list.length) { wrap.innerHTML = '<div class="empty-chat">Yuklanmoqda…</div>'; return; }
  if (S.search) { const q = S.search.toLowerCase(); list = list.filter(m => preview(m).toLowerCase().includes(q)); if ($("#sres")) $("#sres").textContent = list.length + " ta"; }
  else if ($("#sres")) $("#sres").textContent = "";
  if (!list.length) { wrap.innerHTML = `<div class="empty-chat">${S.search ? "Hech narsa topilmadi" : c && c.type === "saved" ? "Bu yerga xabarlar saqlang: eslatma, rasm, ovozli xabar. Chatdagi xabarni bosib turib «Saqlanganlarga» ni tanlasangiz ham shu yerga tushadi." : "Hali xabar yo'q.<br>Birinchi bo'lib salom bering 👋"}</div>`; return; }
  const items = []; let lastDay = "";
  if (S.hasMore && !S.search) items.push({key:"more", html:`<button class="more-btn" id="moreBtn">${S.loadingMsgs ? "Yuklanmoqda…" : "Oldingi xabarlar"}</button>`});
  list.forEach((m, i) => {
    const dk = dayKey(m.at);
    if (dk !== lastDay) { items.push({key:"d" + dk, html:`<div class="day">${dayLabel(m.at)}</div>`}); lastDay = dk; }
    items.push({key:"m" + m.id, html:msgHtml(m, i, list, c)});
  });
  patchWrap(wrap, items);
  const mb = $("#moreBtn"); if (mb) mb.onclick = loadOlder;
  if (keepAnchor) box.scrollTop = prevTop + (box.scrollHeight - prevH);
  else if (scrollBottom || atBottom) box.scrollTop = box.scrollHeight;
}
function jumpTo(id){
  const t = document.querySelector(`.m[data-mid="${CSS.escape(id)}"]`);
  if (!t) return toast("Xabar topilmadi (eskiroq bo'lishi mumkin — yuqoriga aylantiring)");
  t.scrollIntoView({block:"center", behavior:"smooth"}); t.classList.add("flash"); setTimeout(() => t.classList.remove("flash"), 1200);
}

/* ---------- open / load ---------- */
async function openChat(id){
  stopAudio(); stopTyping();
  S.active = id; S.msgs = []; S.hasMore = false; S.reply = null; S.editing = null; S.search = null; S.roundMode = false;
  $("#app").classList.add("open"); closePanel();
  S.unread[id] = 0;
  renderChat(); renderList();
  await reloadMsgs();
  markRead(id);
}
async function reloadMsgs(){
  const id = S.active; if (!id) return;
  S.loadingMsgs = true; renderMsgs(true);
  const { data, error } = await sb.from("messages").select("*").eq("chat_id", id).order("created_at", {ascending:false}).limit(PAGE);
  if (S.active !== id) return;
  S.loadingMsgs = false;
  if (error) { const w = $("#wrap"); if (w) w.innerHTML = '<div class="empty-chat">Xabarlarni yuklab bo\'lmadi. Internetni tekshiring.</div>'; return; }
  S.msgs = (data || []).reverse().map(norm); S.hasMore = (data || []).length === PAGE;
  loadProfiles(S.msgs.map(m => m.from).concat(S.msgs.map(m => m.fwd_from)));
  renderMsgs(true);
}
async function loadOlder(){
  if (S.loadingMsgs || !S.hasMore || !S.msgs.length) return;
  const id = S.active; S.loadingMsgs = true; renderMsgs(false, true);
  const { data } = await sb.from("messages").select("*").eq("chat_id", id).lt("created_at", S.msgs[0].created_at).order("created_at", {ascending:false}).limit(PAGE);
  if (S.active !== id) return;
  S.loadingMsgs = false;
  const older = (data || []).reverse().map(norm).filter(m => !S.msgs.some(x => x.id === m.id));
  S.msgs = [...older, ...S.msgs]; S.hasMore = (data || []).length === PAGE;
  loadProfiles(older.map(m => m.from));
  renderMsgs(false, true);
}
function closeChat(){
  $("#app").classList.remove("open"); stopAudio(); stopTyping();
  setTimeout(() => { if (!$("#app").classList.contains("open") && innerWidth <= 760) { S.active = null; renderChat(); renderList(); } }, 260);
}
let readT = null;
function markRead(id){
  if (!id || document.hidden) return;
  S.unread[id] = 0; renderList();
  clearTimeout(readT);
  readT = setTimeout(async () => { try { await sb.from("members").update({last_read:new Date().toISOString()}).eq("chat_id", id).eq("user_id", S.me); } catch(e){} }, 600);
}

/* ---------- send text ---------- */
function replyRef(){ return S.reply ? {id:S.reply.id, from:S.reply.from, text:preview(S.reply).slice(0, 120)} : null; }
function addPending(cid, m){ (S.pending[cid] ||= []).push(m); if (S.active === cid) renderMsgs(true); }
function dropPending(cid, id, silent){ S.pending[cid] = (S.pending[cid] || []).filter(p => p.id !== id); if (!silent && S.active === cid) renderMsgs(false); }
async function insertMsg(cid, body, local){
  const id = local ? local.id : uuid();
  const row = {id, chat_id:cid, from_id:S.me, kind:body.kind || "text", text:body.text || null, media:body.media || null, reply_to:body.reply_to || null, fwd_from:body.fwd_from || null};
  const { error } = await sb.from("messages").insert(row);
  if (error) throw error;
  return id;
}
async function send(){
  const ta = $("#ta"); if (!ta) return;
  const text = ta.value.replace(/\s+$/, "").replace(/^\n+/, "");
  const cid = S.active;
  if (S.editing) {
    const m = S.editing; S.editing = null; renderComposer();
    if (text === (m.text || "") || (!text && (m.kind || "text") === "text")) return;
    const { error } = await sb.from("messages").update({text, edited:true}).eq("id", m.id);
    if (error) toast("Tahrirlab bo'lmadi");
    return;
  }
  if (!text.trim()) return;
  if (text.length > 4096) return toast("Xabar juda uzun (4096 belgigacha)");
  const local = {id:uuid(), chat_id:cid, from:S.me, from_id:S.me, kind:"text", text, at:Date.now(), created_at:new Date().toISOString(), reply_to:replyRef(), pending:true, reactions:{}};
  S.reply = null; S.draft[cid] = ""; renderComposer(); stopTyping();
  addPending(cid, local);
  sentSound();
  try { await insertMsg(cid, local, local); }
  catch(e){ dropPending(cid, local.id); toast("Xabar yuborilmadi. Internetni tekshiring."); S.draft[cid] = text; renderComposer(); }
}

/* ---------- media prep & upload ---------- */
function loadImg(url){ return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; }); }
const canvasBlob = (cv, type, q) => new Promise(res => cv.toBlob(b => res(b), type, q));
async function prepImage(file, max = 2048){
  if (file.type === "image/gif") return {blob:file, type:"image/gif", ext:"gif", w:0, h:0};
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url);
    let w = img.naturalWidth, h = img.naturalHeight; const k = Math.min(1, max / Math.max(w, h)); w = Math.round(w * k); h = Math.round(h * k);
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.getContext("2d").drawImage(img, 0, 0, w, h);
    const blob = await canvasBlob(cv, "image/jpeg", 0.86); if (!blob) throw 0;
    return {blob, type:"image/jpeg", ext:"jpg", w, h};
  } catch(e){ return {blob:file, type:file.type || "image/jpeg", ext:(file.name || "x.jpg").split(".").pop(), w:0, h:0}; }
  finally { setTimeout(() => URL.revokeObjectURL(url), 5000); }
}
function videoMime(file){ return /webm/.test(file.type) ? "video/webm" : "video/mp4"; }
async function videoInfo(file, square){
  const out = {w:0, h:0, dur:0, poster:null};
  const url = URL.createObjectURL(file);
  try {
    const v = document.createElement("video"); v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = url;
    await new Promise((res, rej) => { v.onloadeddata = res; v.onerror = rej; setTimeout(res, 5000); });
    out.w = v.videoWidth; out.h = v.videoHeight; out.dur = isFinite(v.duration) ? v.duration : 0;
    try { v.currentTime = Math.min(0.15, (out.dur || 1) / 2); await new Promise(res => { v.onseeked = res; setTimeout(res, 2500); }); } catch(e){}
    if (v.videoWidth) out.poster = await frameBlob(v, square);
  } catch(e){} finally { setTimeout(() => URL.revokeObjectURL(url), 5000); }
  return out;
}
async function frameBlob(v, square, mirror){
  const cv = document.createElement("canvas"); const ctx = cv.getContext("2d");
  if (square) { const s = Math.min(v.videoWidth, v.videoHeight), d = 480; cv.width = cv.height = d; if (mirror) { ctx.translate(d, 0); ctx.scale(-1, 1); } ctx.drawImage(v, (v.videoWidth - s) / 2, (v.videoHeight - s) / 2, s, s, 0, 0, d, d); }
  else { const k = Math.min(1, 720 / Math.max(v.videoWidth, v.videoHeight)); cv.width = Math.round(v.videoWidth * k); cv.height = Math.round(v.videoHeight * k); ctx.drawImage(v, 0, 0, cv.width, cv.height); }
  return canvasBlob(cv, "image/jpeg", 0.75);
}
async function mediaDur(blob){
  const url = URL.createObjectURL(blob);
  try { const a = document.createElement(blob.type.startsWith("video") ? "video" : "audio"); a.preload = "metadata"; a.src = url;
    await new Promise(r => { a.onloadedmetadata = r; a.onerror = r; setTimeout(r, 4000); });
    if (a.duration === Infinity) { a.currentTime = 1e7; await new Promise(r => { a.ontimeupdate = r; setTimeout(r, 1500); }); }
    return isFinite(a.duration) ? a.duration : 0;
  } catch(e){ return 0; } finally { setTimeout(() => URL.revokeObjectURL(url), 3000); }
}
async function upload(blob, ext, type){
  if (blob.size > MAX) throw {code:"too_large"};
  const path = `${S.me}/${uuid()}.${(ext || "bin").replace(/[^a-z0-9]/gi, "").slice(0, 6) || "bin"}`;
  const { error } = await sb.storage.from("media").upload(path, blob, {contentType:type || blob.type || "application/octet-stream", cacheControl:"31536000", upsert:false});
  if (error) throw error;
  return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
}
function uploadErr(e){
  const m = String((e && (e.message || e.code)) || "");
  toast(/too_large|exceeded|Payload too large|413/i.test(m) ? "Fayl juda katta: 50 MB gacha" : /mime|type/i.test(m) ? "Bu fayl turini yuborib bo'lmaydi" : "Yuklab bo'lmadi. Internetni tekshiring.");
}
/* kind: photo | video | round | voice | file | sticker */
async function sendMedia(kind, files, opts = {}){
  const cid = opts.cid || S.active; if (!cid) return;
  const big = files.find(f => f.size > MAX * 3 || (f.size > MAX && !(f.type || "").startsWith("image/")));
  if (big) return toast("Fayl juda katta: 50 MB gacha");
  const caption = (opts.caption || "").trim();
  const id = uuid();
  const media = [];
  const local = {id, chat_id:cid, from:S.me, from_id:S.me, kind, text:caption || null, at:Date.now(), created_at:new Date().toISOString(), reply_to:replyRef(), uploading:true, reactions:{},
    media:files.map(f => { const isV = (f.type || "").startsWith("video") || kind === "round"; return {url:URL.createObjectURL(f), type: kind === "photo" || kind === "video" ? (isV ? "video" : "image") : kind, name:f.name, size:f.size, dur:opts.dur, wave:opts.wave}; })};
  S.reply = null; if (S.active === cid) renderComposer();
  addPending(cid, local); sentSound();
  try {
    for (const f of files) {
      const isVid = (f.type || "").startsWith("video/") || /\.(mov|mp4|m4v|webm)$/i.test(f.name || "");
      if (kind === "photo" || kind === "video") {
        if (isVid) { const v = await videoInfo(f, false); const mt = videoMime(f); const url = await upload(f, mt === "video/webm" ? "webm" : "mp4", mt); const poster = v.poster ? await upload(v.poster, "jpg", "image/jpeg").catch(() => null) : null; media.push({url, type:"video", w:v.w, h:v.h, dur:Math.round(v.dur), poster, size:f.size}); }
        else { const p = await prepImage(f); const url = await upload(p.blob, p.ext, p.type); media.push({url, type:"image", w:p.w, h:p.h, size:p.blob.size}); }
      } else if (kind === "round") {
        const v = opts.poster ? {dur:opts.dur, poster:opts.poster} : await videoInfo(f, true); const mt = videoMime(f);
        const url = await upload(f, mt === "video/webm" ? "webm" : "mp4", mt);
        const poster = v.poster ? await upload(v.poster, "jpg", "image/jpeg").catch(() => null) : null;
        media.push({url, type:"round", dur:Math.round(v.dur || opts.dur || 0), poster, size:f.size});
      } else if (kind === "voice") {
        const t = f.type || "audio/webm"; const dur = opts.dur || await mediaDur(f);
        const url = await upload(f, /mp4|m4a|aac/.test(t) ? "m4a" : /ogg/.test(t) ? "ogg" : "webm", t.split(";")[0]);
        media.push({url, type:"voice", dur:Math.round(dur), size:f.size, wave:opts.wave || null, mime:t.split(";")[0]});
      } else {
        const ext = (f.name || "fayl").split(".").pop().toLowerCase();
        const url = await upload(f, ext, f.type); media.push({url, type:"file", name:(f.name || "fayl").slice(0, 120), size:f.size, mime:f.type});
      }
    }
    let k2 = kind;
    if (kind === "photo" || kind === "video") k2 = media.every(x => x.type === "video") ? "video" : "photo";
    await insertMsg(cid, {kind:k2, text:caption, media, reply_to:local.reply_to}, local);
    local.uploading = false;
  } catch(e){ dropPending(cid, id); uploadErr(e); }
}
function pick(id, handler, accept){
  const inp = $("#" + id); inp.value = ""; if (accept !== undefined) inp.accept = accept;
  inp.onchange = () => { const fs = [...inp.files]; inp.value = ""; if (fs.length) handler(fs); };
  inp.click();
}
function takeCaption(){ const ta = $("#ta"); if (!ta) return ""; const v = ta.value; S.draft[S.active] = ""; ta.value = ""; autosize(ta); updateSendBtn(); return v; }
function attachMenu(e){
  const r = e.currentTarget.getBoundingClientRect();
  showMenu([
    ["camera", "Rasmga olish", () => pick("fPhotoCam", fs => sendMedia("photo", fs, {caption:takeCaption()}))],
    ["image", "Galereya", () => pick("fGallery", fs => { const cap = takeCaption(); for (let i = 0; i < fs.length; i += 10) sendMedia("photo", fs.slice(i, i + 10), {caption: i === 0 ? cap : ""}); })],
    ["video", "Video yozish", () => pick("fVideo", fs => sendMedia("video", fs, {caption:takeCaption()}))],
    ["selfie", "Video selfi", () => pick("fSelfie", fs => sendMedia("video", fs, {caption:takeCaption()}))],
    ["round", "Dumaloq video", () => roundRecorder(false)],
    ["mic", "Ovozli xabar", () => startVoice(false)],
    ["sticker", "Stikerlar", () => togglePanel("stk")],
    ["file", "Fayl", () => pick("fFile", fs => fs.forEach(f => sendMedia("file", [f])), "")]
  ], r.right - 220, r.top - 390);
}

/* ---------- voice recording ---------- */
function pickMime(list){ if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return ""; return list.find(t => MediaRecorder.isTypeSupported(t)) || ""; }
/* Yozilgan ovozdan haqiqiy to'lqin (40 ta ustun) */
async function waveFromBlob(blob, n = 40){
  let ctx = null;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const data = await blob.arrayBuffer();
    const ab = await new Promise((res, rej) => { const p = ctx.decodeAudioData(data, res, rej); if (p && p.then) p.then(res, rej); });
    const d = ab.getChannelData(0); const step = Math.max(1, Math.floor(d.length / n)); const peaks = [];
    for (let i = 0; i < n; i++) { let sum = 0, cnt = 0; for (let j = i * step; j < Math.min(d.length, (i + 1) * step); j += 4) { sum += d[j] * d[j]; cnt++; } peaks.push(Math.sqrt(sum / Math.max(1, cnt))); }
    const mx = Math.max(...peaks, 1e-4);
    return peaks.map(p => Math.round(12 + 88 * Math.pow(p / mx, 0.7)));
  } catch(e){ return null; } finally { try { ctx && ctx.close(); } catch(e){} }
}
function wavePad(levels, n = 40){
  const L = levels.length; if (!L || Math.max(...levels) < 0.002) return null;
  const out = []; for (let i = 0; i < n; i++) { const sl = levels.slice(Math.floor(i * L / n), Math.max(Math.floor((i + 1) * L / n), Math.floor(i * L / n) + 1)); out.push(Math.max(...sl)); }
  const mx = Math.max(...out, 1e-4); return out.map(p => Math.round(12 + 88 * Math.pow(p / mx, 0.7)));
}
async function startVoice(hold){
  if (S.rec) return;
  if (!navigator.mediaDevices || !window.MediaRecorder) return toast("Bu brauzer ovoz yozishni qo'llamaydi");
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true}}); }
  catch(e){ return toast("Mikrofonga ruxsat bering: brauzer sozlamalarida shu sayt uchun mikrofonni yoqing"); }
  if (hold && !S.pressing) { hold = false; toast("Yozilmoqda — tugatgach ➤ ni bosing"); }
  const mime = pickMime(["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"]);
  const rec = new MediaRecorder(stream, mime ? {mimeType:mime, audioBitsPerSecond:64000} : undefined);
  const chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  // har bir yozuv uchun yangi o'lchagich (iPhone'da eskisi "uxlab" qoladi)
  let mctx = null, an = null, src = null, fbuf = null; const levels = [];
  try {
    mctx = new (window.AudioContext || window.webkitAudioContext)();
    if (mctx.state === "suspended") mctx.resume().catch(() => {});
    src = mctx.createMediaStreamSource(stream); an = mctx.createAnalyser(); an.fftSize = 1024; src.connect(an);
    fbuf = new Float32Array(an.fftSize);
  } catch(e){ an = null; }
  S.rec = {rec, stream, chunks, start:Date.now(), send:false, hold, levels};
  rec.onstop = async () => {
    stream.getTracks().forEach(t => t.stop());
    try { src && src.disconnect(); mctx && mctx.close(); } catch(e){}
    const r = S.rec; S.rec = null; clearInterval(r.tick); renderComposer(); stopTyping();
    if (!r.send) return;
    const dur = (Date.now() - r.start) / 1000;
    if (dur < 0.7) return toast("Juda qisqa — bosib turib gapiring");
    const type = (rec.mimeType || mime || "audio/webm").split(";")[0];
    const blob = new Blob(chunks, {type});
    const wave = (await waveFromBlob(blob)) || wavePad(r.levels) || null;
    sendMedia("voice", [new File([blob], "ovoz." + (type.includes("mp4") ? "m4a" : "webm"), {type})], {dur, wave});
  };
  rec.start(200);
  renderComposer();
  let phase = 0;
  S.rec.tick = setInterval(() => {
    if (!S.rec) return;
    const e = $("#rt"); if (e) e.textContent = fmtDur((Date.now() - S.rec.start) / 1000);
    let lvl = 0;
    if (an) { try { if (mctx.state === "suspended") mctx.resume().catch(() => {}); an.getFloatTimeDomainData(fbuf); let sum = 0; for (let k = 0; k < fbuf.length; k++) sum += fbuf[k] * fbuf[k]; lvl = Math.sqrt(sum / fbuf.length); } catch(_){} }
    levels.push(lvl);
    // o'lchagich jim bo'lsa ham "yozilyapti" ekani ko'rinsin
    const shown = lvl > 0.002 ? Math.min(26, 4 + Math.sqrt(lvl) * 70) : 4 + 6 * Math.abs(Math.sin(phase += 0.5));
    const lv = $("#lvl"); if (lv) { const i = document.createElement("i"); i.style.height = shown + "px"; lv.appendChild(i); while (lv.children.length > 80) lv.firstChild.remove(); }
    typing(true);
    if (Date.now() - S.rec.start > 15 * 60e3) stopVoice(true);
  }, 100);
  try { navigator.vibrate && navigator.vibrate(15); } catch(e){}
}
function stopVoice(send){ if (!S.rec) return; S.rec.send = send; try { S.rec.rec.stop(); } catch(e){ S.rec = null; renderComposer(); } }

/* ---------- round video recorder ---------- */
async function roundRecorder(hold){
  if (S.roundRec) return;
  if (!navigator.mediaDevices || !window.MediaRecorder) return pick("fRound", fs => sendMedia("round", fs.slice(0, 1)));
  let facing = "user", stream;
  const getStream = () => navigator.mediaDevices.getUserMedia({video:{facingMode:facing, width:{ideal:640}, height:{ideal:640}}, audio:{echoCancellation:true, noiseSuppression:true}});
  try { stream = await getStream(); } catch(e){ toast("Kameraga ruxsat bering"); return; }
  const ov = document.createElement("div"); ov.className = "recov";
  ov.innerHTML = `<div class="circ" id="rcirc"><video autoplay playsinline muted></video><svg class="ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48.5" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="304.7" stroke-dashoffset="304.7" transform="rotate(-90 50 50)" id="rring"/></svg></div>
    <div class="rtime" id="rtime">0:00 / 1:00</div>${hold ? `<div id="rhint" style="color:rgba(255,255,255,.75);font-size:14px;text-align:center;margin-top:-14px">Qo'yib yuborsangiz — yuboriladi<br>‹ Chapga suring — bekor</div>` : ""}
    <div class="rbtns"><button id="rcan" aria-label="Bekor qilish">${IC.x}</button><button class="big" id="rgo" aria-label="Yozish">${IC.round}</button><button id="rflip" aria-label="Kamerani almashtirish">${IC.flip}</button></div>`;
  document.body.appendChild(ov);
  const v = ov.querySelector("video"); v.srcObject = stream;
  const mime = pickMime(["video/mp4;codecs=avc1,mp4a", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]);
  let rec = null, chunks = [], t0 = 0, tick = null, poster = null;
  const R = S.roundRec = {hold};
  const lockRound = () => { if (!R.hold) return; R.hold = false; const h = ov.querySelector("#rhint"); if (h) h.innerHTML = "Yuborish uchun ■ ni bosing"; };
  R.lock = lockRound;
  const cleanup = () => { clearInterval(tick); stream.getTracks().forEach(t => t.stop()); ov.remove(); S.roundRec = null; stopTyping(); S.roundMode = false; updateSendBtn(); };
  const begin = async () => {
    if (rec) return;
    rec = new MediaRecorder(stream, mime ? {mimeType:mime, videoBitsPerSecond:1000000} : undefined);
    chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.start(250); t0 = Date.now();
    ov.querySelector("#rgo").classList.add("rec"); ov.querySelector("#rgo").innerHTML = IC.stop;
    try { poster = await frameBlob(v, true, facing === "user"); } catch(e){}
    tick = setInterval(() => {
      const s = (Date.now() - t0) / 1000; ov.querySelector("#rtime").textContent = fmtDur(s) + " / 1:00";
      ov.querySelector("#rring").setAttribute("stroke-dashoffset", 304.7 * (1 - Math.min(1, s / 60)));
      typing(true);
      if (s >= 60) R.finish(true);
    }, 200);
  };
  R.finish = send => {
    if (!rec) { cleanup(); return; }
    const dur = (Date.now() - t0) / 1000;
    rec.onstop = () => {
      const type = (rec.mimeType || mime || "video/webm").split(";")[0];
      const blob = new Blob(chunks, {type});
      cleanup();
      if (!send) return;
      if (dur < 1) return toast("Juda qisqa");
      sendMedia("round", [new File([blob], "dumaloq." + (type.includes("mp4") ? "mp4" : "webm"), {type})], {dur, poster});
    };
    try { rec.stop(); } catch(e){ cleanup(); }
  };
  ov.querySelector("#rcan").onclick = () => R.finish(false);
  ov.querySelector("#rgo").onclick = () => { if (!rec) begin(); else R.finish(true); };
  ov.querySelector("#rflip").onclick = async () => {
    if (rec) return toast("Yozish paytida almashtirib bo'lmaydi");
    facing = facing === "user" ? "environment" : "user";
    stream.getTracks().forEach(t => t.stop());
    try { stream = await getStream(); v.srcObject = stream; ov.querySelector("#rcirc").classList.toggle("back", facing !== "user"); } catch(e){ toast("Kamerani almashtirib bo'lmadi"); }
  };
  if (hold) {
    v.play && v.play().catch(() => {});
    await new Promise(r => { if (v.readyState >= 2) return r(); v.onloadeddata = r; setTimeout(r, 1200); });
    if (S.roundRec !== R) return;            // bekor qilingan
    await begin();
    if (!S.pressing) lockRound();            // barmoq allaqachon qo'yib yuborilgan — ■ bilan yuboriladi
  }
}

/* ---------- playback ---------- */
function stopAudio(){ if (S.audio) { S.audio.el.pause(); const id = S.audio.mid; S.audio.el.remove(); S.audio = null; refreshVoice(id); } }
function refreshVoice(mid){
  const el = document.querySelector(`[data-voice="${CSS.escape(mid)}"]`); if (!el) return;
  const a = S.audio && S.audio.mid === mid ? S.audio.el : null;
  el.querySelector(".pbtn").innerHTML = a && !a.paused ? IC.pause : IC.play;
  const frac = a && a.duration && isFinite(a.duration) ? a.currentTime / a.duration : 0;
  const bars = el.querySelectorAll(".wv i"); bars.forEach((b, i) => b.classList.toggle("on", !!a && i / bars.length < frac));
  const m = currentMsgs().find(x => x.id === mid); const d = m && m.media && m.media[0] ? m.media[0].dur : 0;
  el.querySelector(".vt").textContent = a ? fmtDur(a.currentTime) + " / " + fmtDur(d || a.duration) : fmtDur(d);
}
function playVoice(mid, seekFrac){
  const m = currentMsgs().find(x => x.id === mid); if (!m || m.uploading) return;
  if (S.audio && S.audio.mid === mid) {
    const a = S.audio.el;
    if (seekFrac != null && a.duration && isFinite(a.duration)) { a.currentTime = a.duration * seekFrac; if (a.paused) a.play().catch(() => {}); }
    else if (a.paused) a.play().catch(() => toast("Eshittirib bo'lmadi")); else a.pause();
    return refreshVoice(mid);
  }
  stopAudio();
  const x = m.media[0];
  const a = document.createElement("audio"); a.setAttribute("playsinline", ""); a.src = x.url; a.preload = "auto";
  a.style.display = "none"; document.body.appendChild(a);
  S.audio = {mid, el:a};
  a.ontimeupdate = a.onplay = a.onpause = () => refreshVoice(mid);
  a.onended = () => { a.remove(); if (S.audio && S.audio.mid === mid) S.audio = null; refreshVoice(mid); const l = currentMsgs(); const i = l.findIndex(z => z.id === mid); const n = l[i + 1]; if (n && n.kind === "voice") playVoice(n.id); };
  a.onerror = () => { toast("Bu ovozli xabarni telefoningiz o'ynata olmadi"); a.remove(); S.audio = null; refreshVoice(mid); };
  if (seekFrac != null) a.addEventListener("loadedmetadata", () => { if (a.duration && isFinite(a.duration)) a.currentTime = a.duration * seekFrac; }, {once:true});
  a.play().catch(() => {});
  refreshVoice(mid);
}
function toggleRound(el){
  const v = el.querySelector("video"); if (!v) return;
  document.querySelectorAll(".roundv video").forEach(o => { if (o !== v && !o.paused) { o.pause(); o.currentTime = 0; } });
  const ring = el.querySelector(".rp"), lab = el.querySelector(".mute");
  document.querySelectorAll(".roundv.big").forEach(o => { if (o !== el) o.classList.remove("big"); });
  if (v.paused) {
    stopAudio(); v.muted = false; if (v.ended || !v.currentTime) v.currentTime = 0;
    el.classList.add("big");
    setTimeout(() => el.scrollIntoView({block:"nearest", behavior:"smooth"}), 260);
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
    v.ontimeupdate = () => { if (v.duration && isFinite(v.duration)) ring.setAttribute("stroke-dashoffset", 301.6 * (1 - v.currentTime / v.duration)); if (lab) lab.textContent = fmtDur(v.currentTime) + (v.muted ? " · 🔇" : " · 🔊"); };
    v.onended = () => { ring.setAttribute("stroke-dashoffset", 301.6); el.classList.remove("big"); v.currentTime = 0; };
  } else { v.pause(); el.classList.remove("big"); }
}

/* ---------- viewer & download ---------- */
function openViewer(mid, idx, mobj){
  const m = mobj || currentMsgs().find(x => x.id === mid); if (!m || !m.media || m.uploading) return;
  stopAudio();
  const items = m.media.filter(x => x.type === "image" || x.type === "video");
  let i = Math.min(idx, items.length - 1);
  const v = document.createElement("div"); v.className = "viewer"; document.body.appendChild(v);
  const draw = () => {
    const x = items[i];
    v.innerHTML = `<div class="vtop"><button class="icon-btn" data-a="x">${IC.back}</button><div class="vi"><b>${esc(nameOf(m.from))}</b><span>${dayLabel(m.at)}, ${hm(m.at)}${items.length > 1 ? ` · ${i + 1}/${items.length}` : ""}</span></div><button class="icon-btn" data-a="save" aria-label="Saqlash">${IC.save}</button>${m.id === "__img" ? "" : `<button class="icon-btn" data-a="fwd" aria-label="Uzatish">${IC.fwd}</button>`}</div>
      <div class="stage">${x.type === "video" ? `<video src="${esc(x.url)}" ${x.poster ? `poster="${esc(x.poster)}"` : ""} controls playsinline autoplay></video>` : `<img src="${esc(x.url)}" alt="">`}
      ${i > 0 ? `<button class="nav" data-a="prev" style="left:10px">${IC.left}</button>` : ""}${i < items.length - 1 ? `<button class="nav" data-a="next" style="right:10px">${IC.right}</button>` : ""}</div>
      ${m.text ? `<div class="vcap">${esc(m.text)}</div>` : ""}`;
  };
  draw();
  const close = () => { v.querySelectorAll("video").forEach(x => x.pause()); v.remove(); document.removeEventListener("keydown", key); };
  const key = e => { if (e.key === "Escape") close(); if (e.key === "ArrowLeft" && i > 0) { i--; draw(); } if (e.key === "ArrowRight" && i < items.length - 1) { i++; draw(); } };
  document.addEventListener("keydown", key);
  v.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    const act = a.dataset.a;
    if (act === "x") close(); else if (act === "prev") { i--; draw(); } else if (act === "next") { i++; draw(); }
    else if (act === "save") saveToDevice(items[i], m); else if (act === "fwd") { close(); forwardDlg(m); }
  });
  // Telegramdagidek: pastga/yuqoriga tortsa yopiladi, chapga/o'ngga surilsa keyingi rasm
  let sx = null, sy = null, dir = null;
  const media = () => v.querySelector(".stage img, .stage video");
  v.addEventListener("touchstart", e => { if (e.touches.length !== 1 || e.target.closest(".vtop,.nav")) { sx = null; return; } sx = e.touches[0].clientX; sy = e.touches[0].clientY; dir = null; const m = media(); if (m) m.style.transition = "none"; v.style.transition = "none"; }, {passive:true});
  v.addEventListener("touchmove", e => {
    if (sx == null) return;
    const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
    if (!dir && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) dir = Math.abs(dy) > Math.abs(dx) ? "v" : "h";
    if (dir === "v") { e.preventDefault(); const m = media(); if (m) m.style.transform = `translateY(${dy}px) scale(${1 - Math.min(Math.abs(dy) / 1500, .15)})`; v.style.background = `rgba(0,0,0,${Math.max(.15, .95 - Math.abs(dy) / 450)})`; v.querySelectorAll(".vtop,.vcap,.nav").forEach(x => x.style.opacity = Math.max(0, 1 - Math.abs(dy) / 150)); }
  }, {passive:false});
  v.addEventListener("touchend", e => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    const m = media();
    if (dir === "v") {
      if (Math.abs(dy) > 110) { if (m) { m.style.transition = "transform .2s ease-in"; m.style.transform = `translateY(${dy > 0 ? innerHeight : -innerHeight}px)`; } v.style.transition = "background .2s"; v.style.background = "rgba(0,0,0,0)"; setTimeout(close, 200); }
      else { if (m) { m.style.transition = "transform .2s ease-out"; m.style.transform = ""; } v.style.transition = "background .2s"; v.style.background = ""; v.querySelectorAll(".vtop,.vcap,.nav").forEach(x => x.style.opacity = ""); }
    } else if (dir === "h" && Math.abs(dx) > 60) { if (dx < 0 && i < items.length - 1) { i++; draw(); } else if (dx > 0 && i > 0) { i--; draw(); } }
  }, {passive:true});
}
async function saveToDevice(x, m){
  const ext = x.type === "file" ? "" : (x.url.split("?")[0].split(".").pop() || "bin");
  const name = x.type === "file" && x.name ? x.name : `hikmat-${x.type === "image" ? "rasm" : x.type === "voice" ? "ovoz" : "video"}-${new Date(m.at).toISOString().slice(0, 19).replace(/[:T]/g, "-")}.${ext}`;
  try {
    toast("Yuklanmoqda…");
    const res = await fetch(x.url); if (!res.ok) throw 0;
    const blob = await res.blob();
    const file = new File([blob], name, {type:blob.type});
    if (navigator.canShare && navigator.canShare({files:[file]}) && /iPhone|iPad|Android/i.test(navigator.userAgent)) {
      try { await navigator.share({files:[file]}); return; } catch(e){ if (e && e.name === "AbortError") return; }
    }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    toast("Saqlandi ✅");
  } catch(e){ toast("Saqlab bo'lmadi"); }
}

/* ---------- message actions ---------- */
async function delMsg(m){
  if (!await confirmDlg("Xabarni o'chirish", "Bu xabar hamma uchun o'chiriladi.", "O'chirish")) return;
  const { error } = await sb.from("messages").delete().eq("id", m.id);
  if (error) return toast("O'chirib bo'lmadi");
  S.msgs = S.msgs.filter(x => x.id !== m.id); renderMsgs(false);
  if (!m.fwd_from && m.kind !== "sticker") {
    const paths = []; (m.media || []).forEach(x => { [x.url, x.poster].forEach(u => { const p = storagePath(u); if (p && p.startsWith(S.me + "/")) paths.push(p); }); });
    if (paths.length) sb.storage.from("media").remove(paths).catch(() => {});
  }
  const c = getChat(m.chat_id);
  if (c && ts(c.last_at) <= m.at + 2000) {
    const last = S.msgs[S.msgs.length - 1];
    await sb.from("chats").update(last ? {last_text:preview(last).slice(0, 120), last_at:last.created_at, last_from:last.from} : {last_text:""}).eq("id", c.id);
  }
}
async function react(m, e){
  const r = {...(m.reactions || {})};
  for (const k of Object.keys(r)) if (k !== e && (r[k] || []).includes(S.me)) r[k] = r[k].filter(x => x !== S.me);
  const cur = r[e] || []; r[e] = cur.includes(S.me) ? cur.filter(x => x !== S.me) : [...cur, S.me];
  for (const k of Object.keys(r)) if (!r[k].length) delete r[k];
  m.reactions = r; renderMsgs(false);
  const { error } = await sb.from("messages").update({reactions:r}).eq("id", m.id);
  if (error) toast("Bo'lmadi");
}
async function pinMsg(m){ const { error } = await sb.from("chats").update({pinned:{id:m.id, text:preview(m).slice(0, 120)}}).eq("id", m.chat_id); toast(error ? "Qadab bo'lmadi" : "Xabar qadaldi 📌"); }
function forwardDlg(m){
  dialog(`<h3>Kimga uzatamiz?</h3><div class="ulist" id="fl"></div><div class="acts"><button data-a="no">Bekor qilish</button></div>`, (v, close) => {
    v.querySelector('[data-a="no"]').onclick = close;
    const fl = v.querySelector("#fl");
    S.chats.forEach(c => {
      const d = document.createElement("div"); d.className = "item";
      d.innerHTML = `${avatarHtml(c, "sm")}<div class="meta"><div class="name"></div></div>`;
      d.querySelector(".name").textContent = chatTitle(c);
      d.onclick = async () => {
        close();
        try { sentSound(); await insertMsg(c.id, {kind:m.kind, text:m.text, media:m.media, fwd_from:m.fwd_from || m.from}); toast(c.type === "saved" ? "Saqlanganlarga qo'shildi ✅" : "Uzatildi ✅"); } catch(e){ toast("Uzatib bo'lmadi"); }
      };
      fl.appendChild(d);
    });
  });
}

/* ---------- context menu & clicks ---------- */
let pressT = null, pressMoved = false;
document.addEventListener("contextmenu", e => { const mm = e.target.closest(".m"); if (mm && !e.target.closest("a")) { e.preventDefault(); msgMenu(mm, e.clientX, e.clientY); } });
document.addEventListener("touchstart", e => { const mm = e.target.closest(".m"); if (!mm) return; pressMoved = false; const t = e.touches[0]; pressT = setTimeout(() => { if (pressMoved) return; try { navigator.vibrate && navigator.vibrate(10); } catch(_){} S.justPressed = Date.now(); msgMenu(mm, t.clientX, t.clientY); }, 450); }, {passive:true});
document.addEventListener("touchmove", () => { pressMoved = true; clearTimeout(pressT); }, {passive:true});
["touchend","touchcancel"].forEach(ev => document.addEventListener(ev, () => clearTimeout(pressT), {passive:true}));
document.addEventListener("click", e => {
  if (S.justPressed && Date.now() - S.justPressed < 600) return;
  const j = e.target.closest("[data-jump]"); if (j) return jumpTo(j.dataset.jump);
  const rb = e.target.closest("[data-react]"); if (rb) { const mm = rb.closest(".m"); const m = currentMsgs().find(x => x.id === mm.dataset.mid); if (m) react(m, rb.dataset.react); return; }
  const cell = e.target.closest("[data-view]"); if (cell) return openViewer(cell.dataset.view, +cell.dataset.i);
  const rv = e.target.closest("[data-round]"); if (rv) return toggleRound(rv);
  const rc = e.target.closest("[data-recall]"); if (rc) { const p = dmPeer(getChat(S.active)); if (p) startCall(p, rc.dataset.recall === "v"); return; }
  const vc = e.target.closest("[data-voice]");
  if (vc) { const wv = e.target.closest(".wv"); if (wv) { const r = wv.getBoundingClientRect(); return playVoice(vc.dataset.voice, Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); } if (e.target.closest(".pbtn")) return playVoice(vc.dataset.voice); return; }
  const fb = e.target.closest("[data-file]"); if (fb) { const m = currentMsgs().find(x => x.id === fb.dataset.file); if (m && m.media && !m.uploading) showMenu([["save", "Qurilmaga saqlash", () => saveToDevice(m.media[0], m)], ["file", "Ochish", () => window.open(m.media[0].url, "_blank", "noopener")]], e.clientX, e.clientY); }
});
document.addEventListener("dblclick", e => { const mm = e.target.closest(".m"); if (!mm || e.target.closest("[data-view],[data-round],[data-voice]")) return; const m = currentMsgs().find(x => x.id === mm.dataset.mid); if (m) { S.reply = m; S.editing = null; renderComposer(); } });
function msgMenu(el, x, y){
  const m = currentMsgs().find(v => v.id === el.dataset.mid); if (!m || m.uploading || m.pending) return;
  const own = m.from === S.me; const c = getChat(m.chat_id);
  const items = [];
  items.push(["reply", "Javob berish", () => { S.reply = m; S.editing = null; renderComposer(); }]);
  if (m.text && m.kind !== "sticker") items.push(["copy", "Nusxa olish", async () => { try { await navigator.clipboard.writeText(m.text); toast("Nusxa olindi"); } catch(e){ toast("Nusxa olib bo'lmadi"); } }]);
  items.push(["fwd", "Uzatish", () => forwardDlg(m)]);
  if (m.media && m.media.length && m.kind !== "call") {
    if (m.kind === "photo" || m.kind === "video") m.media.forEach((it, i) => items.push(["save", m.media.length > 1 ? `Qurilmaga saqlash (${i + 1})` : "Qurilmaga saqlash", () => saveToDevice(it, m)]));
    else if (m.kind !== "sticker") items.push(["save", "Qurilmaga saqlash", () => saveToDevice(m.media[0], m)]);
  }
  if ((m.kind === "sticker" && m.media && m.media[0]) || (m.kind === "photo" && m.media.length === 1)) items.push(["sticker", "Stikerlarimga qo'shish", () => addStickerUrl(m.media[0].url)]);
  if (c && c.type !== "saved" && S.savedId) items.push(["bookmark", "Saqlanganlarga", async () => { try { await insertMsg(S.savedId, {kind:m.kind, text:m.text, media:m.media, fwd_from:m.fwd_from || m.from}); toast("Saqlanganlarga qo'shildi ✅"); } catch(e){ toast("Bo'lmadi"); } }]);
  if (c && c.type !== "saved") items.push(["pin", "Qadab qo'yish", () => pinMsg(m)]);
  if (own && !m.fwd_from && !["sticker","call","round","voice"].includes(m.kind)) items.push(["edit", m.kind && m.kind !== "text" ? "Izohni tahrirlash" : "Tahrirlash", () => { S.editing = m; S.reply = null; renderComposer(); }]);
  if (own) items.push(["trash", "O'chirish", () => delMsg(m), true]);
  showMenu(items, x, y, c && c.type !== "saved" ? m : null);
}
function showMenu(items, x, y, reactFor){
  closeMenu();
  const v = document.createElement("div"); v.className = "veil clear"; v.id = "mveil";
  const mn = document.createElement("div"); mn.className = "menu";
  if (reactFor) {
    const rx = document.createElement("div"); rx.className = "rx";
    QUICK.forEach(e => { const b = document.createElement("button"); b.textContent = e; b.onclick = () => { closeMenu(); react(reactFor, e); }; rx.appendChild(b); });
    mn.appendChild(rx);
  }
  items.forEach(([ic, label, fn, red]) => { const b = document.createElement("button"); b.className = "mi" + (red ? " red" : ""); b.innerHTML = (IC[ic] || "") + `<span>${esc(label)}</span>`; b.onclick = () => { closeMenu(); fn(); }; mn.appendChild(b); });
  v.appendChild(mn); document.body.appendChild(v);
  const r = mn.getBoundingClientRect();
  mn.style.left = Math.max(8, Math.min(x, innerWidth - r.width - 8)) + "px";
  mn.style.top = Math.max(8, Math.min(y, innerHeight - r.height - 8)) + "px";
  v.addEventListener("click", e => { if (e.target === v) closeMenu(); });
  v.addEventListener("contextmenu", e => { e.preventDefault(); closeMenu(); });
}
function closeMenu(){ const v = $("#mveil"); if (v) v.remove(); }

/* ---------- emoji & sticker panel ---------- */
async function loadStickers(){ const { data } = await sb.from("stickers").select("*").eq("user_id", S.me).order("created_at", {ascending:false}); S.stickers = data || []; }
async function addStickerUrl(url){ const { data, error } = await sb.from("stickers").insert({url, user_id:S.me}).select().single(); if (error) return toast("Qo'shib bo'lmadi"); S.stickers.unshift(data); toast("Stikerlaringizga qo'shildi ✅"); }
async function makeSticker(file){
  try {
    toast("Stiker tayyorlanmoqda…");
    const url = URL.createObjectURL(file); const img = await loadImg(url);
    const d = 512, cv = document.createElement("canvas"); cv.width = cv.height = d;
    const k = Math.min(d / img.naturalWidth, d / img.naturalHeight); const w = img.naturalWidth * k, h = img.naturalHeight * k;
    cv.getContext("2d").drawImage(img, (d - w) / 2, (d - h) / 2, w, h); URL.revokeObjectURL(url);
    const blob = await canvasBlob(cv, "image/webp", 0.9) || await canvasBlob(cv, "image/png");
    const up = await upload(blob, blob.type === "image/webp" ? "webp" : "png", blob.type);
    await addStickerUrl(up); renderPanel("stk");
  } catch(e){ uploadErr(e); }
}
function sendSticker(st){
  const cid = S.active; closePanel();
  const body = st.url ? {kind:"sticker", media:[{url:st.url, type:"sticker"}]} : {kind:"sticker", text:st.emoji};
  const local = {id:uuid(), chat_id:cid, from:S.me, from_id:S.me, ...body, at:Date.now(), created_at:new Date().toISOString(), reply_to:replyRef(), pending:true, reactions:{}};
  S.reply = null; renderComposer(); addPending(cid, local); sentSound();
  insertMsg(cid, local, local).catch(() => { dropPending(cid, local.id); toast("Yuborilmadi"); });
}
function togglePanel(tab){ if ($("#panel") && typeof tab !== "string") return closePanel(); renderPanel(typeof tab === "string" ? tab : (S.panelTab || "emo")); }
function closePanel(){ const p = $("#panel"); if (p) p.remove(); }
function renderPanel(tab){
  S.panelTab = tab; closePanel();
  const p = document.createElement("div"); p.className = "panel"; p.id = "panel";
  let body = "";
  if (tab === "emo") body = `<div class="grid">${EMOJI.map(e => `<button data-emo="${e}">${e}</button>`).join("")}</div>`;
  else body = `<h4>Mening stikerlarim</h4><div class="sgrid"><button class="add" data-add="1">+ Rasmdan<br>stiker</button>${S.stickers.map(s => `<button data-surl="${esc(s.url)}" data-sid="${esc(s.id)}"><img src="${esc(s.url)}" alt="" loading="lazy"></button>`).join("")}</div><h4>Emoji stikerlar</h4><div class="sgrid">${STK.map(e => `<button data-semo="${e}">${e}</button>`).join("")}</div>`;
  p.innerHTML = `<div class="tabs"><button data-tab="emo" class="${tab === "emo" ? "on" : ""}">Emoji</button><button data-tab="stk" class="${tab === "stk" ? "on" : ""}">Stikerlar</button></div><div class="body">${body}</div>`;
  $("#chat").appendChild(p);
  p.addEventListener("click", e => {
    const t = e.target.closest("[data-tab]"); if (t) return renderPanel(t.dataset.tab);
    const em = e.target.closest("[data-emo]"); if (em) { const ta = $("#ta"); if (!ta) return; const s = ta.selectionStart ?? ta.value.length; ta.value = ta.value.slice(0, s) + em.dataset.emo + ta.value.slice(ta.selectionEnd ?? s); ta.selectionStart = ta.selectionEnd = s + em.dataset.emo.length; autosize(ta); S.draft[S.active] = ta.value; updateSendBtn(); return; }
    if (e.target.closest("[data-add]")) return pick("fImage", fs => makeSticker(fs[0]));
    const se = e.target.closest("[data-semo]"); if (se) return sendSticker({emoji:se.dataset.semo});
    const su = e.target.closest("[data-surl]"); if (su) return sendSticker({url:su.dataset.surl});
  });
  p.addEventListener("contextmenu", async e => {
    const su = e.target.closest("[data-sid]"); if (!su) return; e.preventDefault();
    if (!await confirmDlg("Stikerni o'chirish", "Bu stiker ro'yxatingizdan o'chiriladi.", "O'chirish")) return;
    await sb.from("stickers").delete().eq("id", su.dataset.sid); S.stickers = S.stickers.filter(s => s.id !== su.dataset.sid); renderPanel("stk");
  });
}
document.addEventListener("pointerdown", e => { if ($("#panel") && !e.target.closest("#panel") && !e.target.closest("#emoBtn") && !e.target.closest(".veil") && !e.target.closest("#attBtn")) closePanel(); });

/* ---------- dialogs ---------- */
function dialog(html, onMount){
  const v = document.createElement("div"); v.className = "veil";
  v.innerHTML = `<div class="dlg">${html}</div>`;
  document.body.appendChild(v);
  const close = () => v.remove();
  v.addEventListener("click", e => { if (e.target === v) close(); });
  onMount && onMount(v, close);
  return close;
}
function confirmDlg(title, text, ok){
  return new Promise(res => dialog(`<h3>${esc(title)}</h3><p>${esc(text)}</p><div class="acts"><button data-a="no">Bekor qilish</button><button class="red" data-a="ok">${esc(ok)}</button></div>`, (v, close) => {
    v.querySelector('[data-a="no"]').onclick = () => { close(); res(false); };
    v.querySelector('[data-a="ok"]').onclick = () => { close(); res(true); };
  }));
}
function peoplePicker(title, okLabel, onDone, withName){
  const chosen = new Map();
  dialog(`<h3>${esc(title)}</h3>${withName ? '<input class="inp" id="gname" maxlength="60" placeholder="Guruh nomi" style="margin-bottom:10px">' : ""}<input class="inp" id="us" placeholder="Telefon raqam yoki @username" autocomplete="off"><div id="chips" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"></div><div class="ulist" id="ul"></div><div class="acts"><button data-a="no">Bekor qilish</button><button data-a="ok">${esc(okLabel)}</button></div>`, (v, close) => {
    const inp = v.querySelector("#us"), ul = v.querySelector("#ul"), chips = v.querySelector("#chips");
    v.querySelector('[data-a="no"]').onclick = close;
    v.querySelector('[data-a="ok"]').onclick = () => { const name = withName ? v.querySelector("#gname").value.trim() : null; if (withName && !name) { v.querySelector("#gname").focus(); return; } close(); onDone([...chosen.keys()], name); };
    const drawChips = () => chips.innerHTML = [...chosen.values()].map(p => `<span style="background:var(--bg2);border-radius:14px;padding:3px 10px;font-size:13px">${esc(p.name || "?")}</span>`).join("");
    let seq = 0;
    const run = async () => {
      const my = ++seq; const q = inp.value.replace(/[,()%*\\]/g, " ").trim().replace(/^@/, "");
      const data = await lookupPeople(inp.value);
      if (my !== seq) return;
      (data || []).forEach(p => S.profiles[p.id] = {...S.profiles[p.id], ...p});
      ul.innerHTML = (data || []).length ? "" : `<div class="empty-list" style="padding:20px">${inp.value.trim() ? "Hech kim topilmadi" : "To'liq telefon raqam yoki @username yozing"}</div>`;
      (data || []).forEach(p => {
        const d = document.createElement("div"); d.className = "item" + (chosen.has(p.id) ? " on" : "");
        d.innerHTML = `${userAvatar(p.id, "sm")}<div class="meta"><div class="name"></div><div class="sub">${p.username ? "@" + esc(p.username) : esc(lastSeen(p.id))}</div></div>`;
        d.querySelector(".name").textContent = p.name || "Foydalanuvchi";
        d.onclick = () => { if (chosen.has(p.id)) chosen.delete(p.id); else chosen.set(p.id, p); d.classList.toggle("on"); drawChips(); };
        ul.appendChild(d);
      });
    };
    let t; inp.oninput = () => { clearTimeout(t); t = setTimeout(run, 250); }; run();
  });
}
async function openDM(other){
  const { data, error } = await sb.rpc("get_or_create_dm", {other});
  if (error || !data) return toast("Chat ochilmadi");
  S.q = ""; const qi = $("#q"); if (qi) qi.value = ""; peopleHits = [];
  if (!getChat(data)) await loadChats();
  openChat(data);
}
function newDMDlg(){
  dialog(`<h3>Yangi xabar</h3><input class="inp" id="us" placeholder="Telefon raqam yoki @username" autocomplete="off"><div class="ulist" id="ul"></div><div class="acts"><button data-a="no">Yopish</button></div>`, (v, close) => {
    const inp = v.querySelector("#us"), ul = v.querySelector("#ul");
    v.querySelector('[data-a="no"]').onclick = close;
    let seq = 0;
    const run = async () => {
      const my = ++seq; const q = inp.value.replace(/[,()%*\\]/g, " ").trim().replace(/^@/, "");
      const data = await lookupPeople(inp.value);
      if (my !== seq) return;
      ul.innerHTML = (data || []).length ? "" : `<div class="empty-list" style="padding:20px">${inp.value.trim() ? "Hech kim topilmadi.<br><span style=\"font-size:13px\">To'liq raqamni (masalan 90 123 45 67) yoki @username ni yozing.</span>" : "Do'stingizning <b>telefon raqamini</b> yoki <b>@username</b> ini yozing"}</div>`;
      (data || []).forEach(p => {
        S.profiles[p.id] = {...S.profiles[p.id], ...p};
        const d = document.createElement("div"); d.className = "item";
        d.innerHTML = `${userAvatar(p.id, "sm")}<div class="meta"><div class="name"></div><div class="sub">${p.username ? "@" + esc(p.username) : esc(lastSeen(p.id))}</div></div>`;
        d.querySelector(".name").textContent = p.name || "Foydalanuvchi";
        d.onclick = () => { close(); openDM(p.id); };
        ul.appendChild(d);
      });
    };
    let t; inp.oninput = () => { clearTimeout(t); t = setTimeout(run, 250); };
    setTimeout(() => inp.focus(), 30); run();
  });
}
function fabMenu(e){
  const r = e.currentTarget.getBoundingClientRect();
  showMenu([
    ["user", "Yangi xabar", newDMDlg],
    ["group", "Yangi guruh", () => peoplePicker("Yangi guruh", "Yaratish", async (ids, name) => {
      const { data, error } = await sb.rpc("create_group", {title:name, users:ids});
      if (error) return toast("Guruh yaratilmadi");
      await loadChats(); openChat(data);
    }, true)]
  ], r.left - 170, r.top - 110);
}
/* ---------- chap panel (drawer) ---------- */
function mainMenu(){
  closeDrawer();
  const p = S.profile || {};
  const dark = document.body.classList.contains("dark");
  const veil = document.createElement("div"); veil.className = "dveil"; veil.id = "drawer";
  veil.innerHTML = `<aside class="drawer">
    <div class="dhead">
      <button class="icon-btn dtheme" data-d="theme" aria-label="Rejim">${dark ? IC.sun : IC.moon}</button>
      <div class="dav">${userAvatar(S.me)}</div>
      <b>${esc(p.name || "Profilim")}</b>
      <span>${esc(S.myPhone ? fmtPhone(S.myPhone) : (p.username ? "@" + p.username : ""))}</span>
    </div>
    <nav class="dlist">
      <button data-d="profile">${IC.user}<span>Mening profilim</span></button>
      <button data-d="group">${IC.group}<span>Yangi guruh</span></button>
      <button data-d="contacts">${IC.contacts}<span>Kontaktlar</span><em>${Object.keys(S.contacts || {}).length || ""}</em></button>
      <button data-d="saved">${IC.bookmark}<span>Saqlangan xabarlar</span></button>
      <hr>
      <button data-d="notif">${IC.bell}<span>Bildirishnomalar va ovoz</span></button>
      <button data-d="theme">${IC.moon}<span>Tungi rejim</span><i class="sw ${dark ? "on" : ""}"></i></button>
      <button data-d="install">${IC.info}<span>Telefonga o'rnatish</span></button>
      <button data-d="invite">${IC.userPlus}<span>Do'stlarni taklif qilish</span></button>
      <hr>
      <button data-d="logout" class="red">${IC.leave}<span>Chiqish</span></button>
    </nav>
    <div class="dfoot">Hikmat messenjeri</div>
  </aside>`;
  document.body.appendChild(veil);
  requestAnimationFrame(() => veil.classList.add("open"));
  veil.addEventListener("click", async e => {
    if (e.target === veil) return closeDrawer();
    const b = e.target.closest("[data-d]"); if (!b) return;
    const d = b.dataset.d;
    if (d === "theme") { const on = document.body.classList.toggle("dark"); try { localStorage.setItem("xb-theme", on ? "dark" : "light"); } catch(_){} veil.querySelector(".sw").classList.toggle("on", on); veil.querySelector(".dtheme").innerHTML = on ? IC.sun : IC.moon; return; }
    closeDrawer();
    setTimeout(async () => {
      if (d === "profile") settingsDlg();
      else if (d === "group") newGroupFlow();
      else if (d === "contacts") contactsPage();
      else if (d === "saved") S.savedId && openChat(S.savedId);
      else if (d === "notif") notifDlg();
      else if (d === "install") installDlg();
      else if (d === "invite") invite();
      else if (d === "logout") { if (await confirmDlg("Chiqish", "Hisobingizdan chiqasizmi?", "Chiqish")) sb.auth.signOut(); }
    }, 180);
  });
  // chapga surib yopish
  let sx = null; const dr = veil.querySelector(".drawer");
  dr.addEventListener("touchstart", e => { sx = e.touches[0].clientX; dr.style.transition = "none"; }, {passive:true});
  dr.addEventListener("touchmove", e => { if (sx == null) return; const dx = Math.min(0, e.touches[0].clientX - sx); dr.style.transform = `translateX(${dx}px)`; }, {passive:true});
  dr.addEventListener("touchend", e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; dr.style.transition = ""; dr.style.transform = ""; if (dx < -70) closeDrawer(); }, {passive:true});
}
function closeDrawer(){ const v = $("#drawer"); if (!v) return; v.classList.remove("open"); setTimeout(() => v.remove(), 230); }
async function invite(){
  const url = location.origin + location.pathname;
  const text = "Assalomu alaykum! «Hikmat» messenjeriga taklif qilaman 📱 " + url;
  try { if (navigator.share) { await navigator.share({title:"Hikmat", text, url}); return; } } catch(e){ if (e && e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(text); toast("Taklif matni nusxalandi — xohlagan joyga joylang"); } catch(e){ toast(url); }
}
function newGroupFlow(){
  peoplePicker("Yangi guruh", "Yaratish", async (ids, name) => {
    const { data, error } = await sb.rpc("create_group", {title:name, users:ids});
    if (error) return toast("Guruh yaratilmadi");
    await loadChats(); openChat(data);
  }, true);
}

/* ---------- kontaktlar ---------- */
async function loadContacts(){
  const { data, error } = await sb.from("contacts").select("contact_id,first_name,last_name,phone");
  if (error) { S.contacts = S.contacts || {}; return; }
  S.contacts = {}; (data || []).forEach(k => S.contacts[k.contact_id] = k);
  await loadProfiles(Object.keys(S.contacts));
}
function contactForm(title, init, onSave){
  dialog(`<h3>${esc(title)}</h3>
    <div class="field-lbl">Ism</div><input class="inp" id="cf1" maxlength="40" value="${esc(init.first_name || "")}" autocomplete="off">
    <div class="field-lbl">Familiya (ixtiyoriy)</div><input class="inp" id="cf2" maxlength="40" value="${esc(init.last_name || "")}" autocomplete="off">
    ${init.lockPhone ? "" : `<div class="field-lbl">Telefon raqam${init.contact_id ? " (ixtiyoriy)" : ""}</div><input class="inp" id="cf3" type="tel" inputmode="tel" value="${esc(init.phone ? fmtPhone(init.phone) : "+998 ")}">`}
    <div class="acts">${init.contact_id && S.contacts[init.contact_id] ? '<button class="red" data-a="del">O\'chirish</button>' : ""}<button data-a="no">Bekor</button><button data-a="ok">Saqlash</button></div>`, (v, close) => {
    setTimeout(() => v.querySelector("#cf1").focus(), 50);
    v.querySelector('[data-a="no"]').onclick = close;
    const del = v.querySelector('[data-a="del"]');
    if (del) del.onclick = async () => { close(); if (!await confirmDlg("Kontaktni o'chirish", `«${contactName(init.contact_id)}» kontaktlardan o'chiriladi. Chat saqlanib qoladi.`, "O'chirish")) return; await sb.from("contacts").delete().eq("contact_id", init.contact_id); delete S.contacts[init.contact_id]; refreshAfterContacts(); toast("Kontakt o'chirildi"); };
    v.querySelector('[data-a="ok"]').onclick = async () => {
      const f = v.querySelector("#cf1").value.trim(), l = v.querySelector("#cf2").value.trim();
      const phRaw = v.querySelector("#cf3") ? v.querySelector("#cf3").value : "";
      if (!f) { v.querySelector("#cf1").focus(); return toast("Ismni yozing"); }
      const ph = normPhone(phRaw);
      await onSave({first_name:f, last_name:l, phone:ph}, close);
    };
  });
}
async function saveContact(id, data){
  const row = {owner:S.me, contact_id:id, first_name:data.first_name, last_name:data.last_name || "", phone:data.phone || (S.contacts[id] && S.contacts[id].phone) || null};
  const { error } = await sb.from("contacts").upsert(row);
  if (error) { toast("Saqlab bo'lmadi"); return false; }
  S.contacts[id] = row; await loadProfiles([id]); refreshAfterContacts(); return true;
}
function refreshAfterContacts(){ renderList(); renderHead(); renderMsgs(false); renderContactBar(); if ($("#cpage")) drawContacts(); }
function addContactDlg(){
  contactForm("Yangi kontakt", {}, async (d, close) => {
    if (!d.phone) return toast("Telefon raqamni to'liq yozing");
    const hits = await findByPhone(d.phone);
    if (!hits.length) {
      close();
      dialog(`<h3>Hikmat'da topilmadi</h3><p>${esc(fmtPhone(d.phone))} raqami hali Hikmat'da ro'yxatdan o'tmagan. Unga taklif yuboraymi?</p><div class="acts"><button data-a="no">Yopish</button><button data-a="ok">Taklif qilish</button></div>`, (v, c2) => { v.querySelector('[data-a="no"]').onclick = c2; v.querySelector('[data-a="ok"]').onclick = () => { c2(); invite(); }; });
      return;
    }
    const p = hits[0]; S.profiles[p.id] = {...S.profiles[p.id], ...p};
    if (await saveContact(p.id, d)) { close(); toast("Kontakt saqlandi ✅"); }
  });
}
function editContactDlg(id){
  const k = S.contacts[id];
  const p = prof(id);
  const parts = (p.name || "").split(" ");
  contactForm(k ? "Kontaktni tahrirlash" : "Kontaktga qo'shish", k ? {...k, contact_id:id} : {first_name:parts[0] || "", last_name:parts.slice(1).join(" "), contact_id:id}, async (d, close) => {
    if (await saveContact(id, d)) { close(); toast(k ? "Saqlandi ✅" : "Kontakt saqlandi ✅"); }
  });
}
function contactsPage(){
  const pg = document.createElement("div"); pg.className = "cpage"; pg.id = "cpage";
  pg.innerHTML = `<div class="chat-head"><button class="icon-btn" id="cpBack" style="display:grid">${IC.back}</button><div class="t"><div class="tn">Kontaktlar</div><div class="ts" id="cpCount"></div></div><button class="icon-btn" id="cpAdd" aria-label="Kontakt qo'shish">${IC.userPlus}</button></div>
    <div style="padding:8px 12px"><label class="search">${IC.search}<input id="cpq" placeholder="Kontaktlardan qidirish" autocomplete="off"></label></div>
    <div class="list" id="cpList"></div>`;
  document.body.appendChild(pg);
  requestAnimationFrame(() => pg.classList.add("open"));
  const close = () => { pg.classList.remove("open"); setTimeout(() => pg.remove(), 230); };
  pg.querySelector("#cpBack").onclick = close;
  pg.querySelector("#cpAdd").onclick = addContactDlg;
  pg.querySelector("#cpq").oninput = drawContacts;
  pg._close = close;
  drawContacts();
}
function drawContacts(){
  const pg = $("#cpage"); if (!pg) return;
  const q = pg.querySelector("#cpq").value.trim().toLowerCase();
  const ids = Object.keys(S.contacts || {});
  const list = ids.map(id => ({id, name:contactName(id) || prof(id).name || "Kontakt"}))
    .filter(x => !q || x.name.toLowerCase().includes(q) || (S.contacts[x.id].phone || "").includes(q.replace(/\D/g, "") || "~"))
    .sort((a, b) => (S.online[b.id] ? 1 : 0) - (S.online[a.id] ? 1 : 0) || ts(prof(b.id).last_seen) - ts(prof(a.id).last_seen));
  pg.querySelector("#cpCount").textContent = ids.length ? ids.length + " ta kontakt" : "";
  const el = pg.querySelector("#cpList");
  let html = `<div class="item" data-cadd="1"><div class="av sm" style="background:var(--accent)">${IC.userPlus}</div><div class="meta"><div class="name" style="color:var(--accent)">Kontakt qo'shish</div></div></div>
    <div class="item" data-cinv="1"><div class="av sm" style="background:#4fca5a">${IC.link}</div><div class="meta"><div class="name" style="color:#2e9e3e">Do'stlarni taklif qilish</div></div></div>`;
  if (!list.length) html += `<div class="empty-list">${q ? "Topilmadi" : "Hali kontaktlar yo'q.<br>«Kontakt qo'shish» orqali raqam bilan saqlang yoki chatda «Kontaktga qo'shish» ni bosing."}</div>`;
  html += list.map(x => `<div class="item" data-cid="${esc(x.id)}">${userAvatar(x.id, "sm")}<div class="meta"><div class="name">${esc(x.name)}</div><div class="sub" style="${S.online[x.id] ? "color:var(--accent)" : ""}">${esc(lastSeen(x.id))}</div></div></div>`).join("");
  el.innerHTML = html;
  el.onclick = e => {
    if (e.target.closest("[data-cadd]")) return addContactDlg();
    if (e.target.closest("[data-cinv]")) return invite();
    const it = e.target.closest("[data-cid]"); if (!it) return;
    pg._close(); openDM(it.dataset.cid);
  };
  el.oncontextmenu = e => { const it = e.target.closest("[data-cid]"); if (!it) return; e.preventDefault(); editContactDlg(it.dataset.cid); };
  let lt = null;
  el.ontouchstart = e => { const it = e.target.closest("[data-cid]"); if (!it) return; lt = setTimeout(() => { S.justPressed = Date.now(); editContactDlg(it.dataset.cid); }, 500); };
  el.ontouchend = el.ontouchmove = () => clearTimeout(lt);
}
function renderContactBar(){
  const slot = $("#cbarSlot"); if (!slot) return;
  const c = getChat(S.active); const peer = dmPeer(c);
  if (!peer || S.contacts[peer]) { slot.innerHTML = ""; return; }
  slot.innerHTML = `<div class="cbar"><button id="cbAdd">${IC.userPlus} Kontaktga qo'shish</button><button id="cbX" class="icon-btn" style="width:32px;height:32px">${IC.x}</button></div>`;
  $("#cbAdd").onclick = () => editContactDlg(peer);
  $("#cbX").onclick = () => { slot.innerHTML = ""; };
}
function notifDlg(){
  const st = "Notification" in window ? Notification.permission : "unsupported";
  let snd = true; try { snd = localStorage.getItem("xb-sound") !== "off"; } catch(e){}
  dialog(`<h3>Bildirishnomalar</h3><p>${st === "granted" ? "Yoqilgan ✅ Ilova ochiq turganda (fonda ham) yangi xabarlar haqida xabar beradi." : st === "denied" ? "Brauzer sozlamalarida bildirishnomalar bloklangan." : st === "unsupported" ? "iPhone'da bildirishnoma uchun avval ilovani bosh ekranga o'rnating (Menyu → Telefonga o'rnatish)." : "Yangi xabar kelganda xabar beraylikmi?"}</p>
    <div class="acts"><button data-a="snd">Ovoz: ${snd ? "yoniq" : "o'chiq"}</button>${st === "default" ? '<button data-a="on">Yoqish</button>' : ""}<button data-a="ok">Yopish</button></div>`, (v, close) => {
    v.querySelector('[data-a="ok"]').onclick = close;
    v.querySelector('[data-a="snd"]').onclick = () => { try { localStorage.setItem("xb-sound", snd ? "off" : "on"); } catch(e){} close(); notifDlg(); };
    const on = v.querySelector('[data-a="on"]'); if (on) on.onclick = async () => { await Notification.requestPermission(); close(); notifDlg(); };
  });
}
function installDlg(){
  dialog(`<h3>Telefonga o'rnatish</h3><p><b>iPhone (Safari):</b> pastdagi «Ulashish» ⬆️ tugmasi → «Bosh ekranga» (Add to Home Screen).</p><p><b>Android (Chrome):</b> yuqoridagi ⋮ menyu → «Ilovani o'rnatish» yoki «Bosh ekranga qo'shish».</p><p>Shundan so'ng Hikmat oddiy ilovadek ochiladi.</p><div class="acts"><button data-a="ok">Yaxshi</button></div>`, (v, close) => v.querySelector('[data-a="ok"]').onclick = close);
}
function settingsDlg(){
  const p = S.profile || {};
  dialog(`<div class="profile-head"><div id="myav" style="cursor:pointer;display:inline-block">${userAvatar(S.me)}</div><div style="font-size:13px;color:var(--accent);margin-bottom:6px;cursor:pointer" id="chav">Rasmni o'zgartirish</div></div>
    <div class="field-lbl" id="myph" style="text-align:center"></div>
    <div class="field-lbl">Ism</div><input class="inp" id="pn" maxlength="60" value="${esc(p.name || "")}">
    <div class="field-lbl">Username (boshqalar sizni @username orqali topadi)</div><input class="inp" id="pu" maxlength="32" placeholder="masalan: hikmatilla" value="${esc(p.username || "")}">
    <div class="field-lbl">O'zim haqimda</div><input class="inp" id="pb" maxlength="140" value="${esc(p.bio || "")}">
    <div class="acts"><button data-a="no">Bekor qilish</button><button data-a="ok">Saqlash</button></div>`, (v, close) => {
    const pickAv = () => pick("fImage", async fs => {
      try { toast("Yuklanmoqda…"); const im = await prepImage(fs[0], 512); const url = await upload(im.blob, im.ext, im.type);
        const { error } = await sb.from("profiles").update({avatar_url:url}).eq("id", S.me); if (error) throw error;
        S.profile.avatar_url = url; S.profiles[S.me] = S.profile; v.querySelector("#myav").innerHTML = userAvatar(S.me); toast("Rasm yangilandi ✅"); } catch(e){ uploadErr(e); }
    });
    sb.from("phones").select("phone,visible").eq("user_id", S.me).maybeSingle().then(r => {
      const el = v.querySelector("#myph"); if (!el || !r || !r.data || !r.data.phone) return;
      const vis = r.data.visible !== false;
      el.innerHTML = `📱 ${esc(fmtPhone(r.data.phone))}<label style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;color:var(--text);font-size:14px;cursor:pointer"><input type="checkbox" id="phvis" ${vis ? "checked" : ""} style="width:18px;height:18px"> Raqamimni suhbatdoshlarim ko'rsin</label>`;
      v.querySelector("#phvis").onchange = async ev => { const { error } = await sb.from("phones").update({visible:ev.target.checked}).eq("user_id", S.me); toast(error ? "Saqlab bo'lmadi" : ev.target.checked ? "Raqamingiz suhbatdoshlaringizga ko'rinadi" : "Raqamingiz yashirildi"); };
    }).catch(() => {});
    v.querySelector("#chav").onclick = pickAv; v.querySelector("#myav").onclick = pickAv;
    v.querySelector('[data-a="no"]').onclick = close;
    v.querySelector('[data-a="ok"]').onclick = async () => {
      const name = v.querySelector("#pn").value.trim(), username = v.querySelector("#pu").value.trim().replace(/^@/, "").toLowerCase(), bio = v.querySelector("#pb").value.trim();
      if (!name) return toast("Ismni yozing");
      if (username && !/^[a-z0-9_]{3,32}$/.test(username)) return toast("Username: 3–32 ta lotin harf, raqam yoki _");
      const { error } = await sb.from("profiles").update({name, username:username || null, bio}).eq("id", S.me);
      if (error) return toast(/duplicate|unique/i.test(error.message) ? "Bu username band" : "Saqlab bo'lmadi");
      Object.assign(S.profile, {name, username:username || null, bio}); close(); toast("Saqlandi ✅"); renderList();
    };
  });
}
function chatInfo(c){ if (c && c.type !== "saved") profilePage(c); }
/* ---------- Telegram uslubidagi profil sahifasi ---------- */
function openImage(url, who){ openViewer("__img", 0, {id:"__img", from:who, at:Date.now(), media:[{url, type:"image"}]}); }
function profilePage(c){
  const old = $("#ppage"); if (old) old.remove();
  const dm = c.type === "dm", id = dm ? dmPeer(c) : null, p = dm ? prof(id) : {};
  const pg = document.createElement("div"); pg.className = "cpage ppage"; pg.id = "ppage";
  const avUrl = dm ? p.avatar_url : c.avatar_url;
  const status = dm ? lastSeen(id, true) : `${c.members.length} a'zo` + (c.members.filter(u => S.online[u]).length ? `, ${c.members.filter(u => S.online[u]).length + 1} onlayn` : "");
  const btn = (a, ic, t) => `<button data-p="${a}">${IC[ic]}<span>${t}</span></button>`;
  pg.innerHTML = `
    <div class="pp-top"><button class="icon-btn" data-p="back" aria-label="Orqaga">${IC.back}</button><span></span><button class="icon-btn" data-p="more" aria-label="Yana">${IC.dots}</button></div>
    <div class="pp-scroll">
      <div class="pp-hero">
        <div class="pp-av" data-p="avatar">${dm ? userAvatar(id) : avatarHtml(c)}</div>
        <h2>${esc(dm ? nameOf(id) : chatTitle(c))}</h2>
        <div class="pp-st ${dm && S.online[id] ? "on" : ""}">${esc(status)}</div>
      </div>
      <div class="pp-btns">${dm ? btn("msg","send","Xabar") + btn("call","phone","Qo'ng'iroq") + btn("video","video","Video") + btn("search","search","Qidirish")
                               : btn("msg","send","Xabar") + btn("add","userPlus","Qo'shish") + btn("link","link","Havola") + btn("search","search","Qidirish")}</div>
      <div class="pp-card" id="ppInfo"></div>
      ${dm ? "" : `<div class="pp-card"><div class="pp-h">A'zolar</div><div id="ppMembers"></div></div>`}
      <div class="pp-card pp-media">
        <div class="pp-tabs"><button data-t="media" class="on">Media</button><button data-t="files">Fayllar</button><button data-t="voice">Ovozli</button><button data-t="links">Havolalar</button></div>
        <div id="ppMediaBody"><div class="empty-list" style="padding:24px">Yuklanmoqda…</div></div>
      </div>
    </div>`;
  document.body.appendChild(pg);
  requestAnimationFrame(() => pg.classList.add("open"));
  const close = () => { pg.classList.remove("open"); stopPP(); setTimeout(() => pg.remove(), 230); };
  // ma'lumot qatorlari
  const info = pg.querySelector("#ppInfo");
  const rows = [];
  const row = (val, lbl, act) => `<div class="pp-row" ${act ? `data-copy="${esc(act)}"` : ""}><div class="v">${val}</div><div class="l">${esc(lbl)}</div></div>`;
  if (dm) {
    const k = S.contacts[id];
    if (k && k.phone) rows.push(row(esc(fmtPhone(k.phone)), "mobil", fmtPhone(k.phone)));
    if (p.username) rows.push(row("@" + esc(p.username), "username", "@" + p.username));
    if (p.bio) rows.push(row(esc(p.bio), "o'zi haqida"));
    if (k && p.name && p.name !== nameOf(id)) rows.push(row(esc(p.name), "o'zi yozgan ismi"));
    info.innerHTML = rows.join("") || `<div class="pp-row"><div class="l">Qo'shimcha ma'lumot yo'q</div></div>`;
    if (!(k && k.phone)) sb.rpc("get_phone", {u:id}).then(r => { if (r && r.data) { info.insertAdjacentHTML("afterbegin", row(esc(fmtPhone(r.data)), "mobil", fmtPhone(r.data))); const e = info.querySelector(".pp-row .l"); if (e && e.textContent === "Qo'shimcha ma'lumot yo'q") e.parentElement.remove(); } }).catch(() => {});
  } else {
    info.innerHTML = row(esc(location.origin + location.pathname + "?join=" + c.id), "taklif havolasi", location.origin + location.pathname + "?join=" + c.id);
    const ml = pg.querySelector("#ppMembers");
    ml.innerHTML = c.members.slice().sort((a, b) => (S.online[b] ? 1 : 0) - (S.online[a] ? 1 : 0)).map(u => `<div class="item" data-mem="${esc(u)}">${userAvatar(u, "sm")}<div class="meta"><div class="name">${esc(u === S.me ? "Siz" : nameOf(u))}</div><div class="sub" style="${S.online[u] ? "color:var(--accent)" : ""}">${u === c.created_by ? "admin · " : ""}${esc(u === S.me ? "onlayn" : lastSeen(u))}</div></div></div>`).join("");
  }
  pg.addEventListener("click", async e => {
    const cp = e.target.closest("[data-copy]");
    if (cp) { try { await navigator.clipboard.writeText(cp.dataset.copy); toast("Nusxa olindi"); } catch(_){} return; }
    const mem = e.target.closest("[data-mem]"); if (mem) { if (mem.dataset.mem !== S.me) { close(); openDM(mem.dataset.mem); } return; }
    const b = e.target.closest("[data-p]"); if (!b) return;
    const a = b.dataset.p;
    if (a === "back" || a === "msg") close();
    else if (a === "avatar") { if (avUrl) openImage(avUrl, dm ? id : S.me); }
    else if (a === "call") { close(); startCall(id, false); }
    else if (a === "video") { close(); startCall(id, true); }
    else if (a === "search") { close(); setTimeout(() => { if (S.search === null) toggleSearch(); }, 240); }
    else if (a === "add") peoplePicker("A'zo qo'shish", "Qo'shish", async ids => { for (const u of ids) { const { error } = await sb.rpc("add_member", {c:c.id, u}); if (error) { toast("Qo'shib bo'lmadi"); return; } } toast("Qo'shildi ✅"); });
    else if (a === "link") { const link = location.origin + location.pathname + "?join=" + c.id; try { if (navigator.share) await navigator.share({title:chatTitle(c), url:link}); else { await navigator.clipboard.writeText(link); toast("Havola nusxalandi ✅"); } } catch(_){} }
    else if (a === "more") {
      const r = b.getBoundingClientRect(); const items = [];
      if (dm) { items.push([S.contacts[id] ? "edit" : "userPlus", S.contacts[id] ? "Kontaktni tahrirlash" : "Kontaktga qo'shish", () => editContactDlg(id)]); items.push(["link", "Profilni ulashish", invite]); }
      else items.push(["gear", "Guruhni boshqarish", () => groupManageDlg(c)]);
      items.push(["trash", dm ? "Tarixni tozalash (mening xabarlarim)" : "Guruhdan chiqish", async () => {
        if (dm) { if (!await confirmDlg("Tozalash", "Siz yuborgan barcha xabarlar bu chatdan o'chiriladi.", "Tozalash")) return; await sb.from("messages").delete().eq("chat_id", c.id).eq("from_id", S.me); close(); reloadMsgs(); }
        else { if (!await confirmDlg("Guruhdan chiqish", `«${chatTitle(c)}» guruhidan chiqasizmi?`, "Chiqish")) return; await sb.from("members").delete().eq("chat_id", c.id).eq("user_id", S.me); close(); S.chats = S.chats.filter(x => x.id !== c.id); S.active = null; $("#app").classList.remove("open"); renderChat(); renderList(); }
      }, true]);
      showMenu(items, r.right - 260, r.bottom + 4);
    }
  });
  // ortga surib yopish (chapdan o'ngga)
  let sx = null;
  pg.addEventListener("touchstart", e => { const t = e.touches[0]; sx = t.clientX < 40 ? t.clientX : null; }, {passive:true});
  pg.addEventListener("touchend", e => { if (sx != null && e.changedTouches[0].clientX - sx > 80) close(); sx = null; }, {passive:true});
  // media tablari
  pg.querySelector(".pp-tabs").onclick = e => { const t = e.target.closest("[data-t]"); if (!t) return; pg.querySelectorAll(".pp-tabs button").forEach(x => x.classList.toggle("on", x === t)); drawPPMedia(t.dataset.t); };
  S.ppItems = null; S.ppChat = c;
  sb.from("messages").select("id,chat_id,from_id,kind,media,text,created_at").eq("chat_id", c.id).in("kind", ["photo", "video", "file", "voice", "text"]).order("created_at", {ascending:false}).limit(400)
    .then(({ data }) => { if (!$("#ppage")) return; S.ppItems = (data || []).map(norm); drawPPMedia("media"); });
}
function stopPP(){ document.querySelectorAll("#ppage audio").forEach(a => a.pause()); }
function drawPPMedia(tab){
  const body = $("#ppMediaBody"); if (!body || !S.ppItems) return;
  stopPP();
  const items = S.ppItems;
  const empty = t => `<div class="empty-list" style="padding:26px">${t}</div>`;
  if (tab === "media") {
    const cells = [];
    items.filter(m => (m.kind === "photo" || m.kind === "video") && m.media).forEach(m => m.media.forEach((x, i) => { if (x.type === "image" || x.type === "video") cells.push({m, i, x}); }));
    body.innerHTML = cells.length ? `<div class="pp-grid">${cells.map((c, n) => `<div class="pp-cell" data-g="${n}">${c.x.type === "video" ? (c.x.poster ? `<img src="${esc(c.x.poster)}" loading="lazy">` : `<video src="${esc(c.x.url)}#t=0.1" muted playsinline preload="metadata"></video>`) + `<span class="dur">${c.x.dur ? fmtDur(c.x.dur) : "▶"}</span>` : `<img src="${esc(c.x.url)}" loading="lazy">`}</div>`).join("")}</div>` : empty("Hali rasm yoki video yo'q");
    body.onclick = e => { const g = e.target.closest("[data-g]"); if (!g) return; const c = cells[+g.dataset.g]; openViewer(c.m.id, c.m.media.filter(x => x.type === "image" || x.type === "video").indexOf(c.x), c.m); };
  } else if (tab === "files") {
    const fl = items.filter(m => m.kind === "file" && m.media && m.media[0]);
    body.innerHTML = fl.length ? fl.map((m, n) => `<div class="filebox pp-file" data-f="${n}"><div class="fi">${IC.file}</div><div style="min-width:0;flex:1"><div class="fn">${esc(m.media[0].name || "Fayl")}</div><div class="fs">${m.media[0].size ? fmtSize(m.media[0].size) + " · " : ""}${dayLabel(m.at)}</div></div></div>`).join("") : empty("Hali fayl yo'q");
    body.onclick = e => { const f = e.target.closest("[data-f]"); if (!f) return; const m = fl[+f.dataset.f]; saveToDevice(m.media[0], m); };
  } else if (tab === "voice") {
    const vl = items.filter(m => m.kind === "voice" && m.media && m.media[0]);
    body.innerHTML = vl.length ? vl.map(m => `<div class="pp-voice"><div class="pp-vh"><b>${esc(m.from === S.me ? "Siz" : nameOf(m.from))}</b><span>${dayLabel(m.at)}, ${hm(m.at)} · ${fmtDur(m.media[0].dur)}</span></div><audio controls preload="none" src="${esc(m.media[0].url)}"></audio></div>`).join("") : empty("Hali ovozli xabar yo'q");
    body.onclick = null;
  } else {
    const links = [];
    items.forEach(m => (m.text || "").replace(/https?:\/\/[^\s<]+/g, u => { links.push({u, m}); return u; }));
    body.innerHTML = links.length ? links.map(l => `<a class="pp-link" href="${esc(l.u)}" target="_blank" rel="noopener"><div class="fi">${IC.link}</div><div style="min-width:0"><div class="fn">${esc(l.u.replace(/^https?:\/\//, "").split("/")[0])}</div><div class="fs">${esc(l.u)}</div></div></a>`).join("") : empty("Hali havola yo'q");
    body.onclick = null;
  }
}
function groupManageDlg(c){
  if (!c) return;
  const isOwner = c.created_by === S.me;
  dialog(`<div class="profile-head">${avatarHtml(c)}<b>${esc(chatTitle(c))}</b><span>${c.members.length} a'zo</span></div>
    <div class="row-btns"><button data-a="add">${IC.userPlus}Qo'shish</button><button data-a="link">${IC.link}Havola</button>${isOwner ? `<button data-a="ren">${IC.edit}Nomi</button><button data-a="pic">${IC.camera}Rasm</button>` : ""}<button data-a="leave">${IC.leave}Chiqish</button></div>
    <div class="ulist" id="ml"></div><div class="acts">${isOwner ? '<button class="red" data-a="del">Guruhni o\'chirish</button>' : ""}<button data-a="ok">Yopish</button></div>`, (v, close) => {
    const ml = v.querySelector("#ml");
    const draw = () => { ml.innerHTML = ""; c.members.slice().sort((a, b) => (S.online[b] ? 1 : 0) - (S.online[a] ? 1 : 0)).forEach(u => {
      const d = document.createElement("div"); d.className = "item";
      d.innerHTML = `${userAvatar(u, "sm")}<div class="meta"><div class="name"></div><div class="sub">${u === c.created_by ? "admin · " : ""}${esc(u === S.me ? "siz" : lastSeen(u))}</div></div>${isOwner && u !== S.me ? `<button class="icon-btn" data-kick="${esc(u)}">${IC.x}</button>` : ""}`;
      d.querySelector(".name").textContent = nameOf(u);
      d.onclick = async e => {
        const k = e.target.closest("[data-kick]");
        if (k) { e.stopPropagation(); if (await confirmDlg("Chiqarib yuborish", nameOf(u) + " guruhdan chiqariladi.", "Chiqarish")) { const { error } = await sb.from("members").delete().eq("chat_id", c.id).eq("user_id", u); if (error) toast("Bo'lmadi"); else { c.members = c.members.filter(x => x !== u); draw(); } } return; }
        if (u !== S.me) { close(); openDM(u); }
      };
      ml.appendChild(d); }); };
    draw();
    v.querySelector('[data-a="ok"]').onclick = close;
    v.querySelector('[data-a="add"]').onclick = () => { close(); peoplePicker("A'zo qo'shish", "Qo'shish", async ids => { for (const u of ids) { const { error } = await sb.rpc("add_member", {c:c.id, u}); if (error) { toast("Qo'shib bo'lmadi"); return; } } toast("Qo'shildi ✅"); }); };
    v.querySelector('[data-a="link"]').onclick = async () => { const link = location.origin + location.pathname + "?join=" + c.id; try { await navigator.clipboard.writeText(link); toast("Taklif havolasi nusxalandi ✅"); } catch(e){ prompt("Havola:", link); } };
    v.querySelector('[data-a="leave"]').onclick = async () => { if (!await confirmDlg("Guruhdan chiqish", `«${chatTitle(c)}» guruhidan chiqasizmi?`, "Chiqish")) return; close(); await sb.from("members").delete().eq("chat_id", c.id).eq("user_id", S.me); S.chats = S.chats.filter(x => x.id !== c.id); S.active = null; $("#app").classList.remove("open"); renderChat(); renderList(); };
    const ren = v.querySelector('[data-a="ren"]'); if (ren) ren.onclick = () => { close(); dialog(`<h3>Guruh nomi</h3><input class="inp" id="gn" maxlength="60" value="${esc(c.title || "")}"><div class="acts"><button data-a="no">Bekor</button><button data-a="ok">Saqlash</button></div>`, (v2, c2) => { v2.querySelector('[data-a="no"]').onclick = c2; v2.querySelector('[data-a="ok"]').onclick = async () => { const t = v2.querySelector("#gn").value.trim(); if (!t) return; c2(); const { error } = await sb.from("chats").update({title:t}).eq("id", c.id); if (error) toast("Bo'lmadi"); }; }); };
    const pic = v.querySelector('[data-a="pic"]'); if (pic) pic.onclick = () => pick("fImage", async fs => { try { const im = await prepImage(fs[0], 512); const url = await upload(im.blob, im.ext, im.type); await sb.from("chats").update({avatar_url:url}).eq("id", c.id); toast("Rasm yangilandi ✅"); } catch(e){ uploadErr(e); } });
    const del = v.querySelector('[data-a="del"]'); if (del) del.onclick = async () => { if (!await confirmDlg("Guruhni o'chirish", "Guruh va undagi barcha xabarlar hamma uchun o'chiriladi.", "O'chirish")) return; close(); const { error } = await sb.from("chats").delete().eq("id", c.id); if (error) toast("O'chirib bo'lmadi"); };
  });
}
function chatMenu(e, c){
  if (!c) return;
  const r = e.currentTarget.getBoundingClientRect(); const items = [];
  if (c.type !== "saved") items.push(["info", c.type === "group" ? "Guruh ma'lumotlari" : "Profil", () => chatInfo(c)]);
  if (c.type === "group" && c.created_by === S.me) items.push(["gear", "Guruhni boshqarish", () => groupManageDlg(c)]);
  if (c.type === "dm") { const pr = dmPeer(c); items.push(["userPlus", S.contacts[pr] ? "Kontaktni tahrirlash" : "Kontaktga qo'shish", () => editContactDlg(pr)]); }
  if (c.type === "dm") { items.push(["phone", "Qo'ng'iroq", () => startCall(dmPeer(c), false)]); items.push(["video", "Video qo'ng'iroq", () => startCall(dmPeer(c), true)]); }
  items.push(["search", "Qidirish", toggleSearch]);
  if (c.type === "dm" || c.type === "saved") items.push(["trash", "Tarixni tozalash (mening xabarlarim)", async () => {
    if (!await confirmDlg("Tozalash", "Siz yuborgan barcha xabarlar bu chatdan o'chiriladi.", "Tozalash")) return;
    const { error } = await sb.from("messages").delete().eq("chat_id", c.id).eq("from_id", S.me); if (error) toast("Bo'lmadi"); else reloadMsgs();
  }, true]);
  showMenu(items, r.right - 260, r.bottom + 4);
}
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeMenu(); closePanel(); } });

/* =====================================================================
   QO'NG'IROQLAR (WebRTC). Signal Supabase Realtime broadcast orqali.
   ===================================================================== */
const ICE = CFG.ICE_SERVERS || [{urls:"stun:stun.l.google.com:19302"}];
const Call = {};
const chanCache = {};
function userChan(uid){
  if (chanCache[uid]) return chanCache[uid];
  chanCache[uid] = new Promise(res => {
    const ch = sb.channel("call-" + uid, {config:{broadcast:{self:false, ack:true}}});
    if (uid === S.me) ch.on("broadcast", {event:"sig"}, ({payload}) => onSignal(payload));
    ch.subscribe(st => { if (st === "SUBSCRIBED") res(ch); });
  });
  return chanCache[uid];
}
function listenCalls(){ userChan(S.me); }
async function signal(to, data){ const id = data.callId || Call.id; const ch = await userChan(to); return ch.send({type:"broadcast", event:"sig", payload:{callId:id, ...data, from:S.me, to}}); }
let ringTimer = null;
function ring(type){
  stopRing(); const pat = type === "in" ? [[660, 880], 1800] : [[440], 3000];
  const fn = () => beep(pat[0], type === "in" ? .35 : 1.2, .12);
  fn(); ringTimer = setInterval(fn, pat[1]);
  if (type === "in") try { navigator.vibrate && navigator.vibrate([400, 300, 400]); } catch(e){}
}
function stopRing(){ clearInterval(ringTimer); ringTimer = null; }
function callUI(){
  let el = $("#callui");
  const p = prof(Call.peer);
  const status = {calling:"Chaqirilmoqda…", ringing: Call.video ? "Kiruvchi video qo'ng'iroq" : "Kiruvchi qo'ng'iroq", connecting:"Ulanmoqda…", active:fmtDur((Date.now() - Call.t0) / 1000), reconnecting:"Qayta ulanmoqda…"}[Call.state] || "";
  if (!el) {
    el = document.createElement("div"); el.className = "call"; el.id = "callui";
    el.innerHTML = `<video class="rv hide" id="rv" autoplay playsinline></video><video class="lv hide" id="lv" autoplay playsinline muted></video>
      <div class="who"><div id="cav"></div><b id="cname"></b><span id="cstat"></span></div><div class="cb" id="cbtns"></div>`;
    document.body.appendChild(el);
  }
  el.classList.toggle("video-on", !!Call.video && Call.state !== "ringing");
  el.querySelector("#cav").innerHTML = userAvatar(Call.peer);
  el.querySelector("#cname").textContent = p.name || "Foydalanuvchi";
  el.querySelector("#cstat").textContent = status;
  const btns = el.querySelector("#cbtns");
  const key = Call.state + "|" + Call.muted + "|" + Call.camOff + "|" + Call.video;
  if (btns.dataset.key !== key) {
    btns.dataset.key = key;
    if (Call.state === "ringing") btns.innerHTML = `<label><button class="end" data-c="decline">${IC.phoneEnd}</button>Rad etish</label><label><button class="ok" data-c="accept">${Call.video ? IC.video : IC.phone}</button>Javob berish</label>`;
    else btns.innerHTML = `<label><button class="${Call.muted ? "off" : ""}" data-c="mute">${Call.muted ? IC.micOff : IC.mic}</button>Mikrofon</label>${Call.video ? `<label><button class="${Call.camOff ? "off" : ""}" data-c="cam">${Call.camOff ? IC.videoOff : IC.video}</button>Kamera</label><label><button data-c="flip">${IC.flip}</button>Almashtirish</label>` : ""}<label><button class="end" data-c="hang">${IC.phoneEnd}</button>Tugatish</label>`;
    btns.querySelectorAll("[data-c]").forEach(b => b.onclick = () => callAction(b.dataset.c));
  }
  const rv = el.querySelector("#rv"), lv = el.querySelector("#lv");
  if (Call.remote && rv.srcObject !== Call.remote) { rv.srcObject = Call.remote; rv.play().catch(() => {}); }
  if (Call.local && lv.srcObject !== Call.local) lv.srcObject = Call.local;
  rv.classList.toggle("hide", !(Call.video && Call.remote));
  lv.classList.toggle("hide", !(Call.video && Call.local && !Call.camOff));
}
function makePC(){
  const pc = new RTCPeerConnection({iceServers:ICE});
  pc.onicecandidate = e => { if (e.candidate) signal(Call.peer, {t:"ice", c:e.candidate.toJSON()}); };
  pc.ontrack = e => { Call.remote = e.streams[0] || new MediaStream([e.track]); callUI(); };
  pc.onconnectionstatechange = () => {
    const s = pc.connectionState;
    if (s === "connected") { if (Call.state !== "active") { Call.state = "active"; Call.t0 = Date.now(); stopRing(); clearInterval(Call.tick); Call.tick = setInterval(callUI, 1000); } else { Call.state = "active"; } callUI(); }
    else if (s === "disconnected") { if (Call.state === "active") { Call.state = "reconnecting"; callUI(); } }
    else if (s === "failed") { toast("Ulanib bo'lmadi. Internetni tekshiring."); endCall("failed", true); }
  };
  return pc;
}
async function getMedia(video){
  return navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true, autoGainControl:true}, video: video ? {facingMode:"user", width:{ideal:1280}, height:{ideal:720}} : false});
}
async function startCall(peer, video){
  if (!peer) return;
  if (Call.state) return toast("Siz allaqachon qo'ng'iroqdasiz");
  if (!window.RTCPeerConnection || !navigator.mediaDevices) return toast("Bu brauzer qo'ng'iroqni qo'llamaydi");
  Object.assign(Call, {id:uuid(), peer, video, role:"caller", state:"calling", muted:false, camOff:false, remote:null, local:null, pendingIce:[], t0:0, facing:"user"});
  await loadProfiles([peer]);
  callUI();
  try { Call.local = await getMedia(video); } catch(e){ toast(video ? "Kamera va mikrofonga ruxsat bering" : "Mikrofonga ruxsat bering"); return endCall("nomedia", false); }
  callUI();
  Call.pc = makePC();
  Call.local.getTracks().forEach(t => Call.pc.addTrack(t, Call.local));
  const offer = await Call.pc.createOffer();
  await Call.pc.setLocalDescription(offer);
  ring("out");
  try { await signal(peer, {t:"offer", sdp:offer.sdp, video, name:(S.profile && S.profile.name) || ""}); } catch(e){}
  Call.timeout = setTimeout(() => { if (Call.state === "calling") { toast(S.online[peer] ? "Javob bermadi" : "Foydalanuvchi hozir oflayn"); signal(peer, {t:"hangup"}); endCall("missed", true); } }, 45000);
}
async function onSignal(d){
  if (!d || d.to !== S.me) return;
  if (d.t === "offer") {
    if (Call.state) { signal(d.from, {t:"busy", callId:d.callId}); return; }
    Object.assign(Call, {id:d.callId, peer:d.from, video:!!d.video, role:"callee", state:"ringing", offer:d.sdp, muted:false, camOff:false, remote:null, local:null, pendingIce:[], t0:0, facing:"user"});
    if (d.name && !S.profiles[d.from]) S.profiles[d.from] = {id:d.from, name:d.name};
    loadProfiles([d.from]);
    callUI(); ring("in");
    if (document.hidden && "Notification" in window && Notification.permission === "granted") { try { new Notification((d.name || "Kimdir") + " qo'ng'iroq qilmoqda", {body:d.video ? "Video qo'ng'iroq" : "Ovozli qo'ng'iroq", tag:"call", icon:"icon-192.png"}); } catch(e){} }
    Call.timeout = setTimeout(() => { if (Call.state === "ringing") endCall("missed", false); }, 45000);
    return;
  }
  if (d.callId !== Call.id) return;
  if (d.t === "answer" && Call.pc) {
    clearTimeout(Call.timeout); Call.state = "connecting"; stopRing(); callUI();
    await Call.pc.setRemoteDescription({type:"answer", sdp:d.sdp});
    flushIce();
  } else if (d.t === "ice") {
    if (Call.pc && Call.pc.remoteDescription) Call.pc.addIceCandidate(d.c).catch(() => {}); else Call.pendingIce.push(d.c);
  } else if (d.t === "decline") { toast("Qo'ng'iroq rad etildi"); endCall("missed", true); }
  else if (d.t === "busy") { toast("Foydalanuvchi band"); endCall("missed", true); }
  else if (d.t === "hangup") { endCall(Call.state === "active" || Call.state === "reconnecting" ? "done" : "missed", Call.role === "caller"); }
}
function flushIce(){ const q = Call.pendingIce || []; Call.pendingIce = []; q.forEach(c => Call.pc.addIceCandidate(c).catch(() => {})); }
async function acceptCall(){
  stopRing(); clearTimeout(Call.timeout);
  Call.state = "connecting"; callUI();
  try { Call.local = await getMedia(Call.video); }
  catch(e){ try { Call.local = await getMedia(false); Call.video = false; toast("Kamera ochilmadi — ovozli rejimda"); } catch(e2){ toast("Mikrofonga ruxsat bering"); signal(Call.peer, {t:"decline"}); return endCall("missed", false); } }
  Call.pc = makePC();
  Call.local.getTracks().forEach(t => Call.pc.addTrack(t, Call.local));
  await Call.pc.setRemoteDescription({type:"offer", sdp:Call.offer});
  flushIce();
  const ans = await Call.pc.createAnswer(); await Call.pc.setLocalDescription(ans);
  signal(Call.peer, {t:"answer", sdp:ans.sdp});
  callUI();
}
async function callAction(a){
  if (a === "accept") return acceptCall();
  if (a === "decline") { signal(Call.peer, {t:"decline"}); return endCall("missed", false); }
  if (a === "hang") { signal(Call.peer, {t:"hangup"}); return endCall(Call.state === "active" || Call.state === "reconnecting" ? "done" : "missed", Call.role === "caller"); }
  if (a === "mute") { Call.muted = !Call.muted; Call.local && Call.local.getAudioTracks().forEach(t => t.enabled = !Call.muted); }
  if (a === "cam") { Call.camOff = !Call.camOff; Call.local && Call.local.getVideoTracks().forEach(t => t.enabled = !Call.camOff); }
  if (a === "flip" && Call.pc) {
    try {
      Call.facing = Call.facing === "user" ? "environment" : "user";
      const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:Call.facing}});
      const nt = s.getVideoTracks()[0]; const sender = Call.pc.getSenders().find(x => x.track && x.track.kind === "video");
      if (sender) await sender.replaceTrack(nt);
      Call.local.getVideoTracks().forEach(t => { t.stop(); Call.local.removeTrack(t); }); Call.local.addTrack(nt);
      const lv = $("#lv"); if (lv) { lv.srcObject = null; lv.srcObject = Call.local; lv.style.transform = Call.facing === "user" ? "scaleX(-1)" : "none"; }
    } catch(e){ toast("Kamerani almashtirib bo'lmadi"); }
  }
  callUI();
}
async function endCall(status, log){
  if (!Call.state) return;
  const peer = Call.peer, video = Call.video, dur = Call.t0 ? Math.round((Date.now() - Call.t0) / 1000) : 0;
  stopRing(); clearTimeout(Call.timeout); clearInterval(Call.tick);
  try { Call.pc && Call.pc.close(); } catch(e){}
  try { Call.local && Call.local.getTracks().forEach(t => t.stop()); } catch(e){}
  const el = $("#callui"); if (el) el.remove();
  for (const k of Object.keys(Call)) delete Call[k];
  if (log && peer && status !== "nomedia") {
    try { const { data } = await sb.rpc("get_or_create_dm", {other:peer}); if (data) await insertMsg(data, {kind:"call", media:[{type:"call", video, dur, status: status === "done" ? "done" : "missed"}]}); } catch(e){}
  }
}
window.addEventListener("beforeunload", () => { if (Call.state && Call.peer) signal(Call.peer, {t:"hangup"}); });

/* ---------- PWA ---------- */
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});

boot();
})();
