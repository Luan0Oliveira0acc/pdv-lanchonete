@echo off
echo ========================================
echo   Iniciando Servidores PDV Lanchonete
echo ========================================
echo.

cd /d "%~dp0"

REM Detectar caminho do servidor
REM Primeiro tentar na pasta atual (desenvolvimento)
if exist "server" (
    set SERVER_DIR=server
    goto :found_server
)

REM Tentar em resources/server (executável empacotado)
if exist "resources\server" (
    set SERVER_DIR=resources\server
    goto :found_server
)

REM Tentar na pasta pai (se executado de outra localização)
if exist "..\server" (
    set SERVER_DIR=..\server
    goto :found_server
)

REM Se não encontrou, mostrar erro
echo Erro: Pasta server nao encontrada!
echo.
echo Procurando em:
echo   - %~dp0server
echo   - %~dp0resources\server
echo   - %~dp0..\server
echo.
echo Execute este script na pasta raiz do projeto ou na pasta do executavel.
pause
exit /b 1

:found_server
echo Servidor encontrado em: %SERVER_DIR%
echo.

REM Verificar se Node.js está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: Node.js nao encontrado!
    echo Instale Node.js de https://nodejs.org/
    pause
    exit /b 1
)

echo Iniciando servidor de dados (porta 3002)...
start "Servidor de Dados" cmd /k "cd /d %~dp0%SERVER_DIR% && node data-server.js"

timeout /t 2 /nobreak >nul

echo Iniciando servidor WhatsApp (porta 3001)...
start "Servidor WhatsApp" cmd /k "cd /d %~dp0%SERVER_DIR% && node whatsapp-server.js"

timeout /t 2 /nobreak >nul

echo Iniciando servidor web (porta 5173)...
start "Servidor Web" cmd /k "cd /d %~dp0%SERVER_DIR% && node web-server.js"

echo.
echo ========================================
echo   Servidores iniciados!
echo ========================================
echo.
echo Servidores rodando em:
echo   - Dados: http://localhost:3002
echo   - WhatsApp: http://localhost:3001
echo   - Web: http://localhost:5173
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
