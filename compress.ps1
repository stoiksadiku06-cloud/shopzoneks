Add-Type -AssemblyName System.Drawing

$imagesDir = "C:\Users\stoik\.gemini\antigravity\scratch\shopzoneks\images"
if (-not (Test-Path $imagesDir)) {
    Write-Error "Directory $imagesDir does not exist."
    exit 1
}

$files = Get-ChildItem -Path $imagesDir -Include *.jpg, *.jpeg, *.png -File -Recurse

Write-Host "Starting compression of images..."
$count = 0

foreach ($file in $files) {
    $filePath = $file.FullName
    $originalSize = (Get-Item $filePath).Length
    
    # Skip if already small (less than 400KB)
    if ($originalSize -lt 400KB) {
        Write-Host "Skipping $($file.Name) (already small: $([math]::round($originalSize / 1KB, 1)) KB)"
        continue
    }

    try {
        # Load the image
        $img = [System.Drawing.Image]::FromFile($filePath)
        
        # Calculate new dimensions if larger than 1200px
        $maxSize = 1200
        $newWidth = $img.Width
        $newHeight = $img.Height
        
        if ($img.Width -gt $maxSize -or $img.Height -gt $maxSize) {
            if ($img.Width -gt $img.Height) {
                $newWidth = $maxSize
                $newHeight = [int]($img.Height * ($maxSize / $img.Width))
            } else {
                $newHeight = $maxSize
                $newWidth = [int]($img.Width * ($maxSize / $img.Height))
            }
        }
        
        # Create resized bitmap
        $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        # Draw the original image onto the new bitmap
        $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
        
        # Setup JPEG encoder with quality 75
        $encoder = [System.Drawing.Imaging.Encoder]::Quality
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 75)
        
        # Get the JPEG codec
        $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
        $jpegCodec = $codecs | Where-Object { $_.MimeType -eq "image/jpeg" }
        
        # Save to temp file to release lock
        $tempPath = $filePath + ".tmp"
        $bmp.Save($tempPath, $jpegCodec, $encoderParams)
        
        # Clean up GDI+ resources before file manipulation
        $g.Dispose()
        $bmp.Dispose()
        $img.Dispose()
        
        # Replace original file with compressed file
        Remove-Item -Path $filePath -Force
        Rename-Item -Path $tempPath -NewName $file.Name -Force
        
        $newSize = (Get-Item $filePath).Length
        Write-Host "Compressed $($file.Name): $([math]::round($originalSize / 1MB, 2)) MB -> $([math]::round($newSize / 1KB, 1)) KB"
        $count++
    }
    catch {
        Write-Error "Failed to compress $($file.Name): $_"
        if ($null -ne $g) { $g.Dispose() }
        if ($null -ne $bmp) { $bmp.Dispose() }
        if ($null -ne $img) { $img.Dispose() }
        if (Test-Path $tempPath) { Remove-Item $tempPath -Force }
    }
}

Write-Host "Done! Compressed $count images."
