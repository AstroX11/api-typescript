import {  postJson } from "xstro-utils";
import fs from 'fs'
const BASE_URL = 'http://localhost:3000/api';

// Test the removeBg route
async function testRemoveBg(buffer) {
  const formData = new FormData();
  formData.append('image', buffer, 'image.png');

  try {
    const response = await postJson(`${BASE_URL}/removeBg`, formData, {
      headers: formData.getHeaders(),
    });
    console.log('Remove Background Response:', response);
  } catch (error) {
    console.error('Error testing removeBg:', error);
  }
}

// Test the textToPdf route
async function testTextToPdf(content) {
  try {
    const response = await postJson(`${BASE_URL}/textToPdf`, { content });
    fs.writeFileSync(response, 'doc.pdf')
  } catch (error) {
    console.error('Error testing textToPdf:', error);
  }
}

// Example usage:
// For removeBg: Pass a valid image buffer to testRemoveBg
// For textToPdf: Pass a text string to testTextToPdf
testTextToPdf('Hello, this is a test content for the PDF!');
