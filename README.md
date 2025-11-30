# Workshop ERC-1155

## Setup

```bash
npm install
```

Crea un file `.env` con:
- `PRIVATE_KEY` - chiave privata wallet (senza 0x)
- `POLYGONSCAN_API_KEY` - API key per verificare i contratti

## Comandi

```bash
# Test
npm test
npm run compile

# Deploy locale
npm run deploy:local

# Deploy testnet
npm run deploy:sepolia
npm run deploy:amoy

# Mint
npm run mint:sepolia
npm run mint:amoy
```

## Note

- Supporta solo token ID 1
- Max supply: 1000 tokens
- Solo owner può mintare
