export default async (req: Request) => {
  const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");
  if (!token) return new Response("ok");

  try {
    const update = await req.json();
    const msg = update.message;
    if (!msg || !msg.text) return new Response("ok");

    if (msg.text.startsWith("/start")) {
      const chatId = msg.chat.id;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Ваш Chat ID: <code>${chatId}</code>\n\nСкопируйте его и вставьте в поле на сайте Акбарс.`,
          parse_mode: "HTML"
        })
      });
    }
  } catch (e) {}

  return new Response("ok");
};
