#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const { Command } = require('commander');

const program = new Command();

program
  .option('-u, --url <url>', 'URL of the web page')
  .option('-s, --selector <selector>', 'CSS selector to match the element');

program.parse(process.argv);

const options = program.opts();

const { url, selector } = options;

if (!url || !selector) {
  console.error('Both URL and CSS selector are required.');
  process.exit(1);
}

axios
  .get(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const selectedElement = $(selector);

    if (selectedElement.length === 0) {
      console.error('No elements match the provided selector.');
      process.exit(1);
    }

    const textContent = selectedElement.text();
    console.log(textContent);
  })
  .catch((error) => {
    console.error('Error:', error.message || 'An error occurred.');
    process.exit(1);
  });
