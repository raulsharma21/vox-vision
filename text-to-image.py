from PIL import Image, ImageDraw, ImageFont

def main():
    text = "Hello World"
    text.lower()
    
    poster = Image.new('RGB', (1920, 1080), (118,100,77))
    draw = ImageDraw.Draw(poster)

    position = (150, 150)
    for c in text:
        if c == " ":
            continue
        # Get image from alphabets folder
        image = Image.open(f"./alphabets/{c}.png")
        # Resize image to 100x100
        image = image.resize((150, 150))
        # Paste image onto poster
        poster.paste(image, position)
        position = (position[0] + 150, position[1])

    # Show the poster
    poster.show()

main()