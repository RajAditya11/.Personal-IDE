const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//for backend on render host we include
app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});


app.post('/run', (req, res) => {
  const { code, language, input } = req.body;

  // Save the code to a file based on the selected language
  const fileName = language === 'cpp' ? 'temp.cpp' : 'Main.java';
  try {
    fs.writeFileSync(fileName, code);

    // Execute the code based on the selected language
    let command;
    if (language === 'cpp') {
      command = `g++ ${fileName} -o temp && echo "${input.replace(/(["\\'$`!&*()<>])/g, '\\$1')}" | ./temp`;
    }else if (language === 'java') {
      command = `javac Main.java && java Main`; // Run the Main class
    }
  

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing code: ${stderr}`);
        res.json({ output: stderr });
      } else {
        res.json({ output: stdout });
      }

      // Clean up the generated files
      try {
        fs.unlinkSync(fileName);
        if (language === 'cpp') fs.unlinkSync('temp');
        if (language === 'java') fs.unlinkSync(fileName.replace('.java', '.class'));
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    });
  } catch (writeError) {
    console.error('Error writing file:', writeError);
    res.json({ output: 'Error writing file.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

