resource "kubernetes_network_policy" "deny_except_traefik" {
  metadata {
    name      = "deny-except-traefik"
    namespace = var.namespace
  }

  spec {
    pod_selector {}

    policy_types = ["Ingress", "Egress"]

    ingress {
      from {
        namespace_selector {
          match_labels = {
            "name" = "traefik"
          }
        }
      }
    }
  }
}

resource "kubernetes_network_policy" "unconstrained_portal" {
  metadata {
    name      = "unconstrained-portal"
    namespace = var.namespace
  }

  spec {
    pod_selector {
      match_labels = {
        app = kubernetes_deployment.portal.metadata[0].name
      }
    }

    policy_types = ["Ingress", "Egress"]

    ingress {}
    egress {}
  }
}
