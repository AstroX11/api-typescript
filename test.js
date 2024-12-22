import axios from 'axios';
import * as cheerio from 'cheerio';

async function GizChinaNews() {
  const url = 'https://www.gizchina.com/category/news/';
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const articles = [];

    // Iterate through each post box to extract titles, links, and descriptions
    $('.vw-post-box').each((i, el) => {
      const title = $(el).find('.vw-post-box__title a').text().trim();  // Trim the title to remove extra spaces/newlines
      const link = $(el).find('.vw-post-box__title a').attr('href');  // Get the link from the <a> tag
      const description = $(el).find('.vw-post-box__excerpt p').text().trim();  // Extract description from the <p> tag

      // Only add the post if it has a title, link, and description
      if (title && link && description) {
        articles.push({ title, link, description });
      }
    });

    return articles;
  } catch (error) {
    console.error('Error fetching GizChina news:', error);
    return [];
  }
}
