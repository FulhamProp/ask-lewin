const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// ---- Live Knight Frank Fulham listings (update monthly) -----------------
const LISTINGS = [
  { id:'169828445', street:'Bowerdean Street', area:'SW6', price:3700000, type:'Terraced house', beds:6, baths:4, status:'active', reduced:true, garden:true, gardenFt:null, parking:false, chainFree:false, condition:'refurbished', features:['Complete back-to-brick refurbishment','Architect designed throughout','West-facing Lion House','Exceptional specification throughout'] },
  { id:'89700669', street:'Stokenchurch Street', area:'Parsons Green SW6', price:6000000, type:'Terraced house', beds:7, baths:7, status:'active', reduced:false, garden:true, gardenFt:null, parking:true, chainFree:false, condition:'excellent', features:['Double-fronted corner Lion House','Over 5000 sq ft','Off-street parking','Peterborough Estate — SW6\'s most prestigious address'] },
  { id:'172781399', street:'Musgrave Crescent', area:'SW6', price:4250000, type:'End of terrace', beds:6, baths:5, status:'active', reduced:true, garden:true, gardenFt:null, parking:false, chainFree:false, condition:'period', features:['Overlooks Eel Brook Common','Five floors of accommodation','End of terrace — extra light on three sides','Victorian period features throughout'] },
  { id:'88163772', street:'Crondace Road', area:'Parsons Green SW6', price:4200000, type:'Terraced house', beds:7, baths:6, status:'active', reduced:false, garden:true, gardenFt:null, parking:false, chainFree:false, condition:'period', features:['Between Eel Brook Common and South Park','Seven bedrooms','Fabulous double reception room','Heart of Parsons Green'] },
  { id:'174956834', street:'Ellerby Street', area:'SW6', price:4000000, type:'Semi-detached', beds:6, baths:4, status:'active', reduced:false, garden:true, gardenFt:50, parking:false, chainFree:false, condition:'refurbished', features:['50ft landscaped garden','Interior designed to exceptional standard','Semi-detached — extra space and light','Quiet alphabet street'] },
  { id:'88294737', street:'Chiddingstone Street', area:'Peterborough Estate SW6', price:3999950, type:'Terraced house', beds:6, baths:4, status:'active', reduced:false, garden:true, gardenFt:null, parking:false, chainFree:false, condition:'excellent', features:['Lion House over 3700 sq ft','Self-contained lower ground floor','Peterborough Estate','Close to outstanding local schools'] },
  { id:'89146326', street:'Wyfold Road', area:'SW6', price:3500000, type:'Penthouse', beds:3, baths:3, status:'active', reduced:false, garden:false, gardenFt:null, parking:true, chainFree:false, condition:'excellent', features:['Private roof garden with 360 degree views','Wraparound terrace','Underground parking','Top two floors of building'] },
  { id:'88789545', street:'Barclay Road', area:'SW6', price:3350000, type:'Terraced house', beds:5, baths:4, status:'active', reduced:false, garden:true, gardenFt:42, parking:false, chainFree:false, condition:'new', features:['42ft garden','Next to Eel Brook Common','Steps from Parsons Green tube','Turn-key — just a few years old'] },
  { id:'89126442', street:'Holmead Road', area:'SW6 Chelsea border', price:3250000, type:'Terraced house', beds:5, baths:4, status:'active', reduced:false, garden:true, gardenFt:null, parking:false, chainFree:false, condition:'refurbished', features:['Complete back-to-brick refurbishment','Moore Park Estate on Chelsea border','Exceptional finish throughout','5 bedrooms 4 bathrooms'] },
  { id:'174206138', street:'Narborough Street', area:'SW6', price:2997500, type:'Terraced house', beds:4, baths:4, status:'active', reduced:true, garden:true, gardenFt:null, parking:false, chainFree:false, condition:'refurbished', features:['Completely refurbished throughout','South Park pocket','4 bathrooms','Reduced — motivated seller'] },
  { id:'173427398', street:'Bovingdon Road', area:'Peterborough Estate SW6', price:2990000, type:'Terraced house', beds:6, baths:4, status:'active', reduced:true, garden:true, gardenFt:null, parking:false, chainFree:false, condition:'period', features:['South-facing garden','3000 sq ft Lion House','Peterborough Estate','Period features throughout'] },
  { id:'87433854', street:'Fernhurst Road', area:'SW6', price:2500000, type:'Terraced house', beds:4, baths:4, status:'active', reduced:true, garden:true, gardenFt:32, parking:false, chainFree:false, condition:'period', features:['32ft garden','Three floors','Period cornicing and wooden floors','Reduced — price movement possible'] },
  { id:'87994149', street:'Sunlight Mews', area:'SW6', price:2500000, type:'Mews house', beds:4, baths:3, status:'active', reduced:false, garden:false, gardenFt:null, parking:false, chainFree:false, condition:'excellent', features:['Private gated development','Lateral accommodation','Unique mews format','Handful of homes in development'] },
  { id:'87927780', street:'Acfold Road', area:'SW6', price:2500000, type:'Terraced house', beds:4, baths:3, status:'active', reduced:true, garden:true, gardenFt:null, parking:false, chainFree:false, condition:'refurbished', features:['Open-plan kitchen-diner','Scope to extend STPP','Easy reach of Kings Road','Victorian reimagined for modern living'] },
  { id:'171608042', street:'Shottendane Road', area:'Parsons Green SW6', price:2450000, type:'Terraced house', beds:4, baths:4, status:'active', reduced:false, garden:true, gardenFt:null, parking:false, chainFree:false, condition:'good', features:['Heart of Parsons Green','West-facing garden','4 bedrooms 4 bathrooms','New listing'] },
  { id:'172164335', street:'Rivermead Court, Ranelagh Gardens', area:'SW6', price:2400000, type:'Flat', beds:4, baths:2, status:'active', reduced:false, garden:false, gardenFt:null, parking:false, chainFree:false, condition:'excellent', features:['River Thames views','1930s gated mansion block','By the Hurlingham Club','Top floor — maximum light'] },
  { id:'89020185', street:'Gowan Avenue', area:'SW6', price:2350000, type:'Terraced house', beds:5, baths:4, status:'active', reduced:false, garden:true, gardenFt:25, parking:false, chainFree:false, condition:'excellent', features:['25ft south-facing garden','Period features with contemporary finish','5 bedrooms','New listing'] },
  { id:'174410510', street:'Fernhurst Road', area:'SW6', price:2200000, type:'Terraced house', beds:4, baths:4, status:'active', reduced:true, garden:true, gardenFt:25, parking:false, chainFree:true, condition:'excellent', features:['2150 sq ft','No chain','25ft garden with rear access','Option for off-street parking'] },
];

