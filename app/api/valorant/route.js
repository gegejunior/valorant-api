export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const username = searchParams.get('username');
  const tagline = searchParams.get('tagline');
  const onlyRank = searchParams.get('onlyRank');
  const mmrChange = searchParams.get('mmrChange');
  
  try {
    // Utilisation d'une API alternative gratuite
    const apiUrl = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${username}%23${tagline}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      return Response.json({ error: `Joueur non trouvé: ${username}#${tagline}` }, { status: 404 });
    }
    
    const data = await response.json();
    
    // Extraction des données de rang
    const segments = data.data?.segments || [];
    const overviewSegment = segments.find(s => s.type === 'overview');
    
    if (!overviewSegment) {
      return Response.json({ error: 'Données de rang non trouvées' }, { status: 404 });
    }
    
    const rankData = overviewSegment.stats?.rank;
    const currentRank = rankData?.displayValue || 'Non classé';
    
    // Pour la réponse simple
    if (onlyRank === 'true') {
      return new Response(currentRank);
    }
    
    return Response.json({ 
      rank: currentRank,
      username: `${username}#${tagline}`,
      region: region.toUpperCase()
    });
    
  } catch (error) {
    return Response.json({ error: `Erreur: ${error.message}` }, { status: 500 });
  }
}
