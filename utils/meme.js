import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

// Function to get all PNG files from media directory
function getAvailableTemplates(mediaFolder = './media') {
  try {
    const files = fs.readdirSync(mediaFolder);
    return files
      .filter(file => file.toLowerCase().endsWith('.png'))
      .map(file => file.replace('.png', ''));
  } catch (error) {
    console.error('Error reading media directory:', error);
    return [];
  }
}

async function addTextToTweet(inputText, templateName) {
  const mediaFolder = './media';
  const availableTemplates = getAvailableTemplates(mediaFolder);
  
  if (!availableTemplates.includes(templateName)) {
    throw new Error(`Template "${templateName}" not found. Available templates: ${availableTemplates.join(', ')}`);
  }

  const imagePath = path.join(mediaFolder, `${templateName}.png`);
  const canvas = createCanvas(825, 462);
  const ctx = canvas.getContext('2d');

  const image = await loadImage(imagePath);
  ctx.drawImage(image, 0, 0);

  ctx.font = '20px Sans-Serif';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const lineHeight = 30;
  const maxWidth = 780;
  const textX = 20;
  const textY = 140;

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  wrapText(ctx, inputText, textX, textY, maxWidth, lineHeight);
  return canvas.toBuffer('image/png');
}

export { addTextToTweet, getAvailableTemplates };