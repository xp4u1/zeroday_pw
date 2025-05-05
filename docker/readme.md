# Quickstart

```bash
# Create environment file
$ touch .env && vim .env

# Create following variables in your .env file
CLOUDFLARE_EMAIL=your@email.com
CLOUDFLARE_DNS_API_TOKEN=top-secret-api-token

# Create the database
$ docker compose run portal node scripts/setup.js

# Start proxy and portal
$ docker compose up
```
