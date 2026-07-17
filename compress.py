import os
import sys

# Ensure Pillow is installed
try:
    from PIL import Image
except ImportError:
    print("Pillow library not found. Installing it now...")
    import subprocess
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image
    except Exception as err:
        print(f"Failed to install Pillow automatically: {err}")
        print("Please install it manually using: pip install Pillow")
        sys.exit(1)

images_dir = r"C:\Users\stoik\.gemini\antigravity\scratch\shopzoneks\images"

if not os.path.exists(images_dir):
    print(f"Directory {images_dir} does not exist.")
    sys.exit(1)

print(f"Starting compression in {images_dir}...")
count = 0

for filename in os.listdir(images_dir):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        filepath = os.path.join(images_dir, filename)
        original_size = os.path.getsize(filepath)
        
        # Skip if already very small (less than 400KB)
        if original_size < 400 * 1024:
            print(f"Skipping {filename} (already small: {original_size/1024:.1f} KB)")
            continue
            
        try:
            with Image.open(filepath) as img:
                # Convert RGBA/LA modes to RGB for JPEG compatibility
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img = img.convert('RGB')
                
                # Resize if larger than 1200px on any side
                max_size = 1200
                if img.width > max_size or img.height > max_size:
                    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                
                # Save back to same file, compressed
                img.save(filepath, "JPEG", quality=75, optimize=True)
                new_size = os.path.getsize(filepath)
                print(f"Compressed {filename}: {original_size/1024/1024:.2f} MB -> {new_size/1024:.1f} KB")
                count += 1
        except Exception as e:
            print(f"Error compressing {filename}: {e}")

print(f"Finished. Compressed {count} images.")
