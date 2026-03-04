resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = false
}

resource "azurerm_kubernetes_cluster" "aks" {
  
  name                = var.aks_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "${var.project_name}-dns"

  identity {
    type = "SystemAssigned"
  }

private_cluster_enabled = false


  default_node_pool {
    name                 = "systemnp"
    vm_size              = var.system_node_vm_size
    node_count           = var.system_node_count
    orchestrator_version = var.kubernetes_version != "" ? var.kubernetes_version : null
    type                 = "VirtualMachineScaleSets"
  }

  network_profile {
    network_plugin    = "azure" # Azure CNI
    load_balancer_sku = "standard"
  }
}

# Apps node pool (separate pool for workloads)
resource "azurerm_kubernetes_cluster_node_pool" "apps" {
  name                  = "appsnp"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.aks.id
  vm_size               = var.apps_node_vm_size
  node_count            = var.apps_node_count
  mode                  = "User"
  orchestrator_version  = var.kubernetes_version != "" ? var.kubernetes_version : null
}

# Allow AKS to pull from ACR (attach ACR)
resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
}
