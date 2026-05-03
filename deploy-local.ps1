# deploy-local.ps1
# Script completo para desplegar Ofertonazos en Minikube
# Uso: .\deploy-local.ps1

$ErrorActionPreference = "Stop"
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User") + ";C:\Program Files\Kubernetes\Minikube;C:\Program Files\Docker\Docker\resources\bin"

Write-Host "`n=== 1. Verificando Minikube ===" -ForegroundColor Cyan
minikube status

Write-Host "`n=== 2. Habilitando addons ===" -ForegroundColor Cyan
minikube addons enable ingress
minikube addons enable metrics-server

Write-Host "`n=== 3. Apuntando Docker a Minikube ===" -ForegroundColor Cyan
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

Write-Host "`n=== 4. Construyendo imagen Docker ===" -ForegroundColor Cyan
docker build -t ofertonazos:local .

Write-Host "`n=== 5. Desplegando en Kubernetes ===" -ForegroundColor Cyan
kubectl apply -f k8s/local/secret-local.yaml
kubectl apply -f k8s/local/service-local.yaml
kubectl apply -f k8s/local/deployment-local.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/pdb.yaml

Write-Host "`n=== 6. Esperando pods listos ===" -ForegroundColor Cyan
kubectl rollout status deployment/ofertonazos --timeout=180s

Write-Host "`n=== 7. Estado del clúster ===" -ForegroundColor Cyan
kubectl get pods,svc,hpa,pdb -o wide

Write-Host "`n=== 8. URL de la aplicación ===" -ForegroundColor Green
$ip = minikube ip
Write-Host "App: http://${ip}:30080"
Write-Host "Health: http://${ip}:30080/api/health"
Write-Host "Metrics: http://${ip}:30080/api/metrics"
