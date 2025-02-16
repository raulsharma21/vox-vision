"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic } from "lucide-react"
import Footer from "./footer"

export default function VoxVision() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please enter some text to translate");
      return;
    }

    setLoading(true);
    setError("");
    const text = input.toLowerCase();
    
    // Configuration
    const LETTER_WIDTH = 150;  // Width of each letter
    const LETTER_HEIGHT = 150; // Height of each letter
    const MARGIN = 150;        // Margin from edges
    const LINE_SPACING = 50;   // Space between lines
    
    // Break text into words
    const words = text.toLowerCase().split(' ');
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    // Calculate maximum letters per line
    const maxWidth = canvas.width - (MARGIN * 2);
    
    // Pre-calculate word widths and required height
    let currentLineWidth = 0;
    let linesNeeded = 1;
    
    // Calculate required height
    words.forEach((word) => {
      const wordWidth = word.length * LETTER_WIDTH;
      
      if (currentLineWidth + wordWidth > maxWidth) {
        linesNeeded++;
        currentLineWidth = wordWidth;
      } else {
        currentLineWidth += wordWidth + LETTER_WIDTH; // Add space width
      }
    });
    
    // Calculate required canvas height
    const requiredHeight = Math.max(
      1080,
      (MARGIN * 2) + (linesNeeded * LETTER_HEIGHT) + ((linesNeeded - 1) * LINE_SPACING)
    );
    
    // Adjust canvas height if needed
    canvas.height = requiredHeight;
    
    // Set background color (RGB: 118,100,77)
    ctx.fillStyle = 'rgb(118,100,77)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Helper function to load images
    const loadImage = (letter: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `/alphabets/${letter}.png`;
      });
    };

    try {
      let xPosition = MARGIN;
      let yPosition = MARGIN;
      
      // Process each word
      for (const word of words) {
        const wordWidth = word.length * LETTER_WIDTH;
        
        // Check if word fits on current line
        if (xPosition + wordWidth > canvas.width - MARGIN) {
          // Move to next line
          xPosition = MARGIN;
          yPosition += LETTER_HEIGHT + LINE_SPACING;
        }
        
        // Draw each letter in the word
        for (const char of word) {
          if (!/[a-z]/.test(char)) continue;
          
          const img = await loadImage(char);
          ctx.drawImage(img, xPosition, yPosition, LETTER_WIDTH, LETTER_HEIGHT);
          xPosition += LETTER_WIDTH;
        }
        
        // Add space after word
        xPosition += LETTER_WIDTH;
      }
      
      // Convert canvas to data URL and set as result
      const resultImage = canvas.toDataURL('image/png');
      setResult(resultImage);
    } catch (error) {
      console.error('Error generating sign language translation:', error);
      setError('Error generating translation. Please ensure all image assets are available.');
      setResult("");
    } finally {
      setLoading(false);
    }
  }

  const handleVoiceInput = () => {
    // Placeholder for voice input functionality
    console.log("Voice input activated")
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <h1 className="momcake-thin-xl font-bold mb-8 text-citron">VoxVision</h1>
      <div className="w-full space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter text to translate"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-walnut-brown text-citron placeholder-citron/50 pr-10"
          />
          <button
            onClick={handleVoiceInput}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-citron hover:text-citron/80"
          >
            <Mic size={20} />
          </button>
        </div>
        <Button 
          onClick={handleGenerate} 
          className="w-full bg-black text-citron momcake-med hover:bg-black/90"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Sign Language"}
        </Button>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-md w-full">
          {error}
        </div>
      )}
      {result && (
        <div className="mt-8 w-full">
          <h2 className="text-2xl momcake-thin-med font-semibold mb-4 text-citron">Translation:</h2>
          <div className="bg-walnut-brown rounded-md overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              {/* Using regular img tag for data URL support */}
              <img 
                src={result} 
                alt="Sign language translation" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}