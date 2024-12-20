import express from "express";
import fileDb from "../fileDb";
import {CategoryWithoutId} from "../types";

const categoriesRouter = express.Router();

categoriesRouter.get('/', async(req, res) => {
    const categories = await fileDb.getCategories();
    res.send(categories);
});

categoriesRouter.get('/:id', async (req, res) => {
    const category = await fileDb.getCategoryById(req.params.id);
    res.send(category);
});

categoriesRouter.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({error: "Name is required! Please fill in"});
        return;
    }
    const newCategory: CategoryWithoutId = {
        name: req.body.name,
        description: req.body.description,
    }
    const savedCategory = await fileDb.addCategory(newCategory);
    res.send(savedCategory);
});

categoriesRouter.delete('/:id', async (req, res) => {
    const deletedCategory = await fileDb.deleteCategory(req.params.id);
    if (!deletedCategory) {
       res.status(400).send({message: 'Category not found!'});
        return;
    }
    res.send({message: 'Category deleted'});
});

categoriesRouter.put('/:id', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({error: "Name is required! Please fill in"});
        return;
    }
    const updatedCategory = await fileDb.updateCategory(req.params.id, {name: req.body.name, description: req.body.description});
    res.send(updatedCategory);
})


export default categoriesRouter;