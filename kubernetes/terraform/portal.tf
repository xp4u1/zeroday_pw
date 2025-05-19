locals {
  app_name          = "portal"
  app_data_path     = "/app/data"
  image             = "zeroday_portal"
  image_pull_policy = "IfNotPresent"
  container_port    = 3000
}

resource "kubernetes_persistent_volume_claim" "portal_database" {
  metadata {
    name      = "${local.app_name}-database"
    namespace = var.namespace
  }

  spec {
    access_modes = ["ReadWriteOnce"]

    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}

resource "kubernetes_deployment" "portal" {
  metadata {
    name      = local.app_name
    namespace = var.namespace
    labels = {
      app = local.app_name
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = local.app_name
      }
    }

    template {
      metadata {
        labels = {
          app = local.app_name
        }
      }

      spec {
        volume {
          name = "database"

          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.portal_database.metadata[0].name
          }
        }

        init_container {
          name              = "${local.app_name}-setup"
          image             = local.image
          image_pull_policy = local.image_pull_policy

          command = ["node", "scripts/setup.js"]

          env {
            name  = "DATABASE_URL"
            value = "${local.app_data_path}/prod.db"
          }

          volume_mount {
            mount_path = local.app_data_path
            name       = "database"
          }
        }

        container {
          name              = local.app_name
          image             = local.image
          image_pull_policy = local.image_pull_policy

          port {
            container_port = local.container_port
          }

          env {
            name  = "DATABASE_URL"
            value = "${local.app_data_path}/prod.db"
          }

          volume_mount {
            mount_path = local.app_data_path
            name       = "database"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "portal" {
  metadata {
    name      = local.app_name
    namespace = var.namespace
  }

  spec {
    selector = {
      app = local.app_name
    }

    port {
      name        = "http"
      port        = 80
      target_port = local.container_port
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_ingress_v1" "portal" {
  metadata {
    name      = local.app_name
    namespace = var.namespace

    annotations = {
      "kubernetes.io/ingress.class" = "traefik"
    }
  }

  spec {
    ingress_class_name = "traefik"

    rule {
      host = "portal.${var.domain}"

      http {
        path {
          path      = "/"
          path_type = "Prefix"

          backend {
            service {
              name = kubernetes_deployment.portal.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
      }
    }

    tls {
      secret_name = "portal-tls"
    }
  }
}
