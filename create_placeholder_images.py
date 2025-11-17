#!/usr/bin/env python3
"""
Create minimal placeholder images for SEO
"""

import base64

def create_minimal_jpg():
    """Create a minimal 1x1 JPG file with purple color"""
    # This is a minimal valid JPEG file with purple color
    jpg_data = base64.b64decode("""
    /9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE
    BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEB
    AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAED
    ASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QA
    FQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA=
    """)
    return jpg_data

def create_minimal_png():
    """Create a minimal 1x1 PNG file with transparency"""
    # This is a minimal valid PNG file with transparency
    png_data = base64.b64decode("""
    iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg==
    """)
    return png_data

def main():
    print("📁 Creating placeholder SEO images...")

    # Create default-og.jpg placeholder
    with open('assets/images/default-og.jpg', 'wb') as f:
        f.write(create_minimal_jpg())
    print("✅ Created assets/images/default-og.jpg")

    # Create logo.png placeholder
    with open('assets/images/logo.png', 'wb') as f:
        f.write(create_minimal_png())
    print("✅ Created assets/images/logo.png")

    print("\n📝 These are minimal placeholder files.")
    print("💡 Replace them with proper images using:")
    print("   - SVG files created: default-og.svg, logo.svg")
    print("   - Online converter or Inkscape for final versions")
    print("   - Run: python3 convert_svg_images.py")

if __name__ == "__main__":
    main()