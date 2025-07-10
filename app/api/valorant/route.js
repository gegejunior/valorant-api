export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const username = searchParams.get('username');
  const tagline = searchParams.get('tagline');

  try {
    const riotId = `${username}#${tagline}`;
    const encodedRiotId = encodeURIComponent(riotId);
    const apiUrl = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${encodedRiotId}`;

    const response = await fetch(apiUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'application/json',
    'TRN-Api-Key': '4bcddc11-91e5-420c-a793-ef34f8b58d63',
    'Referer': 'https://valorant-api-plum.vercel.app/' // Remplace par ton vrai domaine
  }
});

    if (!response.ok) {
      const text = await response.text();
      return new Response(text, { status: response.status, headers: { 'Content-Type': 'application/json' } });
    }

    const data = await response.json();

    // Renvoie directement la réponse brute JSON pour qu'on puisse voir la structure
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

