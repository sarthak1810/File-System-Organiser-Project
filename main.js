#!/usr/bin/env node         
// We have written this to make it global i.e. now we can run this on our command prompt

let inputArr = process.argv.slice(2);
let path = require('path');
let fs = require('fs');

let types = {
    video : ['mp4','mkv'],
    images : ['jpg','png','gif','jpeg'],
    archives : ['rar','zip'],
    documents : ['docx','doc','pdf','xlsx','xls','ods','odp','txt','tex'],
    app : ['exe','dmg','pkg','deb']
    }

let command = inputArr[0];

switch (command) {
    case "tree":
        treefn(inputArr[1]);
        break;

    case "organise":
        organisefn(inputArr[1]);
        break;

    case "help":
        helpfn(inputArr[1]);
        break;

    default:
        console.log("Please Enter correct input");
        break;
}

function treefn(dirPath) {

    // 1. input -> Directory Path given
    if(dirPath == undefined) {     //if undefined then use current working directory
        treeHelper(process.cwd(), "");
    }
    else {

        let doesExist = fs.existsSync(dirPath);

        if (doesExist) {
            treeHelper(dirPath, "");
        }
        else {
            console.log("Folder already exist");
            return;
        }
    }

}

function treeHelper(dirPath, indent) {

    // Check whether it is a file or a folder
    // If file then we have to print
    // And if a folder exist then we have to go to its children

    let isFile = fs.lstatSync(dirPath).isFile();

    if(isFile == true) {
        let filename = path.basename(dirPath);
        console.log(indent + "├──" + filename);
    }

    // if not file then print folder/directory loop for all its child 
    else {

        let dirName = path.basename(dirPath);
        console.log(indent + "──" + dirName);

        let children = fs.readdirSync(dirPath);
        for(let i=0; i<children.length; i++) {

            let childPath = path.join(dirPath, children[i]);
            treeHelper(childPath, indent + "\t");

        }
    }

}


// Organise function
function organisefn(dirPath) {
    
    let destPath;

    // 1. input -> Directory Path given
    if(dirPath == undefined) {
        // console.log("Kindly enter the correct path");
        destPath = process.cwd();
    }
    else {

        let doesExist = fs.existsSync(dirPath);

        if (doesExist) {

            // 2. Create a new directory that store all organised files
            destPath = path.join(dirPath, "Organised_files");

            // If new folder does not exist then create 
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
        }
        else {
            console.log("Folder already exist");
            return;
        }
    }

    organiseFile(dirPath, destPath);
}


// Organise File function....read directory
function organiseFile(src, dest) {

    // 3. Identify categories of all the files present in that directory
    let childName = fs.readdirSync(src);
    // console.log(childName);


    // required child address to organise file
    for(let i=0; i<childName.length; i++) {
        
        let childAddress = path.join(src, childName[i]);

        //To check whether it is a file or a folder
        // Because we have to organise only files 
        let isFile = fs.lstatSync(childAddress).isFile();
        
        if(isFile) {
            // console.log(childName[i]);

            let category = getCategory(childName[i]);
            console.log(childName[i], "belongs to --> ", category);

            // 4. Copy/cut files to that organised directory inside its particular category folder

            sendfile(childAddress, dest, category);
        }

    }
}


// Copy/cut files to that organised directory inside its particular category folder
function sendfile(srcFilePath, destination, category) {
    //  make srcfile + category path
    let categoryPath = path.join(destination, category);

    // if this path does not exist
    if(fs.existsSync(categoryPath) == false) {
        // then make folder in this path
        fs.mkdirSync(categoryPath);
    }

    let fileName = path.basename(srcFilePath); //file name accordinng to their extension
    let destFilePath = path.join(categoryPath, fileName); 
    fs.copyFileSync(srcFilePath, destFilePath);
    fs.unlinkSync(srcFilePath); //cut option remove file from original path
    console.log(fileName, " copies to", destFilePath);
}


// To get the category of file
function getCategory(name) {

  let ext = path.extname(name);

// Extension starts with .ext
// So to remove . with slice we use this
ext = ext.slice(1);

for(let type in types) {

    let cTypeArr = types[type];

    for(let i=0; i<cTypeArr.length; i++) {

        if(ext == cTypeArr[i]) {
            return type;
        }

    }
}

// console.log(ext);
return "others";
}


// Help function
function helpfn(dirPath) {
    console.log(`
    List of all the commands:
        node main.js tree "directoryPath"
        node main.js organise "directoryPath"
        node main.js help   
    `);
}