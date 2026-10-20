export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. API Route Handlers
    if (url.pathname.startsWith("/api/")) {

      // Connection test route
      if (url.pathname === "/api/test") {
        try {
          const { results } = await env.DB.prepare("SELECT 1 as connected").all();
          return Response.json({
            success: true,
            status: "Dynamic Worker Active",
            database: results ? "Connected" : "Error",
            brevoKeySet: !!env.BREVO_API_KEY,
            sender: env.SENDER_EMAIL || "soulconnect@ugtglobal.space"
          });
        } catch (err) {
          return Response.json({ success: false, error: err.message }, { status: 500 });
        }
      }

      // Password Reset API via Brevo Template 1
      if (url.pathname === "/api/password-reset" && request.method === "POST") {
        try {
          const { email, resetToken } = await request.json();
          if (!email) {
            return Response.json({ success: false, error: "Email is required" }, { status: 400 });
          }

          const appUrl = env.APP_URL || "https://ugtglobal.space";
          const resetLink = `${appUrl}/reset-password?token=${resetToken || ''}`;

          const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "accept": "application/json",
              "api-key": env.BREVO_API_KEY,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              sender: { 
                name: env.SENDER_NAME || "Universal Guard Trust", 
                email: env.SENDER_EMAIL || "soulconnect@ugtglobal.space" 
              },
              to: [{ email }],
              templateId: parseInt(env.BREVO_TEMPLATE_ID || "1", 10),
              params: {
                resetLink: resetLink
              }
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            return Response.json({ success: false, error: errText }, { status: 400 });
          }

          return Response.json({ success: true, message: "Reset email sent successfully" });
        } catch (err) {
          return Response.json({ success: false, error: err.message }, { status: 500 });
        }
      }

      return Response.json({ error: "Endpoint not found" }, { status: 404 });
    }

    // 2. Serve Static Frontend Assets with SPA Routing Fallback
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return env.ASSETS.fetch(new Request(new URL('/', request.url), request));
    }
  },
};