// ---- Lead store (replace with DB/Airtable before relying on this) ------
const leads = [];

// ---- Routes -------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, listings: LISTINGS.length, aiReady: !!process.env.ANTHROPIC_API_KEY });
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
    return res.status(503).json({ error: 'AI search is not yet configured. Please contact Lewin directly.' });
  }

  const system = `You are Lewin Craig-Corbett, a property agent at Knight Frank Fulham with over 10 years experience selling homes in SW6. You know every street, every price point, every quirk of the Fulham market intimately.

Given a buyer's brief and a list of current properties, return ONLY valid compact JSON — no markdown, no backticks, no explanation:
{"matches":[{"id":"174410510","score":88,"headline":"Strongest match — chain free and move-in ready","pros":["No chain exactly as requested","25ft garden ticks your outdoor space need","2150 sq ft gives you the space you asked for"],"cons":["Fernhurst Road is not as prime as Peterborough Estate","25ft garden is modest if you want space to entertain"],"verdict":"This is the one I would book first. Chain free with a garden at this price in SW6 is rare right now and it will not hang around."}]}

Hard rules:
- Return 3 to 4 results maximum, ordered by score descending
- Scores must vary meaningfully — range from 45 to 92, never cluster everything above 80
- If budget is mentioned, penalise properties significantly over it
- Pros must be specific and reference the brief directly — no generic lines
- Cons must be honest — flag real issues like main roads, leasehold, no garden, chain, price vs budget
- Verdict must be one sentence, opinionated, direct, written in first person as Lewin — no waffle
- Do not include sold STC properties unless they are an exceptional match and flag them clearly`;

  const userMsg = `Buyer brief: "${brief.trim()}"\n\nListings:\n${JSON.stringify(LISTINGS.map(l => ({
    id: l.id,
    street: l.street,
    area: l.area,
    price: l.price,
    type: l.type,
    beds: l.beds,
    baths: l.baths,
    reduced: l.reduced,
    garden: l.garden,
    gardenFt: l.gardenFt,
    parking: l.parking,
    chainFree: l.chainFree,
    condition: l.condition,
    features: l.features.slice(0, 2),
  })))}`;

  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
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
      console.error('Anthropic error body:', errText);
      throw new Error(`Anthropic returned ${aiRes.status}: ${errText.slice(0, 200)}`);
    }
    const aiData = await aiRes.json();
    const text = aiData.content.filter(b => b.type === 'text').map(b => b.text).join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json({ ok: true, matches: parsed.matches || [], total: LISTINGS.length });
  } catch (err) {
    console.error('Match error:', err.message);
    res.status(502).json({ error: 'Could not complete search. Please try again in a moment.' });
  }
});

app.listen(PORT, () => console.log(`Ask Lewin running on port ${PORT}`));
