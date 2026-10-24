export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");
  if (!token) {
    return new Response(JSON.stringify({ error: "Bot token not configured" }), { status: 500 });
  }

  try {
    const { chat_id, text } = await req.json();
    if (!chat_id || !text) {
      return new Response(JSON.stringify({ error: "chat_id and text required" }), { status: 400 });
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id,
        text,
        parse_mode: "HTML"
      })
    });

    const data = await tgRes.json();
    if (!data.ok) {
      return new Response(JSON.stringify({ error: data.description }), { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to send" }), { status: 500 });
  }
};
