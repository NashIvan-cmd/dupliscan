"use client";

import { useState, useEffect } from "react";
import { Upload, Sun, Moon } from "lucide-react";
import { calculateHash, calculateSimilarity, convertToGrayScale, getPixelData, loadImage } from "@/lib/perceptual";

// Button Component
const Button = ({ children, onClick, size = "default", className = "" }) => {
  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      onClick={onClick}
      className={`bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = "", onClick }) => {
  return (
    <div onClick={onClick} className={`rounded-lg ${className}`}>
      {children}
    </div>
  );
};

// Switch Component
const Switch = ({ id, checked, onCheckedChange }) => {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-slate-900" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

// Label Component
const Label = ({ children, htmlFor, className = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
      {children}
    </label>
  );
};

export default function App() {
  const [mode, setMode] = useState("perceptual");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isSimilar, setIsSimilar] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [msg, setMsg] = useState("");
  const [score, setScore] = useState(null);

  useEffect(() => {
    // Check initial dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const perceptual =
    "Perceptual analysis compares images based on visual similarity - examining colors, textures, patterns, and structural features. This method is ideal for detecting duplicates, finding visually similar images, or identifying modifications like filters and edits. Use this when you need to know if images look alike to the human eye.";

  const semantic =
    "Semantic analysis understands the meaning and context of images - recognizing objects, scenes, and concepts regardless of visual appearance. Perfect for content-based search, categorization, and finding images with similar themes or subjects even when they look different. Use this when you care about what the images represent, not how they look.";

  const handleImageUpload = (e, imageNumber) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageNumber === 1) {
          setImage1(reader.result);
        } else {
          setImage2(reader.result);
        }
      };
      setIsSimilar(false);
      setIsDuplicate(false);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async() => {
    if (mode === "semantic") {
      alert("AI API Free tier is so useless");
      // try {
      //   const response = await fetch('/api/semantic', {
      //     method: 'POST',
      //     headers: {'Content-Type': 'application/json'},
      //     body: JSON.stringify({ image1: image1, image2: image2 })
      //   });

      //   if (!response.ok) {
      //     // If the server returned a non-JSON error or empty body, log the text for debugging
      //     const text = await response.text();
      //     console.error('Semantic API error', response.status, text);
      //   } else {
      //     const data = await response.json();
      //     console.log('Semantic response', data);
      //   }
      // } catch (err) {
      //   console.error('Semantic request failed', err);
      // } finally {
      //   console.log("Prevents falling to perceptual analysis in semantic mode")
      //   return;
      // }
    }
    if (image1 && image2) {
      console.log("Analyzing images in", mode, "mode");
      try {
        const img1 = await loadImage(image1);
        const pixels1 = getPixelData(img1);
        const gray1 = convertToGrayScale(pixels1);
        const hash1 = calculateHash(gray1);

        const img2 = await loadImage(image2);
        const pixels2 = getPixelData(img2);
        const gray2 = convertToGrayScale(pixels2);
        const hash2 = calculateHash(gray2);

        const similarity = calculateSimilarity(hash1, hash2);

        console.log("Similarity", similarity);
        if (similarity < 20 ) {
          setMsg("Very Different")
        } else if (similarity > 20 && similarity < 80) {
          setMsg("Somewhat Different")
        } else if (similarity >= 80 && similarity < 100){
          setMsg("Very Similar")
        } else {
          setMsg("Duplicate!");
        }
        setScore(similarity);
      } catch (error) {
        console.error("Analyze error", error);
      }

    } else {
      alert("Please upload both images before analyzing.");
    }
  };

  // Dynamic styles based on darkMode
  const bgClass = darkMode 
    ? "bg-gradient-to-br from-slate-900 to-slate-800" 
    : "bg-gradient-to-br from-slate-50 to-slate-100";
  
  const titleClass = darkMode ? "text-slate-100" : "text-slate-900";
  
  const cardBgClass = darkMode ? "bg-slate-800" : "bg-white";
  
  const textClass = darkMode ? "text-slate-300" : "text-slate-600";
  
  const uploadBgClass = darkMode ? "bg-slate-700" : "bg-slate-100";
  
  const borderClass = darkMode 
    ? "border-slate-600 hover:border-slate-500" 
    : "border-slate-300 hover:border-slate-400";
  
  const uploadTextClass = darkMode ? "text-slate-500" : "text-slate-400";
  
  const toggleBtnClass = darkMode 
    ? "bg-slate-800 border-slate-700" 
    : "bg-white border-slate-200";

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${bgClass}`}>
      {/* Dark Mode Toggle - Top Right */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 p-3 rounded-full shadow-lg hover:shadow-xl transition-all border ${toggleBtnClass}`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </button>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={`text-4xl font-bold transition-colors ${titleClass}`}>
            Image Analysis Application
          </h1>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label
              htmlFor="mode-toggle"
              className={`transition-colors ${
                mode === "perceptual" 
                  ? (darkMode ? "text-slate-100" : "text-slate-900")
                  : (darkMode ? "text-slate-500" : "text-slate-400")
              }`}
            >
              Perceptual
            </Label>
            <Switch
              id="mode-toggle"
              checked={mode === "semantic"}
              onCheckedChange={(checked) =>
                setMode(checked ? "semantic" : "perceptual")
              }
            />
            <Label
              htmlFor="mode-toggle"
              className={`transition-colors ${
                mode === "semantic"
                  ? (darkMode ? "text-slate-100" : "text-slate-900")
                  : (darkMode ? "text-slate-500" : "text-slate-400")
              }`}
            >
              Semantic
            </Label>
          </div>
        </div>

        {/* Description Text */}
        <Card className={`p-6 shadow-sm transition-colors ${cardBgClass}`}>
          <p className={`leading-relaxed transition-colors ${textClass}`}>
            {mode === "perceptual" ? perceptual : semantic}
          </p>
        </Card>

        {/* Image Upload Boxes */}
        <div className="grid grid-cols-2 gap-6">
          {/* Image Box 1 */}
          <div>
            <Card
              className={`p-6 shadow-sm cursor-pointer hover:shadow-md transition-all ${cardBgClass}`}
              onClick={() => document.getElementById("upload-1")?.click()}
            >
              <div className="space-y-4">
                <h2 className={`text-lg font-semibold transition-colors ${titleClass}`}>
                  Image 1
                </h2>
                <div className={`w-full h-64 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${uploadBgClass} ${borderClass}`}>
                  {image1 ? (
                    <img
                      src={image1}
                      alt="Upload 1"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className={`text-center transition-colors ${uploadTextClass}`}>
                      <Upload className="w-12 h-12 mx-auto mb-2" />
                      <p>Click to upload image</p>
                      <p className="text-sm mt-1">Accepts only PNG or JPG/JPEG</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            <input
              id="upload-1"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 1)}
            />
          </div>

          {/* Image Box 2 */}
          <div>
            <Card
              className={`p-6 shadow-sm cursor-pointer hover:shadow-md transition-all ${cardBgClass}`}
              onClick={() => document.getElementById("upload-2")?.click()}
            >
              <div className="space-y-4">
                <h2 className={`text-lg font-semibold transition-colors ${titleClass}`}>
                  Image 2
                </h2>
                <div className={`w-full h-64 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${uploadBgClass} ${borderClass}`}>
                  {image2 ? (
                    <img
                      src={image2}
                      alt="Upload 2"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className={`text-center transition-colors ${uploadTextClass}`}>
                      <Upload className="w-12 h-12 mx-auto mb-2" />
                      <p>Click to upload image</p>
                      <p className="text-sm mt-1">Accepts only PNG or JPG/JPEG</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            <input
              id="upload-2"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 2)}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleAnalyze}
            className="px-12"
          >
            Analyze Images
          </Button>
        </div>
        <div className="flex justify-center">
          {score ? (
            <p className={`text-xl font-medium transition-colors ${titleClass}`}>
              Similarity Score: {score}% - {msg}
            </p>
          ) : (
            <p className={`text-xl font-medium transition-colors ${titleClass}`}>
              Upload images and click "Analyze Images" to see similarity score.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}