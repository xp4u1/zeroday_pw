resource "kubernetes_namespace" "zeroday_namespace" {
  metadata {
    annotations = {
      name = var.namespace
    }

    name = var.namespace
  }
}
