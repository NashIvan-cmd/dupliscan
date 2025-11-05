
// Utility Functions
export async function loadImage(base64String) {
    return new Promise ((resolve) => {
        // FileReader.readAsDataURL returns a base64 string. This function converts it back to an Image object.
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

    for (let i = 0; i < pixels.length; i += 4) { // Increment by 4 for RGBA channels
        const gray = 0.299 * pixels[i] + 0.587 * pixels[i+1] + 0.114 * pixels[i+2]; // Rec. 601 Luma formula
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

    // Stores the maximum length to avoid issues with different length hashes
    // But in this logic, both hashes should ideally be of the same length
    const maxLength = Math.max(hash1.length, hash2.length);
    
    for (let i = 0; i < maxLength; i++) {
        console.log(`Comparing position ${i}: hash1=${hash1[i]}, hash2=${hash2[i]}`); // For better visualization
        if (hash1[i] !== hash2[i]) differences++;
    }

    const similarity = ((maxLength - differences) / maxLength) * 100;
    return similarity.toFixed(2);
}