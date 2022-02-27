const fs = require('fs');
const { inquirerMenu, inquirerLanguage, inquirerNewBook } = require('./helpers/inquirer');
data = {}

const getData = () => {
    try {
        data = JSON.parse(fs.readFileSync("./data/db.json"));
    }
    catch(exception) {
        data = {};
    }
}

const selectLanguage = async () => {
    let language = await inquirerLanguage();
    return language;
}

const menu = async () => {

    let opt = '';

    do {
        opt = await inquirerMenu(data.language);

        if(opt != '0') {
            await chooseOption(opt);
        }
    } while(opt !== '0');

    console.clear();
}

const chooseOption = async (opt) => {
    switch(opt) {
        case '1': 
            await addBook();
            break;
        case '2': break;
        case '3': break;
        case '4': break;
        case '5': break;
        case '6': break;
        case '7':
            await changeLanguage();
            break;
    }
}

const addBook = async () => {
    if(!data.books) {
        data.books = [];
    }

    let newBook;
    let repeated;

    do {
        newBook = await inquirerNewBook(data.language);

        repeated = data.books.some((b) => newBook && newBook == b.name);
        if(repeated) {
            if(data.language == "esp") {
                console.log("Este libro ya existe");
            }
            else if(data.language == "eng") {
                console.log("This book already exists");
            }
        }
    } while(repeated);

    if(newBook) {
        let id;
        if(isNaN(newBook.substring(0,1))) {
            id = data.books ? Math.max(data.books.map(b => b.id)) + 1 : 1;
        }
        else {
            let count = 1;
            while(!isNaN(newBook.substring(0, count))) {
                count++;
            }

            id = parseInt(newBook.substring(0, count));
            newBook = newBook.substring(count);

            while(newBook.substring(0, 1).match(/(\.|\s|-|,)/)) {
                newBook = newBook.substring(1);
            }
        }

        data.books.push({id: id, name: newBook, owned: false});
        data.books.sort((b1, b2) => b1.id != b2.id ? b1.id - b2.id : b1.name - b2.name);
        fs.writeFileSync("./data/db.json", JSON.stringify(data));
    }

    return newBook
}

const changeLanguage = async () => {
    let language = await selectLanguage();
    console.log(language + "---------");
    data.language = language;
    fs.writeFileSync("./data/db.json", JSON.stringify(data));
}

const main = async () => {
    getData();

    if(!data.language) {
        changeLanguage();
    }

    menu();
}

main();