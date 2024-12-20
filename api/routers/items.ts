import express from "express";
import fileDb from "../fileDb";
import {imagesUpload} from "../multer";
import {Item, ItemWithoutId} from "../types";

const itemsRouter = express.Router();

itemsRouter.get('/', async (req, res) => {
    const items = await fileDb.getItems();
    res.send(items);
});

itemsRouter.get('/:id', async (req, res) => {
   const items = await fileDb.getItemById(req.params.id);
   res.send(items);
});

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
    if (!req.body.categoryId || !req.body.placeId || !req.body.name) {
        res.status(400).send({ error: "Category ID, Place ID, and Name are required!" });
        return;
    }
    const newItem: ItemWithoutId = {
        categoryId: req.body.categoryId,
        placeId: req.body.placeId,
        name: req.body.name,
        description: req.body.description,
        image: req.file ? 'images' + req.file.filename : null,
        createdAt: new Date().toISOString()
    }
    const savedItem = await fileDb.addItem(newItem);
    res.send(savedItem);
});

itemsRouter.delete('/:id', async (req, res) => {
    const deletedItem = await fileDb.deleteItem(req.params.id);
    if (!deletedItem) {
        res.status(400).send({message: 'Item not found!'});
        return;
    }
    res.send({message: 'Item deleted'});
});

itemsRouter.put('/:id', imagesUpload.single('image'), async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ error: "Name is required!" });
        return;
    }

    if (req.body.categoryId) {
        const categories = await fileDb.getCategories();
        let categoryExists = false;
        for (const category of categories) {
            if (category.id === req.body.categoryId) {
                categoryExists = true;
                break;
            }
        }
        if (!categoryExists) {
            res.status(400).send({ error: "Invalid Category ID!" });
            return;
        }
    }
    const updates: Item = {
        id: req.params.id,
        categoryId: req.body.categoryId || undefined,
        placeId: req.body.placeId || undefined,
        name: req.body.name,
        description: req.body.description || undefined,
        image: req.file ? 'images/' + req.file.filename : null,
        createdAt: req.body.createdAt,
    };

    const updatedItem = await fileDb.updateItem(req.params.id, updates);
    if (!updatedItem) {
        res.status(404).send({ error: "Item not found" });
        return;
    }
    res.send(updatedItem);
})

export default itemsRouter;