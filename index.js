//module.exports = () => {
  // ...
//};

  const fs = require('fs');
  console.log('iniciado')
  fs.readFile('README.md', 'utf-8', (err, data) => {
    if (err) {
      console.log(`error ${error}`);
    }else{
      console.log(data);
    }
  
  })
console.log('fin')
  

