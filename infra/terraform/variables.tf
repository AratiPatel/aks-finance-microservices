variable "project_name" {
  type        = string
  description = "Short project name used in resource names."
  default     = "aksfin"
}

variable "location" {
  type        = string
  description = "Azure region."
  default     = "canadacentral"
}

variable "resource_group_name" {
  type        = string
  description = "Resource group name."
  default     = "rg-aks-finance"
}

variable "acr_name" {
  type        = string
  description = "ACR name must be globally unique, lowercase, 5-50 chars."
}

variable "aks_name" {
  type        = string
  description = "AKS cluster name."
  default     = "aks-finance"
}

variable "kubernetes_version" {
  type        = string
  description = "AKS version (leave blank to use default)."
  default     = ""
}

variable "system_node_vm_size" {
  type    = string
  default = "Standard_D2s_v5"
}

variable "apps_node_vm_size" {
  type    = string
  default = "Standard_D2s_v5"
}

variable "system_node_count" {
  type    = number
  default = 1
}

variable "apps_node_count" {
  type    = number
  default = 1
}
