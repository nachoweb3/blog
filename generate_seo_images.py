#!/usr/bin/env python3
"""
Script to generate SEO images for NachoWeb3 blog
Creates default-og.jpg and logo.png with Matrix purple theme
"""

from PIL import Image, ImageDraw, ImageFont
import textwrap

def create_gradient_background(width, height, color1, color2):
    """Create a gradient background"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)

    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return image

def create_og_image():
    """Create Open Graph default image (1200x630)"""
    width, height = 1200, 630

    # Matrix purple gradient
    color1 = (75, 0, 130)     # Purple
    color2 = (138, 43, 226)   # Medium purple

    image = create_gradient_background(width, height, color1, color2)
    draw = ImageDraw.Draw(image)

    try:
        # Try to use a nice font
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except:
        # Fallback to default font
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Add logo placeholder (circle with "N")
    logo_size = 120
    logo_x, logo_y = width // 2, 120
    draw.ellipse([logo_x - logo_size//2, logo_y - logo_size//2,
                  logo_x + logo_size//2, logo_y + logo_size//2],
                 fill=(255, 255, 255), outline=(200, 200, 200), width=3)

    # Add "N" in the circle
    draw.text((logo_x - 25, logo_y - 45), "N", fill=color1, font=font_large)

    # Add main title
    title = "NachoWeb3"
    draw.text((width//2 - 150, logo_y + 80), title, fill=(255, 255, 255), font=font_large)

    # Add subtitle
    subtitle = "Noticias de IA, Blockchain y las mejores guías"
    draw.text((width//2 - 280, logo_y + 160), subtitle, fill=(255, 255, 255), font=font_medium)

    # Add categories
    categories = ["🤖 Inteligencia Artificial", "⛓️ Blockchain", "📚 Tutoriales"]
    y_offset = logo_y + 220
    for category in categories:
        draw.text((width//2 - 200, y_offset), category, fill=(220, 220, 255), font=font_small)
        y_offset += 40

    # Add URL at bottom
    url = "nachoweb3.github.io"
    draw.text((width//2 - 100, height - 60), url, fill=(255, 255, 255), font=font_small)

    return image

def create_logo():
    """Create logo image (600x600)"""
    size = 600
    image = Image.new('RGBA', (size, size), (0, 0, 0, 0))  # Transparent background
    draw = ImageDraw.Draw(image)

    # Matrix purple colors
    purple = (75, 0, 130)
    light_purple = (138, 43, 226)

    # Create main circle
    circle_size = 500
    circle_x, circle_y = size // 2, size // 2

    # Draw gradient circle effect
    for i in range(20, 0, -1):
        radius = circle_size // 2 + i * 5
        alpha = int(255 * (1 - i / 20))
        color = (*light_purple, alpha)
        draw.ellipse([circle_x - radius, circle_y - radius,
                      circle_x + radius, circle_y + radius],
                     fill=color)

    # Main white circle
    draw.ellipse([circle_x - circle_size//2, circle_y - circle_size//2,
                  circle_x + circle_size//2, circle_y + circle_size//2],
                 fill=(255, 255, 255), outline=purple, width=8)

    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Add "N" letter
    draw.text((circle_x - 45, circle_y - 50), "N", fill=purple, font=font_large)

    # Add "WEB3" below
    draw.text((circle_x - 80, circle_y + 80), "WEB3", fill=light_purple, font=font_small)

    return image

def main():
    print("🎨 Generating SEO images for NachoWeb3 blog...")

    try:
        # Create Open Graph image
        print("📱 Creating default-og.jpg (1200x630)...")
        og_image = create_og_image()
        og_image.save("assets/images/default-og.jpg", "JPEG", quality=90)
        print("✅ default-og.jpg created successfully!")

        # Create logo
        print("🔷 Creating logo.png (600x600)...")
        logo_image = create_logo()
        logo_image.save("assets/images/logo.png", "PNG")
        print("✅ logo.png created successfully!")

        print("\n🎉 All SEO images generated successfully!")
        print("📁 Files saved in assets/images/")

    except Exception as e:
        print(f"❌ Error generating images: {e}")
        print("💡 Make sure you have Pillow installed: pip install Pillow")

if __name__ == "__main__":
    main()