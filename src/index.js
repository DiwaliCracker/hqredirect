export default {
  async fetch(request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("url");

    if (!path) {
      return new Response("Missing 'url' parameter", { status: 400 });
    }

    const baseSubdomain = "bigcdn.cc";
    const maxTries = 100;

    for (let i = 1; i <= maxTries; i++) {
      const sub = `s${i}`;
      const fullUrl = `https://${sub}.${baseSubdomain}${path}`;

      try {
        const res = await fetch(fullUrl, {
          method: "HEAD",
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });

        if (res.status === 200) {
          // Found valid URL
          return Response.redirect(fullUrl, 302);
        }
      } catch (e) {
        // Skip this one, try next
      }
    }

    return new Response("No valid server found", { status: 404 });
  }
}
