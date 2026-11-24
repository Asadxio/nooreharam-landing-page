$port = 8095
$root = "c:\Users\xioas\OneDrive\Desktop\LANDING PAGE NOOEHARAM"
Set-Location $root

# Kill any existing server on port
$existing = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($existing) {
    $existing | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

# Start server
$server = Start-Process -FilePath "python" -ArgumentList "-m http.server $port" -PassThru -WindowStyle Hidden
Start-Sleep 3

$pages = @(
    @{ name = "home"; url = "http://localhost:$port/index.html" },
    @{ name = "packages"; url = "http://localhost:$port/packages/index.html" },
    @{ name = "faq"; url = "http://localhost:$port/faq/index.html" },
    @{ name = "contact"; url = "http://localhost:$port/contact/index.html" }
)

$lhArgs = "--output=json --chrome-flags='--headless --no-sandbox --disable-gpu' --only-categories=performance,accessibility,best-practices,seo"
$outDir = "C:\Users\xioas\.gemini\antigravity\brain\9d6132f4-8903-4766-93d5-59bdf0ead244\scratch"

foreach ($p in $pages) {
    Write-Host "Running LH on $($p.name)..."
    $outFile = "$outDir\lh_after_$($p.name).json"
    npx lighthouse $p.url $lhArgs --output-path=$outFile 2>$null
    
    if (Test-Path $outFile) {
        $data = Get-Content $outFile | ConvertFrom-Json
        $cats = $data.categories
        $perf = [math]::Round($cats.performance.score * 100)
        $a11y = [math]::Round($cats.accessibility.score * 100)
        $bp = [math]::Round($cats.'best-practices'.score * 100)
        $seo = [math]::Round($cats.seo.score * 100)
        Write-Host "  $($p.name): Perf=$perf A11Y=$a11y BP=$bp SEO=$seo"
    } else {
        Write-Host "  $($p.name): FAILED - no output"
    }
}

Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
Write-Host "Done."
