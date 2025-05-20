## Deploy zeroday.pw

```bash
# Start cluster
$ minikube start --cni=calico --memory 8192 --cpus 6

# Deploy using Terraform
$ cd terraform
$ terraform apply
```

## Creating challenges

```bash
# Import local images
minikube image load challenges/your_challenge
```

### Resource limits

test resource limits:

| Use Case                       | Example Values               |
| ------------------------------ | ---------------------------- |
| Tiny background job            | `cpu: 50m`, `memory: 32Mi`   |
| Lightweight web app (e.g. PHP) | `cpu: 100m`, `memory: 128Mi` |
| CPU-bound challenge            | `cpu: 500m`, `memory: 256Mi` |
| Memory-intensive challenge     | `cpu: 250m`, `memory: 512Mi` |
