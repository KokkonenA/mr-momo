# Define the target folder dynamically
$TargetFolder = Join-Path -Path $PSScriptRoot -ChildPath "assets"

# 1. Convert PNG to Lossless WebP using ImageMagick
Get-ChildItem -Path $TargetFolder -Recurse -Filter "*.png" -ErrorAction SilentlyContinue | ForEach-Object {
    $out = $_.FullName -replace '\.png$', '.webp'
    magick $_.FullName -quality 92 $out
}

# 2. Re-encode 10k MP4s to Web-Optimized, Highly Efficient MP4s via CRF 23
# Get-ChildItem -Path $TargetFolder -Recurse -Filter "*.mp4" -ErrorAction SilentlyContinue | ForEach-Object {
#     $out = Join-Path -Path $_.DirectoryName -ChildPath ($_.BaseName + "_web.mp4")
#     # -crf 23 replaces hard bitrate ceilings with smart, quality-based compression
#     ffmpeg -y -i $_.FullName -c:v libx264 -crf 23 -g 25 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k $out
# }

# 3. Convert WAV to High-Quality AAC (.m4a)
Get-ChildItem -Path $TargetFolder -Recurse -Filter "*.wav" -ErrorAction SilentlyContinue | ForEach-Object {
    $out = Join-Path -Path $_.DirectoryName -ChildPath ($_.BaseName + ".m4a")
    # -b:a 128k provides excellent transparency for standard stereo audio
    ffmpeg -y -i $_.FullName -c:a aac -b:a 128k $out
}
