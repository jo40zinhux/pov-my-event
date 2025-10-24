# Script de Inicialização Rápida - POV Photo
# Execute com: .\start.ps1

Write-Host "🚀 Iniciando POV Photo..." -ForegroundColor Cyan
Write-Host ""

# Verificar se dependências estão instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependências não instaladas!" -ForegroundColor Yellow
    Write-Host "   Executando instalação..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "   Execute primeiro: .\install.ps1" -ForegroundColor Yellow
    exit 1
}

# Verificar variáveis essenciais
$envContent = Get-Content ".env" -Raw

$hasSupabaseUrl = $envContent -match "NEXT_PUBLIC_SUPABASE_URL=https://"
$hasSupabaseKey = $envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ"
$hasNextAuthSecret = $envContent -match "NEXTAUTH_SECRET=.{20,}"

if (-not ($hasSupabaseUrl -and $hasSupabaseKey -and $hasNextAuthSecret)) {
    Write-Host "⚠️  Variáveis de ambiente incompletas no .env!" -ForegroundColor Yellow
    Write-Host ""
    if (-not $hasSupabaseUrl) {
        Write-Host "   ❌ NEXT_PUBLIC_SUPABASE_URL não configurado" -ForegroundColor Red
    }
    if (-not $hasSupabaseKey) {
        Write-Host "   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não configurado" -ForegroundColor Red
    }
    if (-not $hasNextAuthSecret) {
        Write-Host "   ❌ NEXTAUTH_SECRET não configurado" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "   Configure o .env antes de continuar!" -ForegroundColor Yellow
    Write-Host "   Veja: SETUP.md para instruções" -ForegroundColor Cyan
    
    $continue = Read-Host "Continuar mesmo assim? (s/n)"
    if ($continue -ne 's') {
        exit 1
    }
}

Write-Host "✅ Verificações OK!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Iniciando servidor de desenvolvimento..." -ForegroundColor Cyan
Write-Host "   URL: http://localhost:3000" -ForegroundColor White
Write-Host "   Admin: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
Write-Host "   Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
Write-Host ""

# Iniciar servidor
npm run dev
