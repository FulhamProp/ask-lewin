const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// ---- All Knight Frank Fulham listings (update monthly) ------------------
const LISTINGS = [
  // ---- ORIGINAL 18 (with images from branch page) ----
  { id:'169828445', street:'Bowerdean Street', area:'SW6', price:3700000, type:'Terraced house', beds:6, baths:4, status:'active', reduced:true, garden:true, parking:false, chainFree:false, condition:'refurbished', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/c16d55c1d/169828445/c16d55c1d3a6f80aac2ac3907e940305_max_476x317.jpeg', features:['Complete back-to-brick refurbishment','Architect designed throughout','West-facing Lion House','Exceptional specification'] },
  { id:'89700669', street:'Stokenchurch Street', area:'Parsons Green SW6', price:6000000, type:'Terraced house', beds:7, baths:7, status:'active', reduced:false, garden:true, parking:true, chainFree:false, condition:'excellent', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/f35a35ce0/89700669/f35a35ce033d543ccb07edb55fe7920f_max_476x317.jpeg', features:['Double-fronted corner Lion House','Over 5000 sq ft','Off-street parking','Peterborough Estate'] },
  { id:'172781399', street:'Musgrave Crescent', area:'SW6', price:4250000, type:'End of terrace', beds:6, baths:5, status:'active', reduced:true, garden:true, parking:false, chainFree:false, condition:'period', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/41798f6e2/172781399/41798f6e224eb61b12abd773cde8030d_max_476x317.jpeg', features:['Overlooks Eel Brook Common','Five floors','End of terrace extra light','Victorian period features'] },
  { id:'88163772', street:'Crondace Road', area:'Parsons Green SW6', price:4200000, type:'Terraced house', beds:7, baths:6, status:'active', reduced:false, garden:true, parking:false, chainFree:false, condition:'period', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/19d9ea41e/88163772/19d9ea41ed6c0fa7c76bd6c0e172b54d_max_476x317.jpeg', features:['Between the commons','Seven bedrooms','Double reception','Heart of Parsons Green'] },
  { id:'174956834', street:'Ellerby Street', area:'SW6', price:4000000, type:'Semi-detached', beds:6, baths:4, status:'active', reduced:false, garden:true, parking:false, chainFree:false, condition:'refurbished', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/2beab798a/174956834/2beab798a2b13197a7bc7255d2eddbe6_max_476x317.jpeg', features:['50ft landscaped garden','Interior designed throughout','Semi-detached extra light','Quiet alphabet street'] },
  { id:'88294737', street:'Chiddingstone Street', area:'Peterborough Estate SW6', price:3999950, type:'Terraced house', beds:6, baths:4, status:'active', reduced:false, garden:true, parking:false, chainFree:false, condition:'excellent', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/d1167b9f7/88294737/d1167b9f72d8fe7e698cb5b9344759dc_max_476x317.jpeg', features:['Lion House over 3700 sq ft','Self-contained lower ground','Peterborough Estate','Close to outstanding schools'] },
  { id:'89146326', street:'Wyfold Road', area:'SW6', price:3500000, type:'Penthouse', beds:3, baths:3, status:'active', reduced:false, garden:false, parking:true, chainFree:false, condition:'excellent', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/789e97b98/89146326/789e97b98b42ebb03261d8f1ac49ce60_max_476x317.jpeg', features:['Private roof garden 360 views','Wraparound terrace','Underground parking','Top two floors'] },
  { id:'88789545', street:'Barclay Road', area:'SW6', price:3350000, type:'Terraced house', beds:5, baths:4, status:'active', reduced:false, garden:true, parking:false, chainFree:false, condition:'new', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/7fc28c624/88789545/7fc28c624976cf0864dad40dc6c7ebe2_max_476x317.jpeg', features:['42ft garden','Next to Eel Brook Common','Steps from Parsons Green tube','Turn-key condition'] },
  { id:'89126442', street:'Holmead Road', area:'SW6 Chelsea border', price:3250000, type:'Terraced house', beds:5, baths:4, status:'active', reduced:false, garden:true, parking:false, chainFree:false, condition:'refurbished', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/037e33b39/89126442/037e33b39a679d39ce1c8ae93185dba7_max_476x317.jpeg', features:['Complete back-to-brick refurb','Chelsea border','Moore Park Estate','Exceptional finish'] },
  { id:'174206138', street:'Narborough Street', area:'SW6', price:2997500, type:'Terraced house', beds:4, baths:4, status:'active', reduced:true, garden:true, parking:false, chainFree:false, condition:'refurbished', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/2530a832b/174206138/2530a832b745381e8062f32ce94aeb5c_max_476x317.jpeg', features:['Completely refurbished throughout','By South Park','4 bathrooms','Reduced — motivated seller'] },
  { id:'173427398', street:'Bovingdon Road', area:'Peterborough Estate SW6', price:2990000, type:'Terraced house', beds:6, baths:4, status:'active', reduced:true, garden:true, parking:false, chainFree:false, condition:'period', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/6662b090b/173427398/6662b090b6a7c2708ccebee49f14666f_max_476x317.jpeg', features:['South-facing garden','3000 sq ft Lion House','Peterborough Estate','Period features'] },
  { id:'172750805', street:'Coniger Road', area:'Peterborough Estate SW6', price:2850000, type:'Terraced house', beds:5, baths:4, status:'stc', reduced:true, garden:true, parking:false, chainFree:false, condition:'period', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/af48b3192/172750805/af48b3192572231122b36082d387af81_max_476x317.jpeg', features:['Lion House','Peterborough Estate','West-facing garden','Sold STC'] },
  { id:'87433854', street:'Fernhurst Road', area:'SW6', price:2500000, type:'Terraced house', beds:4, baths:4, status:'active', reduced:true, garden:true, parking:false, chainFree:false, condition:'period', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/da98f3612/87433854/da98f3612a4bb45362bfedf0394910d7_max_476x317.jpeg', features:['32ft garden','Three floors','Period cornicing and wooden floors','Reduced'] },
  { id:'87994149', street:'Sunlight Mews', area:'SW6', price:2500000, type:'Mews house', beds:4, baths:3, status:'active', reduced:false, garden:false, parking:false, chainFree:false, condition:'excellent', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/c506bed36/87994149/c506bed369522bdbae2ddaf3faad52b9_max_476x317.jpeg', features:['Private gated development','Lateral accommodation','Unique mews format','Only a handful of homes'] },
  { id:'87927780', street:'Acfold Road', area:'SW6', price:2500000, type:'Terraced house', beds:4, baths:3, status:'active', reduced:true, garden:true, parking:false, chainFree:false, condition:'refurbished', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/fda430764/87927780/fda4307649a61e0bea47750a55271c3a_max_476x317.jpeg', features:['Open-plan kitchen-diner','Scope to extend STPP','Near Kings Road','Victorian reimagined'] },
  { id:'171608042', street:'Shottendane Road', area:'Parsons Green SW6', price:2450000, type:'Terraced house', beds:4, baths:4, status:'active', reduced:false, garden:true, parking:false, chainFree:false, condition:'good', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/2a2eadaef/171608042/2a2eadaefd6b9869627193f750b62985_max_476x317.jpeg', features:['Heart of Parsons Green','West-facing garden','4 bed 4 bath','New listing'] },
  { id:'172164335', street:'Rivermead Court, Ranelagh Gardens', area:'SW6', price:2400000, type:'Flat', beds:4, baths:2, status:'active', reduced:false, garden:false, parking:false, chainFree:false, condition:'excellent', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/8fb759ef9/172164335/8fb759ef93fa54becc0f006d0347dc97_max_476x317.jpeg', features:['River Thames views','1930s gated mansion block','By Hurlingham Club','Top floor'] },
  { id:'89020185', street:'Gowan Avenue', area:'SW6', price:2350000, type:'Terraced house', beds:5, baths:4, status:'active', reduced:false, garden:true, parking:false, chainFree:false, condition:'excellent', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/1e64e6ef8/89020185/1e64e6ef8fb12961d3ee557e49842aab_max_476x317.jpeg', features:['25ft south-facing garden','Period features contemporary finish','5 bedrooms','New listing'] },
  { id:'173775929', street:'St. Maur Road', area:'Parsons Green SW6', price:2300000, type:'Terraced house', beds:3, baths:2, status:'stc', reduced:false, garden:true, parking:false, chainFree:false, condition:'good', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/9b3e91196/173775929/9b3e91196920da1c05b34a452cdb84dc_max_476x317.jpeg', features:['Prime Parsons Green','Moments from tube','West-facing','Sold STC'] },
  { id:'89604249', street:'Crondace Road', area:'Parsons Green SW6', price:2250000, type:'Terraced house', beds:5, baths:2, status:'stc', reduced:false, garden:true, parking:false, chainFree:false, condition:'period', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/a3f2d8295/89604249/a3f2d8295e72cce7b34c42a7e8d48c0b_max_476x317.jpeg', features:['Between the two commons','5 bedrooms','Period features','Sold STC'] },
  { id:'88537530', street:'Crondace Road', area:'SW6', price:2250000, type:'Terraced house', beds:5, baths:2, status:'stc', reduced:false, garden:true, parking:false, chainFree:false, condition:'period', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/fe078b0f0/88537530/fe078b0f06fccfb4b59f34f0578f8b75_max_476x317.jpeg', features:['Between the two commons','Huge potential','Period features','Sold STC'] },
  { id:'88215543', street:'Linver Road', area:'Parsons Green SW6', price:2250000, type:'Terraced house', beds:4, baths:3, status:'stc', reduced:false, garden:true, parking:false, chainFree:false, condition:'good', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/55eedbdc4/88215543/55eedbdc4bf32c49a0bea5c63a4c6480_max_476x317.jpeg', features:['South-westerly garden','Blossom tree-lined street','By Hurlingham Park','Sold STC'] },
  { id:'171954887', street:'Niton Street', area:'SW6', price:2250000, type:'Terraced house', beds:4, baths:3, status:'stc', reduced:false, garden:true, parking:false, chainFree:false, condition:'excellent', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/83e97368b/171954887/83e97368bebf399e92e85fecf11465f2_max_476x317.jpeg', features:['50ft south-facing garden','Turn-key condition','Immaculate throughout','Sold STC'] },
  { id:'174410510', street:'Fernhurst Road', area:'SW6', price:2200000, type:'Terraced house', beds:4, baths:4, status:'active', reduced:true, garden:true, parking:false, chainFree:true, condition:'excellent', img:'https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/1654eee00/174410510/1654eee00a4d935980b631a46f3df292_max_476x317.jpeg', features:['2150 sq ft','No chain','25ft garden rear access','Option for off-street parking'] },
  // ---- NEW LISTINGS from page 2 & 3 ----
  { id:'174924185', street:'Dolby Road', area:'SW6', price:2125000, type:'Terraced house', beds:5, baths:4, status:'active', reduced:true, garden:true, parking:false, chainFree:false, condition:'good', img:'https://media.rightmove.co.uk/property-photo/a8174648b/174924185/a8174648bb9fee914de3f8ab53a2aca0.jpeg', features:['5 beds 4 baths','Garden','Near Hurlingham Club','Close to Parsons Green tube'] },
  { id:'166897892', street:'Broomhouse Lane', area:'SW6', price:1950000, type:'Terraced house', beds:5, baths:2, status:'active', reduced:true, garden:true, parking:true, chainFree:false, condition:'period', img:'https://media.rightmove.co.uk/property-photo/6e446d457/166897892/6e446d4570a1b4ee3881019197bbe545.jpeg', features:['Almost 7m wide — unusually lateral','Driveway parking for 2 cars inc EV','Private rear garden','Scope to extend STPP'] },
  { id:'89636910', street:'Dawes Road', area:'SW6', price:1650000, type:'Terraced house', beds:4, baths:2, status:'active', reduced:false, garden:true, parking:false, chainFree:true, condition:'refurbished', img:'https://media.rightmove.co.uk/property-photo/88d12c4f1/89636910/88d12c4f16ffbb71538f5f864ff3d76b.jpeg', features:['Refurbished to exacting standard within 12 months','Chain free turn-key','Extended open-plan kitchen with bi-fold doors','Underfloor heating ground floor'] },
  // ---- REMAINING IDs (to be populated — add street/price/beds when known) ----
  // 89053047, 89428416, 88528824, 174792452, 88621563, 174550310, 89275776,
  // 173673293, 89692710, 89142249, 89456991, 174355940, 90115002
  // Add these using the same format above once you have their details.
];

const ACTIVE = LISTINGS.filter(l => l.status !== 'stc');
const leads = [];

// ---- Routes -------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, listings: LISTINGS.length, active: ACTIVE.length, aiReady: !!process.env.ANTHROPIC_API_KEY });
});

app.post('/api/notify', (req, res) => {
  const { email, brief } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email.' });
  }
  const lead = { email, brief: brief || null, capturedAt: new Date().toISOString() };
  leads.push(lead);
  console.log('New lead:', lead);
  res.json({ ok: true });
});

app.get('/api/leads', (_req, res) => res.json({ count: leads.length, leads }));

app.post('/api/match', async (req, res) => {
  const { brief } = req.body || {};
  if (!brief || typeof brief !== 'string' || brief.trim().length < 5) {
    return res.status(400).json({ error: 'Please describe what you are looking for.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI search not configured. Please contact Lewin directly.' });
  }

  // SW6 market context for budget reality checking
  const marketContext = `
SW6 MARKET REALITY (use to advise buyers with unrealistic budgets):
- Studio/1 bed flat: £400k–£700k
- 2 bed flat: £600k–£1.1m
- 2 bed house: £900k–£1.4m
- 3 bed terraced house: £1.2m–£2m
- 4 bed terraced house: £1.6m–£3m
- 5 bed terraced house: £2m–£4.5m
- 6+ bed Lion House: £3m–£6.5m
Parsons Green / Peterborough Estate commands a 15-25% premium over Sands End / Dawes Road area.
`;

  const system = `You are Lewin Craig-Corbett, Knight Frank Fulham agent with 10+ years SW6 experience.

${marketContext}

BUDGET REALITY CHECK: If the buyer's stated budget is significantly below what their requirements would cost in SW6, you MUST flag this honestly. Return a "budgetWarning" field in your JSON explaining what their budget realistically buys, and what budget they'd need for what they want.

Match the brief to the best listings and return ONLY valid compact JSON — no markdown, no backticks:
{"budgetWarning":null,"matches":[{"id":"174410510","score":85,"headline":"Best match — chain free and turn-key","pros":["No chain exactly as requested","Garden ticks outdoor space need"],"cons":["Fernhurst Road is not Peterborough Estate","25ft garden is modest"],"verdict":"This is the one I'd book first — chain free with a garden at this price is rare."}]}

If budget is realistic, set budgetWarning to null. If unrealistic, set it to a helpful plain-English string like: "A 4-bed house in SW6 starts at around £1.6m — with £800k you're looking at a 2-bed flat. I have some great options at that level if you'd like to see them."

Rules: max 4 results by score descending, scores 45-92 range, be honest about price vs budget, pros/cons specific to brief, one-sentence verdicts.`;

  const userMsg = `Buyer brief: "${brief.trim()}"\n\nListings:\n${JSON.stringify(ACTIVE.map(l => ({
    id: l.id, street: l.street, area: l.area, price: l.price,
    type: l.type, beds: l.beds, baths: l.baths,
    reduced: l.reduced, garden: l.garden, parking: l.parking,
    chainFree: l.chainFree, condition: l.condition,
    features: l.features.slice(0, 2),
  })))}`;

  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content: userMsg }],
      }),
      timeout: 30000,
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('Anthropic error:', errText.slice(0, 300));
      throw new Error(`Anthropic returned ${aiRes.status}`);
    }

    const aiData = await aiRes.json();
    const text = aiData.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());

    // Attach listing data (including images) to each match
    const enriched = (parsed.matches || []).map(m => ({
      ...m,
      listing: LISTINGS.find(l => l.id === m.id) || null,
    })).filter(m => m.listing);

    res.json({
      ok: true,
      budgetWarning: parsed.budgetWarning || null,
      matches: enriched,
      total: ACTIVE.length,
    });
  } catch (err) {
    console.error('Match error:', err.message);
    res.status(502).json({ error: 'Could not complete search. Please try again in a moment.' });
  }
});

app.listen(PORT, () => console.log(`Ask Lewin running on port ${PORT}`));
