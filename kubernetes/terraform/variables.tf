variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_email" {
  description = "Cloudflare Account E-Mail"
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "Your domain like 'zeroday.pw'"
  type        = string
}

variable "letsencrypt_issuer_email" {
  description = "E-Mail that is used to request the certificates"
  type        = string
}

variable "letsencrypt_environment" {
  description = "ACME environment: 'staging' or 'production'"
  type        = string
  default     = "staging"

  validation {
    condition     = contains(["staging", "production"], var.letsencrypt_environment)
    error_message = "letsencrypt_environment must be either 'staging' or 'production'"
  }
}

variable "postgres_url" {
  description = "Connection string of the postgres database"
  type        = string
}

variable "namespace" {
  description = "Namespace that will be created for the zeroday platform"
  type        = string
  default     = "zeroday"
}
