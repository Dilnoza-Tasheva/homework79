import {Category, CategoryWithoutId, Item, Place} from "./types";
import {promises as fs} from 'fs';

const fileName = './db.json';
let data: {categories: Category[]; places: Place[]; items: Item[]} = {
    categories: [],
    places: [],
    items: [],
};

const fileDb = {
    async init() {
        try {
            const fileContent = await fs.readFile(fileName);
            data = await JSON.parse(fileContent.toString()) as typeof data;
        } catch (e) {
            console.error(e);
        }
    },
    async getCategories() {
        return data.categories.map(({id, name}) => ({id, name}));
    },
    async getCategoryById(id: string) {
        return data.categories.find(category => category.id === id) || null;
    },
    async addCategory(category: CategoryWithoutId) {
        const id = crypto.randomUUID();
        const newCategory = {id, ...category}
        data.categories.push(newCategory);
        await this.save();
        return newCategory;
    },
    async deleteCategory(id: string) {
        for (const item of data.items) {
            if (item.categoryId === id) {
                return false;
            }
        }
        const originalLenght = data.categories.length;
        data.categories = data.categories.filter(category => category.id !== id);
        await this.save();
        return originalLenght > data.categories.length;
    },

    async updateCategory(id: string, updates: CategoryWithoutId) {
        const categoryIndex = data.categories.findIndex(category => category.id === id);
        if (categoryIndex === -1) {
            return null;
        }
        const category = data.categories[categoryIndex];
        const updatedCategory = {
            id: category.id,
            name: updates.name,
            description: updates.description !== undefined ? updates.description : category.description,
        };
        data.categories[categoryIndex] = updatedCategory;
        await this.save();
        return updatedCategory;
    },
    async save() {
        await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    }

}

export default fileDb;