import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestPayload {
  assignmentId: string;
  academicDescription: string;
  targetSkills: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { assignmentId, academicDescription, targetSkills }: RequestPayload = await req.json();

    const simplifyPrompt = `Sen bir disleksi uzmanısın ve öğretmenlerin akademik dilini velilerin anlayabileceği basit Türkçeye çeviriyorsun.

Öğretmenin akademik açıklaması: "${academicDescription}"
Hedef beceriler: ${targetSkills.join(", ")}

Lütfen bu açıklamayı velinin kolayca anlayabileceği şekilde yeniden yaz. Teknik terimleri kullanma, günlük dille açıkla. 2-3 paragraf olsun. Açıklama şu formatta olmalı:
- Bugün ne yapacaksınız
- Bunun çocuğa nasıl yardımcı olacağı
- Evde nasıl uygulayacağı`;

    const gamesPrompt = `Sen bir disleksi uzmanısın ve veliler için evde yapılabilecek oyunlar öneriyorsun.

Öğretmenin hedefi: "${academicDescription}"
Hedef beceriler: ${targetSkills.join(", ")}

Lütfen evdeki basit malzemelerle (kalem, kağıt, oyuncaklar, mutfak eşyaları) yapılabilecek 3 eğlenceli oyun öner. Her oyun için:
- Oyun adı (kısa ve çekici)
- Oyun açıklaması (nasıl oynanır, adım adım)
- Gerekli malzemeler (evde kolayca bulunabilecek)
- Tahmini süre (dakika)
- Zorluk seviyesi (kolay, orta, zor)

JSON formatında yanıt ver:
[
  {
    "title": "Oyun Adı",
    "description": "Oyun açıklaması...",
    "materials": ["malzeme1", "malzeme2"],
    "duration_minutes": 15,
    "difficulty": "easy"
  }
]`;

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const [simplifiedResponse, gamesResponse] = await Promise.all([
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: simplifyPrompt }]
          }]
        })
      }),
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: gamesPrompt }]
          }]
        })
      })
    ]);

    const simplifiedData = await simplifiedResponse.json();
    const gamesData = await gamesResponse.json();

    const simplifiedText = simplifiedData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const gamesText = gamesData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let games = [];
    try {
      const jsonMatch = gamesText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        games = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Error parsing games JSON:", e);
      games = [
        {
          title: "Ses Bulma Oyunu",
          description: "Evdeki eşyaları kullanarak hedef sesleri bulma oyunu oynayın.",
          materials: ["Evdeki çeşitli eşyalar", "Kağıt", "Kalem"],
          duration_minutes: 15,
          difficulty: "easy"
        }
      ];
    }

    return new Response(
      JSON.stringify({
        simplifiedDescription: simplifiedText,
        games: games
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
