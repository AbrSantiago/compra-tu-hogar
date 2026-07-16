const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', 'https://images.unsplash.com/photo-1576941089067-2de3c901e126',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6', 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773', 'https://images.unsplash.com/photo-1524813686514-a57563d77965',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', 'https://images.unsplash.com/photo-1449844908441-8829872d2607',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', 'https://images.unsplash.com/photo-1472224371017-088a7d117a3a',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
  'https://images.unsplash.com/photo-1460317442991-0c2094391a17', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
  'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff', 'https://images.unsplash.com/photo-1504233527756-2c13a4931a74'
].map(url => `${url}?auto=format&fit=crop&w=800&q=80`);

export const getPropertyImage = (id: number): string => {
  return PROPERTY_IMAGES[id % PROPERTY_IMAGES.length];
};