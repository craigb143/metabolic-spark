export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    const email = url.searchParams.get('email') || '';
    if (!email) {
      return new Response(JSON.stringify({ error: 'No email' }), { headers });
    }

    const key = email.toLowerCase().trim();

    if (request.method === 'POST') {
      const body = await request.json();
      await env.METABOLIC_SPARK.put(key, JSON.stringify(body));
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    if (request.method === 'GET') {
      const data = await env.METABOLIC_SPARK.get(key);
      return new Response(data || '{}', { headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { headers });
  }
};
