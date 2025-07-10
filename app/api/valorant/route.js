export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'Joueur';
  const onlyRank = searchParams.get('onlyRank');
  const mmrChange = searchParams.get('mmrChange');
  
  // Version test - remplacez par vos vraies données plus tard
  const testRank = 'Diamond 2';
  const testMMR = '+18';
  
  if (onlyRank === 'true') {
    if (mmrChange === 'true') {
      return new Response(`${testRank} (${testMMR} MMR)`);
    }
    return new Response(testRank);
  }
  
  return Response.json({ 
    rank: testRank,
    mmr_change: testMMR,
    username: username,
    status: 'API Test - Fonctionne!'
  });
}
