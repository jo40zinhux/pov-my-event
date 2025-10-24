# Script de Instalação Automática - POV Photo
# Execute com: .\install.ps1

Write-Host "🚀 POV Photo - Instalação Automática" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   Instale em: https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Verificar versão Node.js (deve ser 18+)
$nodeMajorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajorVersion -lt 18) {
    Write-Host "⚠️  Node.js versão muito antiga. Requer v18+. Você tem: $nodeVersion" -ForegroundColor Yellow
    Write-Host "   Recomendamos atualizar em: https://nodejs.org" -ForegroundColor Yellow
    $continue = Read-Host "Continuar mesmo assim? (s/n)"
    if ($continue -ne 's') {
        exit 1
    }
}

Write-Host ""

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
Write-Host "   Isso pode levar alguns minutos..." -ForegroundColor Gray
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
Write-Host ""

# Verificar .env
Write-Host "🔧 Verificando arquivo .env..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  Arquivo .env não encontrado" -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Write-Host "   Copiando .env.example para .env..." -ForegroundColor Gray
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais!" -ForegroundColor Yellow
        Write-Host "   1. Crie uma conta no Supabase: https://supabase.com" -ForegroundColor Cyan
        Write-Host "   2. Execute o arquivo supabase-schema.sql no SQL Editor" -ForegroundColor Cyan
        Write-Host "   3. Copie as credenciais para o .env" -ForegroundColor Cyan
        Write-Host "   4. Gere um NEXTAUTH_SECRET (comando abaixo):" -ForegroundColor Cyan
        Write-Host ""
        
        # Gerar NEXTAUTH_SECRET
        $secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
        Write-Host "   NEXTAUTH_SECRET sugerido:" -ForegroundColor Green
        Write-Host "   $secret" -ForegroundColor White
        Write-Host ""
        
        $openEnv = Read-Host "Deseja abrir o arquivo .env agora? (s/n)"
        if ($openEnv -eq 's') {
            notepad ".env"
        }
    } else {
        Write-Host "❌ .env.example não encontrado!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Instalação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Configure o arquivo .env com suas credenciais" -ForegroundColor White
Write-Host "   2. Configure o Supabase (veja SETUP.md)" -ForegroundColor White
Write-Host "   3. Execute: npm run dev" -ForegroundColor White
Write-Host "   4. Acesse: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentação:" -ForegroundColor Cyan
Write-Host "   - QUICKSTART.md  → Guia rápido (5 min)" -ForegroundColor White
Write-Host "   - SETUP.md       → Guia detalhado" -ForegroundColor White
Write-Host "   - README.md      → Documentação completa" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Boa sorte com seu evento!" -ForegroundColor Green
