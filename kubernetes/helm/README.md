## Importing challenges

```bash
# List installed Docker images
$ minikube image ls

# Import local image
$ minikube image load challenges/your_challenge
```

## Resource limits

Below are example resource configurations for different use cases. Adjust these
values based on your challenge requirements.

| Use Case                       | Example Values               |
| ------------------------------ | ---------------------------- |
| Tiny background job            | `cpu: 50m`, `memory: 32Mi`   |
| Lightweight web app (e.g. PHP) | `cpu: 100m`, `memory: 128Mi` |
| CPU-bound challenge            | `cpu: 500m`, `memory: 256Mi` |
| Memory-intensive challenge     | `cpu: 250m`, `memory: 512Mi` |
