locals {
  app_name          = "portal"
  app_data_path     = "/app/data"
  image             = "zeroday_portal"
  image_pull_policy = "IfNotPresent"
  container_port    = 3000
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
        service_account_name = kubernetes_service_account.portal.metadata[0].name

        container {
          name              = local.app_name
          image             = local.image
          image_pull_policy = local.image_pull_policy

          port {
            container_port = local.container_port
          }

          env {
            name  = "DATABASE_URL"
            value = var.postgres_url
          }
        }
      }
    }
  }

  depends_on = [kubernetes_namespace.zeroday_namespace, kubernetes_service_account.portal]
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

  depends_on = [kubernetes_namespace.zeroday_namespace]
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

  depends_on = [kubernetes_namespace.zeroday_namespace]
}

resource "kubernetes_service_account" "portal" {
  metadata {
    name      = "zeroday-admin"
    namespace = var.namespace
  }
}

resource "kubernetes_cluster_role_binding" "portal" {
  metadata {
    name = kubernetes_service_account.portal.metadata[0].name
  }

  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account.portal.metadata[0].name
    namespace = var.namespace
  }

  role_ref {
    kind      = "ClusterRole"
    name      = "cluster-admin"
    api_group = "rbac.authorization.k8s.io"
  }

  depends_on = [kubernetes_namespace.zeroday_namespace, kubernetes_service_account.portal]
}
