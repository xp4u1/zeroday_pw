resource "helm_release" "traefik" {
  name             = "traefik"
  namespace        = "traefik"
  repository       = "https://helm.traefik.io/traefik"
  chart            = "traefik"
  version          = "35.2.0"
  create_namespace = true

  values = [
    file("${path.module}/config/traefik-values.yaml")
  ]
}
