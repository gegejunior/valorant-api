export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const username = searchParams.get('username');
  const tagline = searchParams.get('tagline');
  const onlyRank = searchParams.get('onlyRank');
  const mmrChange = searchParams.get('mmrChange');
  
  try {
    const apiUrl = `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${username}/${tagline}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const currentRank = data.data.currenttierpatched || 'Non classé';
    const currentMMR = data.data.mmr_change_to_last_game || 0;
    
    if (onlyRank === 'true') {
      if (mmrChange === 'true' && currentMMR !== 0) {
        const changeSign = currentMMR > 0 ? '+' : '';
        return new Response(`${currentRank} (${changeSign}${currentMMR} MMR)`);
      }
      return new Response(currentRank);
    }
    
    return Response.json({ rank: currentRank, mmr_change: currentMMR });
  } catch (error) {
    return Response.json({ error: 'Erreur' }, { status: 500 });
  }
}
