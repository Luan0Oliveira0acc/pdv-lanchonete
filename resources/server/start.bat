@echo off
echo ========================================
echo   Servidor WhatsApp para Versao Web
echo ========================================
echo.

cd /d "%~dp0"

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo Erro ao instalar dependencias!
        pause
        exit /b 1
    )
)

echo.
echo Iniciando servidor WhatsApp...
echo Servidor rodara na porta 3001
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

call npm start

pause

