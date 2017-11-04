#!/usr/bin/env node

/**
 * A simple JavaScript obfuscator, made on an evening, by Jacob Allen
 */

//Import modules
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2), { //Specify flag types
  boolean: ["h", "help", "v", "verbose", "version"],
  string: ["o"]
});

/**
 * Obfuscator class (where the magic happens)
 */
class Obfuscator {

  /**
   * Constructor for the Obfuscator class
   * @param {boolean} verbose 
   */
  constructor(verbose = false) {
    this.boolVerboseMode = verbose;
  }

  /**
   * 
   * @param {string} strInputString 
   */
  obfuscate(strInputString) {
    //Define regular expression constants
    const reWords = /([a-z0-9]+)/gi;
    const reShebang = /^#!.*(\r|\n|\r\n)/gi;
    const reComments = /(\/\*[\s\S]*?\*\/|\s*\/\/.*(\r|\n|\r\n|$))/gi;
    const reWhiteSpace = /([\n\r])(\s)+/gi;
    const reSemiColonNewLine = /;[\n\r]+/gim;

    //Define output variable
    var strOutput = "";

    //Filter out comments and white space
    strInputString = strInputString.replace(reComments, "");
    strInputString = strInputString.replace(reShebang, "");
    strInputString = strInputString.replace(reWhiteSpace, function (a, b, c) {
      return b;
    });
    strInputString = strInputString.replace(reSemiColonNewLine, ";");

    //Pull words out of input
    var strWord = strInputString.match(reWords);

    //Define variables for word count
    var lstWordCountDictionary = [];
    var intWordCount = 0;

    //Loop through all occurrences of words
    for (var i in strWord) {
      //Loop item variable
      var word = "" + strWord[i];

      //Look through the current items in the dictionary
      var j = 0;
      while (j < lstWordCountDictionary.length) {
        //If the word is already there, increment the word count
        if (lstWordCountDictionary[j].word == word) {
          lstWordCountDictionary[j].count++;
          break;
        }
        j++;
      }

      //If the word wasn't there, add the word
      if (j == lstWordCountDictionary.length) {
        lstWordCountDictionary.push({
          word: word,
          count: 1
        });
      }
    }

    //Debug output
    if(this.boolVerboseMode)
      console.log("Word Dictionary is as follows:\n", lstWordCountDictionary);

    //Define variable to contain results of loop
    var lstHalfSortedWords = [];

    //For each word + count pair
    for (var i in lstWordCountDictionary) {
      //Put the current item in a variable, for ease of use
      var item = lstWordCountDictionary[i];

      //Find the highest possible position this word could be at
      var count = item.count + lstWordCountDictionary.length;

      //While something else already has that position, try the position below
      while (lstHalfSortedWords[count] !== undefined) count--;

      //Assign the word to the found empty position
      lstHalfSortedWords[count] = item.word;
    }

    //Define variable to contain the fully sorted word list
    var lstSortedWords = [];

    //Loop through the half sorted word list
    for (var i in lstHalfSortedWords) {
      //Push item onto the final list to remove empty spaces in list
      lstSortedWords.push(lstHalfSortedWords[i]);
    }

    //Reverse so most common is nearer the front of the list
    lstSortedWords = lstSortedWords.reverse();

    
    //Debug output
    if(this.boolVerboseMode)
      console.log("Sorted words list is as follows:\n", lstSortedWords);

    //for each word in the sorted words
    for (var i in lstSortedWords) {
      //Update the input string, with the result of replacing the current word...
      strInputString = strInputString.replace(
        RegExp("(^|[^a-z0-9])(" + lstSortedWords[i] + ")($|[^a-z0-9])", "mg"),
        function (a, b, c, d) {
          //With it's position, and an 'x' prefix
          return b + "x" + i + d;
        }
      );
    }

    //Replace all new lines with 'xn'
    strInputString = strInputString.replace(/(?:\r\n|\r|\n)/g, "xn");

    //Replace all double quotes with 'xq'
    strInputString = strInputString.replace(/(?:")/g, "xq");

    //Replace all single quotes with 'xs'
    strInputString = strInputString.replace(/(?:')/g, "xs");

    //Replace all back-slashes with 'xb'
    strInputString = strInputString.replace(/(?:\\)/g, "xb");

    //Update the output to a wrapper function which decodes and evaluates the original input code when run
    strOutput =
      '(function(){let e=eval;let x = "' +
      strInputString +
      '";let z = "";[["xb","\\\\"],["xn","\\n"],["xq","\\""],["xs","\'"]].map(function(z){x=x.replace(RegExp(z[0],"g"),z[1])});z = "' +
      lstSortedWords.join(" ") +
      '".split(" ");let y = z.length - 1;while(y > -1){x = x.replace(RegExp("x"+y,"g"),z[y]);y--}e(x);}());';

    //Debug output
    if(this.boolVerboseMode)
      console.log("Output code is as follows:\n", strOutput);

    //Return the finished code
    return strOutput;
  }
}

//If this script was called directly and not imported
if (require.main === module) {
  //Define some version text
  const strVersionText = "Obfuscator.js version 0.1.0 by Jacob Allen";

  //Define the default output file name and leave the input file name blank
  var strOutputFileName = "output.js";
  var strInputFileName = "";

  //Decide if we're in verbose mode
  var boolVerboseMode = argv["v"] || argv["verbose"];

  //If the help flag was present, print the help, then exit
  if (argv["h"] || argv["help"]) {
    console.log(strVersionText);
    console.log("\nUsage:");
    console.log("    node ./obfuscator.js INPUT_FILE [options...]");
    console.log("\nArguments:");
    console.log("    -h, --help     - Displays this help message, then exits");
    console.log("    --version      - Displays version message, then exits");
    console.log("    -o FILENAME    - Output file name");
    console.log("    -v, --verbose  - Verbose");
    return;
  }

  //If the version flag was present, print the version, then exit
  if (argv["version"]) {
    console.log(strVersionText);
    return;
  }

  //If the output file name flag was present, update the output file name
  if (argv["o"]) {
    strOutputFileName = argv["o"];
  }

  //Deal with non-flag arguments
  if (argv["_"] && argv["_"].length == 1) { //If we have some non-flag arguments and there's just one of them
    //Update the input file name with the argument
    strInputFileName = argv["_"][0];
  } else if (argv["_"] && argv["_"].length > 1) { //If we have some non-flag arguments, and there's more than one
    //Just use the first one, and alert the user
    strInputFileName = argv["_"][0];
    console.log("Extra inputs files found, throwing away.");
  } else { //If there are no non-flag arguments
    //Tell the user that won't work, then exit
    console.log("Command requires input file name.");
    return;
  }

  //Create an instance of the class that does the real work
  var obfuscator = new Obfuscator(boolVerboseMode);

  //Read the input file
  fs.readFile(strInputFileName, (err, strInputCode) => {
    //If we couldn't read the file, tell the user
    if (err) console.log("File does not exist or cannot be read.");
    else { //If we could read the file
      //Obfuscate the input code
      var strObfuscatedCode = obfuscator.obfuscate(strInputCode.toString());

      //Write the resulting obfuscated code to the output file
      fs.writeFile(strOutputFileName, strObfuscatedCode, err => {
        //If we couldn't write the output file, tell the user
        if (err) {
          console.log("Could not write to file.");
        }
      });
    }
  });
}