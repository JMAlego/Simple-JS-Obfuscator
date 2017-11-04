# Simple JavaScript Obfuscator

## What is this?

This is a simple Javascript obfuscator written in JavaScript. It runs with node.js, but ironically cannot always obfuscate/minify node.js code (mainly due to those pesky requires).

## How did this come to be?

While writing another unrelated program, I needed to obfuscate some code. So, being the totally sane person I am, I decided to writ my own. After a few evenings of light coding the program you are currently looking at was born. It may not be all that pretty, it's probably inefficient, it has an unhealthy obsession with regular expressions, but hey, at least it's commented.

## How do I use it?

### **Step 1**: clone this repository

```shell
git clone git@github.com:JMAlego/Simple-JS-Obfuscator.git
```

### **Step 2**: Install requirements

```shell
cd Simple-JS-Obfuscator
npm install
```

### **Step 3**: And finally, run it

#### On Linux:

```shell
./obfuscator.js [arguments go here]
```

Or

```shell
node ./obfuscator.js [arguments go here]
```

#### On Windows:

```shell
node .\obfuscator.js [arguments go here]
```

### Usage and Arguments

To quote the program itself:

```
Usage:
    node ./obfuscator.js INPUT_FILE [options...]

Arguments:
    -h, --help     - Displays this help message, then exits
    --version      - Displays version message, then exits
    -o FILENAME    - Output file name
    -v, --verbose  - Verbose
```

## Can I use this code?

If you really want to? Sure, as long as you follow the license.
