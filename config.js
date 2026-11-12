// =====================================================================
//  HIKMAT sozlamalari — faqat shu faylni o'zgartirasiz.
//  Supabase > Project Settings > API (yoki "Connect") bo'limidan oling.
// =====================================================================
window.HIKMAT_CONFIG = {
  // Project URL, masalan: "https://abcdefghijk.supabase.co"
  SUPABASE_URL: "https://ejbcwklcjsjvrbzqevxi.supabase.co",

  // "anon public" kalit (uzun matn, eyJ... yoki sb_publishable_... bilan boshlanadi)
  SUPABASE_ANON_KEY: "sb_publishable_iu0VmvwcCP1BT5xsQ_3kdQ_7ViDemZx",

  // Qo'ng'iroqlar uchun serverlar. STUN bepul va ko'p hollarda yetarli.
  // Ba'zi mobil internetlarda qo'ng'iroq ulanmasa, TURN server qo'shing
  // (masalan metered.ca'dan bepul hisob ochib, bergan ma'lumotlarni shu yerga yozing):
  // { urls: "turn:....:3478", username: "...", credential: "..." }
  ICE_SERVERS: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }
  ]
};
