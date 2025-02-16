"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic } from "lucide-react"
import Footer from "./footer"

interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}


interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;  // Changed from Error to SpeechRecognitionErrorEvent
  onend: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

export default function VoxVision() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    }
  }, []);

  // Sound effect functions
  const playStartSound = useCallback(() => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start sound configuration
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime); // Higher pitch
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, [audioContext]);

  const playStopSound = useCallback(() => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Stop sound configuration
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // Start high
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.1); // End low
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, [audioContext]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported');
        return;
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript.toLowerCase());
        setIsListening(false);
        playStopSound();
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError('Failed to recognize speech. Please try again.');
        setIsListening(false);
        playStopSound();
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        // Only play stop sound if it wasn't already played by onresult
        if (isListening) {
          playStopSound();
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [isListening, playStopSound]);

  const handleVoiceInput = async () => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (!audioContext) {
      setError('Audio is not supported in your browser.');
      return;
    }

    // Resume AudioContext if it was suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setError('');
      playStartSound();
      recognition.start();
      setIsListening(true);
    }
  };

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

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <h1 className="inconsolata-xl font-light mb-8 text-citron">VoxVision</h1>

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
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 
                       text-citron hover:text-citron/80 transition-all
                       ${isListening ? 'animate-pulse text-red-400' : ''}`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
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
          <h2 className="inconsolata-med font-thin mb-4 text-citron">Translation:</h2>
          <div className="bg-walnut-brown rounded-md overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
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