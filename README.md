![CI/CD](https://github.com/AratiPatel/aks-finance-microservices/actions/workflows/deploy.yml/badge.svg)


AKS Finance Microservices Platform

A cloud-native microservices platform deployed on Azure Kubernetes Service (AKS) with automated CI/CD using GitHub Actions, container images stored in Azure Container Registry (ACR), and infrastructure provisioned using Terraform.

This project demonstrates modern DevOps practices including Infrastructure as Code, containerization, Kubernetes orchestration, and automated deployments.

Architecture Overview
Users │ ▼ Azure LoadBalancer │ ▼ Gateway Service │ ├── Accounts Service ├── Payments Service ├── Transactions Service └── Auth Service │ ▼ Azure Kubernetes Service (AKS) │ ▼ Azure Container Registry (ACR) │ ▼ Github Actions CI/CD

Project Structure
aks-finance-microservices
│
├── .github/workflows
│     └── deploy.yml          # GitHub Actions CI/CD pipeline
│
├── deploy/k8s                # Kubernetes manifests
│     ├── namespace.yaml
│     ├── gateway.yaml
│     ├── accounts.yaml
│     ├── payments.yaml
│     ├── transactions.yaml
│     ├── auth.yaml
│     └── ingress.yaml
│
├── infra/terraform           # Infrastructure provisioning
│     ├── main.tf
│     ├── variables.tf
│     └── outputs.tf
│
├── services                  # Node.js microservices
│     ├── accounts-service
│     ├── payments-service
│     ├── transactions-service
│     ├── auth-service
│     └── gateway-service
│
└── README.md

Infrastructure Provisioning

Infrastructure is provisioned using Terraform.

Resources created:

Azure Resource Group

Azure Kubernetes Service (AKS)

Azure Container Registry (ACR)

Deploy infrastructure:

cd infra/terraform
terraform init
terraform apply
CI/CD Pipeline

CI/CD is implemented using GitHub Actions.

Pipeline steps:

Checkout repository

Authenticate to Azure using OIDC

Detect changed microservices

Build Docker images using ACR Build

Push images to Azure Container Registry

Retrieve AKS credentials

Deploy Kubernetes manifests

Perform rolling updates on services

Trigger:

git push → GitHub Actions → Build → Push → Deploy to AKS
Deployment

Apply Kubernetes manifests:

kubectl apply -f deploy/k8s/

Verify deployment:

kubectl get pods -n finance
kubectl get svc -n finance

Gateway service exposes the application via a public LoadBalancer.

Example API Requests

Health check

GET /health

Example payment API

GET /api/payments

Example response:

{
  "paymentId": "PAY123",
  "status": "SUCCESS",
  "amount": 250,
  "currency": "CAD"
}

