$server = Start-Process python -ArgumentList "-m http.server 8089" -PassThru
Start-Sleep -Seconds 2

$targets = @(
  @{ name = "Home"; url = "http://localhost:8089/index.html" },
  @{ name = "Packages"; url = "http://localhost:8089/packages/index.html" },
  @{ name = "FAQ"; url = "http://localhost:8089/faq/index.html" },
  @{ name = "Contact"; url = "http://localhost:8089/contact/index.html" }
)

$results = @{}

try {
  foreach ($t in $targets) {
    Write-Host "Auditing $($t.name)..."
    $outFile = "lh_$($t.name.ToLower()).json"
    npx lighthouse $t.url --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=$outFile --only-categories=performance,accessibility,best-practices,seo --quiet
    if (Test-Path $outFile) {
      $data = Get-Content $outFile -Raw | ConvertFrom-Json
      $scores = @{
        performance = [Math]::Round($data.categories.performance.score * 100)
        accessibility = [Math]::Round($data.categories.accessibility.score * 100)
        bestPractices = [Math]::Round($data.categories.'best-practices'.score * 100)
        seo = [Math]::Round($data.categories.seo.score * 100)
      }
      $results[$t.name] = $scores
      Write-Host "$($t.name) scores: Performance=$($scores.performance), Accessibility=$($scores.accessibility), BestPractices=$($scores.bestPractices), SEO=$($scores.seo)"
      Remove-Item $outFile -Force
    }
  }
}
finally {
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
}

$resultsJson = $results | ConvertTo-Json -Depth 3
$resultsJson | Out-File -FilePath "lighthouse_scores.json" -Encoding utf8
Write-Host "=== LIGHTHOUSE AUDITS COMPLETED ==="
Write-Host $resultsJson
