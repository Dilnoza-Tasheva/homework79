import express from "express";
import fileDb from "../fileDb";
import { PlaceWithoutId } from "../types";

const placesRouter = express.Router();

placesRouter.get('/', async (req, res) => {
    const places = await fileDb.getPlaces();
    res.send(places);
});

placesRouter.get('/:id', async (req, res) => {
    const place = await fileDb.getPlaceById(req.params.id);
    res.send(place);
});

placesRouter.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ error: "Name is required! Please fill in" });
        return;
    }
    const newPlace: PlaceWithoutId = {
        name: req.body.name,
        description: req.body.description,
    };
    const savedPlace = await fileDb.addPlace(newPlace);
    res.send(savedPlace);
});

placesRouter.delete('/:id', async (req, res) => {
    const deletedPlace = await fileDb.deletePlace(req.params.id);
    if (!deletedPlace) {
        res.status(400).send({ message: "Place not found or cannot be deleted because it is associated with items!" });
        return;
    }
    res.send({ message: "Place deleted" });
});

placesRouter.put('/:id', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ error: "Name is required! Please fill in" });
        return;
    }
    const updatedPlace = await fileDb.updatePlace(req.params.id, {
        name: req.body.name,
        description: req.body.description,
    });
    res.send(updatedPlace);
});

export default placesRouter;
