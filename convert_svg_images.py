#!/usr/bin/env python3
"""
Convert SVG images to required formats for SEO
Requires: wand (pip install wand) or cairosvg (pip install cairosvg)
"""

import os
import subprocess
import sys

def convert_with_inkscape():
    """Try to convert using Inkscape if available"""
    try:
        # Convert SVG to JPG for Open Graph
        subprocess.run([
            'inkscape',
            '--export-type=jpg',
            '--export-filename=assets/images/default-og.jpg',
            '--export-width=1200',
            '--export-height=630',
            'assets/images/default-og.svg'
        ], check=True)

        # Convert SVG to PNG for logo
        subprocess.run([
            'inkscape',
            '--export-type=png',
            '--export-filename=assets/images/logo.png',
            '--export-width=600',
            '--export-height=600',
            'assets/images/logo.svg'
        ], check=True)

        print("✅ Images converted successfully using Inkscape!")
        return True

    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def convert_with_wand():
    """Try to convert using wand Python library"""
    try:
        from wand.image import Image
        from wand.color import Color

        # Convert SVG to JPG
        with Image() as img:
            img.format = 'svg'
            img.read(filename='assets/images/default-og.svg')
            img.format = 'jpeg'
            img.resize(1200, 630)
            img.save(filename='assets/images/default-og.jpg')

        # Convert SVG to PNG
        with Image() as img:
            img.format = 'svg'
            img.read(filename='assets/images/logo.svg')
            img.format = 'png'
            img.resize(600, 600)
            img.save(filename='assets/images/logo.png')

        print("✅ Images converted successfully using wand!")
        return True

    except ImportError:
        return False

def convert_with_cairosvg():
    """Try to convert using cairosvg Python library"""
    try:
        import cairosvg

        # Convert SVG to JPG (via PNG)
        cairosvg.svg2png(
            url='assets/images/default-og.svg',
            write_to='temp_default_og.png',
            output_width=1200,
            output_height=630
        )

        # Convert PNG to JPG
        from PIL import Image
        with Image.open('temp_default_og.png') as img:
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            rgb_img.paste(img, mask=img.split()[3] if img.mode == 'RGBA' else None)
            rgb_img.save('assets/images/default-og.jpg', 'JPEG', quality=90)

        # Convert SVG to PNG for logo
        cairosvg.svg2png(
            url='assets/images/logo.svg',
            write_to='assets/images/logo.png',
            output_width=600,
            output_height=600
        )

        # Clean up temp file
        os.remove('temp_default_og.png')

        print("✅ Images converted successfully using cairosvg!")
        return True

    except ImportError:
        return False

def create_placeholders():
    """Create placeholder images when conversion tools aren't available"""
    print("⚠️  Creating placeholder files...")

    # Create placeholder files with instructions
    placeholder_content = """This is a placeholder file.
Convert assets/images/default-og.svg to default-og.jpg (1200x630)
and assets/images/logo.svg to logo.png (600x600) using:
- Inkscape (recommended)
- Online SVG converter
- Or install: pip install wand cairosvg"""

    with open('assets/images/default-og.jpg', 'w') as f:
        f.write(placeholder_content)

    with open('assets/images/logo.png', 'w') as f:
        f.write(placeholder_content)

    print("📝 Placeholder files created with conversion instructions")

def main():
    print("🔄 Converting SVG images to SEO formats...")

    # Check if SVG files exist
    if not os.path.exists('assets/images/default-og.svg'):
        print("❌ default-og.svg not found")
        return False

    if not os.path.exists('assets/images/logo.svg'):
        print("❌ logo.svg not found")
        return False

    # Try different conversion methods
    if convert_with_inkscape():
        return True
    elif convert_with_wand():
        return True
    elif convert_with_cairosvg():
        return True
    else:
        print("❌ No conversion tools available")
        print("\n💡 Install one of the following:")
        print("   - Inkscape: sudo apt install inkscape")
        print("   - Wand: pip install wand")
        print("   - CairoSVG: pip install cairosvg")
        print("   - Or use an online SVG converter")

        create_placeholders()
        return False

if __name__ == "__main__":
    main()