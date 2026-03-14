@echo off
REM 🚀 Frontend Setup Script for Windows
REM 自动完成 frontend 目录的文件复制

echo 🎯 开始设置 frontend 目录...
echo.

REM 1. 创建必要的目录结构
echo 📁 创建目录结构...
if not exist "frontend\src\app\components" mkdir frontend\src\app\components
if not exist "frontend\src\app\hooks" mkdir frontend\src\app\hooks
if not exist "frontend\src\app\pages" mkdir frontend\src\app\pages
if not exist "frontend\src\app\utils" mkdir frontend\src\app\utils
if not exist "frontend\src\imports" mkdir frontend\src\imports
if not exist "frontend\public" mkdir frontend\public

REM 2. 复制 app 目录下的内容
echo 📋 复制应用文件...

REM 复制组件
if exist "src\app\components" (
  xcopy "src\app\components\*" "frontend\src\app\components\" /E /I /Y >nul 2>&1
  echo   ✅ Components 已复制
)

REM 复制 hooks
if exist "src\app\hooks" (
  xcopy "src\app\hooks\*" "frontend\src\app\hooks\" /E /I /Y >nul 2>&1
  echo   ✅ Hooks 已复制
)

REM 复制 utils
if exist "src\app\utils" (
  xcopy "src\app\utils\*" "frontend\src\app\utils\" /E /I /Y >nul 2>&1
  echo   ✅ Utils 已复制
)

REM 复制页面组件到 pages 目录
echo 📄 复制页面组件...
if exist "src\app\WelcomePage.tsx" (
  copy "src\app\WelcomePage.tsx" "frontend\src\app\pages\" >nul 2>&1
  echo   ✅ WelcomePage.tsx
)

if exist "src\app\PracticePageWrapper.tsx" (
  copy "src\app\PracticePageWrapper.tsx" "frontend\src\app\pages\PracticePage.tsx" >nul 2>&1
  echo   ✅ PracticePageWrapper.tsx → PracticePage.tsx
)

if exist "src\app\StatisticsPage.tsx" (
  copy "src\app\StatisticsPage.tsx" "frontend\src\app\pages\" >nul 2>&1
  echo   ✅ StatisticsPage.tsx
)

if exist "src\app\HistoryPage.tsx" (
  copy "src\app\HistoryPage.tsx" "frontend\src\app\pages\" >nul 2>&1
  echo   ✅ HistoryPage.tsx
)

if exist "src\app\AssessmentPage.tsx" (
  copy "src\app\AssessmentPage.tsx" "frontend\src\app\pages\" >nul 2>&1
  echo   ✅ AssessmentPage.tsx
)

REM 复制配置文件
echo ⚙️  复制配置文件...
if exist "src\app\App.tsx" (
  copy "src\app\App.tsx" "frontend\src\app\" >nul 2>&1
  echo   ✅ App.tsx
)

if exist "src\app\routes.tsx" (
  copy "src\app\routes.tsx" "frontend\src\app\" >nul 2>&1
  echo   ✅ routes.tsx
)

if exist "src\app\config.ts" (
  copy "src\app\config.ts" "frontend\src\app\" >nul 2>&1
  echo   ✅ config.ts
)

REM 复制 imports 目录
echo 🎨 复制 Figma imports...
if exist "src\imports" (
  xcopy "src\imports\*" "frontend\src\imports\" /E /I /Y >nul 2>&1
  echo   ✅ Imports 已复制
)

REM 复制 PostCSS 配置
if exist "postcss.config.mjs" (
  copy "postcss.config.mjs" "frontend\" >nul 2>&1
  echo   ✅ postcss.config.mjs
)

REM 创建 .env 文件
if exist "frontend\.env.example" (
  if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env" >nul 2>&1
    echo   ✅ .env 已创建
  )
)

echo.
echo ✨ Frontend 目录设置完成！
echo.
echo 📝 下一步：
echo 1. cd frontend
echo 2. npm install
echo 3. npm run dev
echo.
echo 🌐 然后访问: http://localhost:5173
echo.
echo ⚠️  注意: 您可能需要手动更新以下文件的导入路径：
echo   - frontend\src\app\routes.tsx
echo   - frontend\src\app\App.tsx
echo.
echo 📚 查看 QUICK_START_GUIDE.md 获取详细说明
echo.
pause
