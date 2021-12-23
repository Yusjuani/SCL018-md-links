//module.exports = () => {
  // ...
//};
  //const chalk = require('chalk');
  const fs = require('fs');
  const markdownLinkExtractor = require("markdown-link-extractor");
  const ruta = process.argv[2];


  const linkExtractor = (dataFile, pathInitial) => {
    const links = markdownLinkExtractor(dataFile, true).filter(
      (link) => link.href.includes("https://") || link.href.includes("http://")
    );
    let arrayLinks = [];
    links.forEach((link) => {
      const objectLinks = {
        file: pathInitial,
        link: link.href,
        text: link.text,
      };
      arrayLinks.push(objectLinks);
    });
    return arrayLinks;
  };

    
  const lectura = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }else{
        resolve(linkExtractor(data, filePath))
      }
    })
  });
}
lectura(ruta).then(rest => {console.log(rest)});

