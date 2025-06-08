locals {
  acme_servers = {
    staging    = "https://acme-staging-v02.api.letsencrypt.org/directory"
    production = "https://acme-v02.api.letsencrypt.org/directory"
  }

  cluster_issuer_server = local.acme_servers[var.letsencrypt_environment]
}

module "cert_manager" {
  source        = "terraform-iaac/cert-manager/kubernetes"
  chart_version = "1.17.2"

  cluster_issuer_email                   = var.letsencrypt_issuer_email
  cluster_issuer_name                    = "cert-manager-global"
  cluster_issuer_private_key_secret_name = "cert-manager-private-key"

  namespace_name   = "cert-manager"
  create_namespace = true

  cluster_issuer_server = local.cluster_issuer_server

  solvers = [
    {
      dns01 = {
        cloudflare = {
          email = var.cloudflare_email
          apiTokenSecretRef = {
            name = "cloudflare-api-token-secret"
            key  = "api-token"
          }
        }
      }
      selector = {}
    }
  ]

  additional_set = [
    {
      name  = "extraArgs[0]"
      value = "--dns01-recursive-nameservers=1.1.1.1:53\\,8.8.8.8:53"
    },
    {
      name  = "extraArgs[1]"
      value = "--dns01-recursive-nameservers-only"
    }
  ]

  certificates = {
    "zeroday" = {
      dns_names   = [var.domain]
      secret_name = "zeroday-tls"
      namespace   = var.namespace
    }
    "portal" = {
      dns_names   = ["portal.${var.domain}"]
      secret_name = "portal-tls"
      namespace   = var.namespace
    }
    "challenges" = {
      dns_names   = ["challenge.${var.domain}", "*.challenge.${var.domain}"]
      secret_name = "challenge-tls"
      namespace   = var.namespace
    }
  }

  depends_on = [kubernetes_namespace.zeroday_namespace]
}

