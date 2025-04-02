# Quickstart

```bash
# Create environment file
$ touch .env && vim .env

# Create following variables in your .env file
CLOUDFLARE_EMAIL=your@email.com
CLOUDFLARE_DNS_API_TOKEN=top-secret-api-token

# Create an empty certificate database
$ touch acme.json && chmod 600 acme.json

# Start proxy
$ docker compose up
```

# Idea

```
portal.zeroday.pw
  /    -> React application
  /api -> Express Backend

*.challenge.zeroday.pw
  challenge containers, dynamically assigned

          zeroday.pw -> portal.zeroday.pw (redirect)
challenge.zeroday.pw -> portal.zeroday.pw (redirect)
```
