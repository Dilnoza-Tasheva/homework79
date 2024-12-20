import {Category, CategoryWithoutId, Item, ItemWithoutId, Place, PlaceWithoutId} from "./types";
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
    async getItems() {
        return data.items.map(({id, name}) => ({id, name}));
    },
    async getItemById(id: string) {
        return data.items.find(item => item.id === id) || null;
    },
    async addItem(item: Omit<Item, 'id'>) {
        const id = crypto.randomUUID();
        const newItem = { id, ...item };
        data.items.push(newItem);
        await this.save();
        return newItem;
    },
    async deleteItem(id: string) {
        const initialLength = data.items.length;
        data.items = data.items.filter(item => item.id !== id);
        await this.save();
        return initialLength > data.items.length;
    },

    async updateItem(id: string, updates: ItemWithoutId) {
        const itemIndex = data.items.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            return null;
        }
        const item = data.items[itemIndex];
        const updatedItem = {
            id: item.id,
            name: updates.name,
            description: updates.description !== undefined ? updates.description : item.description,
        };
        data.categories[itemIndex] = updatedItem;
        await this.save();
        return updatedItem;
    },
    async getPlaces() {
        return data.places.map(({id, name}) => ({id, name}));
    },
    async getPlaceById(id: string) {
        return data.places.find(place => place.id === id) || null;
    },
    async addPlace(place: PlaceWithoutId) {
        const id = crypto.randomUUID();
        const newPlace = { id, ...place };
        data.places.push(newPlace);
        await this.save();
        return newPlace;
    },
    async deletePlace(id: string) {
        for (const item of data.items) {
            if (item.placeId === id) {
                return false;
            }
        }
        const initialLength = data.places.length;
        data.places = data.places.filter(place => place.id !== id);
        await this.save();
        return initialLength > data.places.length;
    },

    async updatePlace(id: string, updates: PlaceWithoutId) {
        const placeIndex = data.places.findIndex(place => place.id === id);
        if (placeIndex === -1) {
            return null;
        }

        const place = data.places[placeIndex];
        const updatedPlace = {
            id: place.id,
            name: updates.name || place.name,
            description: updates.description !== undefined ? updates.description : place.description,
        };
        data.places[placeIndex] = updatedPlace;
        await this.save();
        return updatedPlace;
    },
    async save() {
        await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    }

}

export default fileDb;