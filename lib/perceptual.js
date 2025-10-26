import { resolve } from "styled-jsx/css";

// Utility Functions
export async function loadImage(base64String) {
    return new Promise ((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = base64String;
    })
}

export function getPixelData(img) {
  const canvas = document.createElement('canvas');
  
  canvas.width = 8;
  canvas.height = 8;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 8, 8);
  return ctx.getImageData(0, 0, 8, 8);
}

export function convertToGrayScale(imageData) {
    const pixels = imageData.data;
    const grayScale = [];

    for (let i = 0; i < pixels.length; i += 4) {
        const gray = 0.299 * pixels[i] + 0.587 * pixels[i+1] + 0.114 * pixels[i+2];
        grayScale.push(gray);
    }
    return grayScale;
}

export function calculateHash(grayScale) {
    const avg = grayScale.reduce((a, b) => a + b) / grayScale.length;
    return grayScale.map(val => val > avg ? '1' : '0').join('');
}

export function calculateSimilarity(hash1, hash2) {
    let differences = 0;
    
    for (let i = 0; i < hash1.length; i++) {
        if (hash1[i] !== hash2[i]) differences++;
    }

    const similarity = ((hash1.length - differences) / hash1.length) * 100;
    return similarity.toFixed(2);
}