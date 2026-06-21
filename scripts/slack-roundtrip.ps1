param(
    [string]$Message = "Forge 2 Slack evidence round trip from local verifier"
)

$ErrorActionPreference = "Stop"

if (-not $env:SLACK_BOT_TOKEN) {
    throw "Missing SLACK_BOT_TOKEN. Set it in your local shell; do not commit it."
}

if (-not $env:SLACK_CHANNEL_ID) {
    throw "Missing SLACK_CHANNEL_ID. Set it to the target Slack channel ID, for example C0123456789."
}

$headers = @{
    Authorization = "Bearer $env:SLACK_BOT_TOKEN"
    "Content-Type" = "application/json; charset=utf-8"
}

$auth = Invoke-RestMethod `
    -Method Post `
    -Uri "https://slack.com/api/auth.test" `
    -Headers $headers

if (-not $auth.ok) {
    throw "Slack auth.test failed: $($auth.error)"
}

$postBody = @{
    channel = $env:SLACK_CHANNEL_ID
    text = $Message
} | ConvertTo-Json -Compress

$post = Invoke-RestMethod `
    -Method Post `
    -Uri "https://slack.com/api/chat.postMessage" `
    -Headers $headers `
    -Body $postBody

if (-not $post.ok) {
    throw "Slack chat.postMessage failed: $($post.error)"
}

$historyUri = "https://slack.com/api/conversations.history?channel=$($env:SLACK_CHANNEL_ID)&latest=$($post.ts)&inclusive=true&limit=1"
$history = Invoke-RestMethod `
    -Method Get `
    -Uri $historyUri `
    -Headers @{ Authorization = "Bearer $env:SLACK_BOT_TOKEN" }

if (-not $history.ok) {
    throw "Slack conversations.history failed: $($history.error)"
}

$result = [ordered]@{
    captured_at = (Get-Date).ToString("s")
    channel_id = $env:SLACK_CHANNEL_ID
    auth_test = @{
        ok = $auth.ok
        team = $auth.team
        user = $auth.user
        team_id = $auth.team_id
        user_id = $auth.user_id
    }
    post_message = @{
        ok = $post.ok
        channel = $post.channel
        ts = $post.ts
        text = $post.message.text
    }
    conversations_history = @{
        ok = $history.ok
        returned_count = @($history.messages).Count
        first_message_text = if (@($history.messages).Count -gt 0) { $history.messages[0].text } else { $null }
        first_message_ts = if (@($history.messages).Count -gt 0) { $history.messages[0].ts } else { $null }
    }
    token = "[redacted]"
}

$outDir = Join-Path (Get-Location) "evidence"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$outPath = Join-Path $outDir "slack-roundtrip-output.json"
$result | ConvertTo-Json -Depth 6 | Set-Content -Path $outPath -Encoding UTF8

Write-Host "Slack round trip succeeded."
Write-Host "Saved redacted output to $outPath"
Write-Host "Take a screenshot of this terminal output and the Slack message in the channel."
