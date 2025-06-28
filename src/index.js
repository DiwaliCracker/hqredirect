export default {
  async fetch(request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("url");

    if (!path || !path.startsWith("/")) {
      return new Response("Missing or invalid 'url' parameter", { status: 400 });
    }

    const base = "bigcdn.cc";
    const max = 100;

    // Try s1 to s100
    for (let i = 1; i <= max; i++) {
      const testUrl = `https://s${i}.${base}${path}`;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500); // 2.5 sec timeout

        const res = await fetch(testUrl, {
          method: "GET",
          headers: {
            "Range": "bytes=0-0", // Only fetch 1 byte to avoid loading full video
            "User-Agent": "Mozilla/5.0"
          },
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (res.status === 206 || res.status === 200) {
          return Response.redirect(testUrl, 302);
        }

      } catch (err) {
        // Ignore fetch timeout or network errors, try next
      }
    }

    return new Response("No valid server found", { status: 404 });
  }
}
