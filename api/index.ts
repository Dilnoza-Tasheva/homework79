import express from "express";
import categoriesRouter from "./routers/categories";
import fileDb from "./fileDb";

import fs = require("fs");
import itemsRouter from "./routers/items";

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);

const run = async () => {
    if (fs.existsSync('./db.json')) {
        await fileDb.init();
    } else {
        const originalDb = {categories: [], places: [], items: []};
        fs.writeFileSync('./db.json', JSON.stringify(originalDb, null, 2));
    }
    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });
};

run().catch(err => console.log(err));