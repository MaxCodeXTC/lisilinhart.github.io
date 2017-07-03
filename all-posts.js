const directory = './posts';
const fs = require('fs');
let allFiles = [];

function convertFile(path) {
  return new Promise(function(resolve, reject) {
    const lineCount = 5;
    const post = {};

    let stream = fs.createReadStream(path, {
      flags: "r",
      encoding: "utf-8",
      fd: null,
      mode: 438,
      bufferSize: 64 * 1024
    });

    let data = "";
    let lines = [];

    stream.on("data", function (moreData) {
      data += moreData;
      lines = data.split("\n");

      if (lines.length > lineCount + 1) {
        stream.destroy();

        lines = lines.slice(1, lineCount - 1);
        lines.map(function(line) {
          const arr = line.split(': ');
          post[arr[0]] = arr[1];
        });
      }
    });

    stream.on("error", function () {
      reject("ERROR in reading files");
    });

    stream.on("close", function () {
      resolve(post);
    });
  });
}

fs.readdir(directory, (err, files) => {
  const promises = [];
  files.forEach(file => {
    const path = directory + '/' + file;
    promises.push(convertFile(path));
  });

  Promise.all(promises).then(function(res) {
    const content = JSON.stringify(res);
    fs.writeFile("./all-posts.json", content, 'utf8', function (err) {
        if (err) { return console.log(err); }
        console.log("The file was saved!");
    }); 
  }, function() {
    console.log("Error")
  });
});

  //console.log(allFiles);

  // const content = JSON.stringify(allFiles);
  // console.log(allFiles, content);
  // fs.writeFile("./all-posts.json", content, 'utf8', function (err) {
  //     if (err) { return console.log(err); }

  //     console.log("The file was saved!");
  // }); 
