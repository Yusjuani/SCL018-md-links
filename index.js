#!/usr/bin/env node
const fs = require('fs');
const fetch = require('node-fetch');
const markdownLinkExtractor = require('markdown-link-extractor');
const route = process.argv[2];
const yargs = require('yargs');
const option = yargs(process.argv.slice(2)).argv;
const chalk = require('chalk');


const readLinks = (data, path) => {
  const links = markdownLinkExtractor(data, true).filter(
    (link) => link.href.includes("https://") || link.href.includes("http://")
  );
  let arrayLinks = [];
  links.forEach((link) => {
    const objectLinks = {
      file: path,
      link: link.href,
      text: link.text,
    };
    arrayLinks.push(objectLinks);
  });
  return arrayLinks;
};

const contents = (file) => {
  return new Promise((resolve, reject) => {
   fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
     reject(err);
    } else {
     resolve(readLinks(data, file));
    }
   })
  })
};

const statusLinks = (links) => {
  const valiLinks = links.map((element => fetch(element.link)
      .then(response => {
          return {
            file: element.file,
            link: element.link,
            text: element.text,
            status: response.status,
          }
          })
        .catch(error => {
          return{
            link: element.link,
            text: element.text,
            status: 'Fail',
          }
          })
    )
  );
  return Promise.all(valiLinks);
};


const mdLinks = (file) => {
  return new Promise((resolve, reject) => {
  contents(file).then(valLinks => {
    if (option.validate) {
      resolve(statusLinks(valLinks));
    } else {
      resolve(valLinks);
    }
    }).catch(err => reject(err));
  });
}

mdLinks(route).then(rest => {console.log(rest)}).catch(err => console.error(err));

module.exports = {mdLinks, statusLinks};
