export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const username = searchParams.get('username');
  const tagline = searchParams.get('tagline');
  const onlyRank = searchParams.get('onlyRank');

  try {
    const riotId = `${username}#${tagline}`;
    const encodedRiotId = encodeURIComponent(riotId);
    const apiUrl = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${encodedRiotId}`;

    console.log("URL utilisée :", apiUrl);

    
   const response = await fetch(apiUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'application/json',
    'Origin': 'https://tracker.gg',
    'Referer': 'https://tracker.gg/'
  }
});

    

if (!response.ok) {
  const text = await response.text();
  console.log('TrackerGG API error:', response.status, text);
  return Response.json({ error: `Joueur non trouvé: ${username}#${tagline}`, details: text }, { status: response.status });
}


    const data = await response.json();
    const segments = data.data?.segments || [];

// Affiche les segments
console.log('Segments:', JSON.stringify(segments, null, 2));

// Cherche segment type 'competitive' ou 'overview' (selon ce que tu trouves)
const rankSegment = segments.find(s => s.type === 'competitive') || segments.find(s => s.type === 'overview');

if (!rankSegment) {
  return Response.json({ error: 'Données de rang non trouvées' }, { status: 404 });
}

// Inspecte les stats disponibles
console.log('Rank segment stats:', JSON.stringify(rankSegment.stats, null, 2));

// Exemple d’extraction du rang, à adapter selon la structure :
const rankData = rankSegment.stats?.rank || rankSegment.stats?.competitiveTier;

const currentRank = rankData?.displayValue || 'Non classé';

if (!rankData) {
  return Response.json({ error: 'Données de rang absentes dans segment' }, { status: 404 });
}

if (onlyRank === 'true') {
  return new Response(currentRank);
}

return Response.json({
  rank: currentRank,
  username: `${username}#${tagline}`,
  region: region?.toUpperCase() ?? 'N/A'
});
      
