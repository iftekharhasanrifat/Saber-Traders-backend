import express from 'express';
import {Truck} from '../models/TruckModel.js';

const router = express.Router();

// post request to create a new truck

router.post('/', async (request,response) => {
    try{
        if (!request.body.truckNo) {
            return response.status(400).send({ 
                message: 'Please fill all required fields truckNo'
            });
        }
        const newTruck = {
            truckNo:request.body.truckNo,
        }
        const truck = await Truck.create(newTruck);
        return response.status(201).send(truck);
    }
    catch(error){
        console.log(error);
    }
});

// get request to get all trucks

router.get('/', async (request,response) => {
    try{
        const trucks = await Truck.find({});
        return response.status(200).send({
            count: trucks.length,
            data: trucks
        });
    }
    catch(error){
        console.log(error);
    }
});

// get request to get a truck by id

router.get('/:id', async (request,response) => {
    try{
        const truck = await Truck.findById(request.params.id);
        if(truck){
            return response.status(200).send(truck);
        }
        return response.status(404).send({message: 'data not found'});
    }
    catch(error){
        console.log(error);
    }
});

// delete request to delete a truck by id

router.delete('/:id', async (request,response) => {
    try{
        const truck = await Truck.findByIdAndDelete(request.params.id);
        if(truck){
            return response.status(200).send({message: 'data deleted'});
        }
        return response.status(404).send({message: 'data not found'});
    }
    catch(error){
        console.log(error);
    }
});

// put request to update a truck by id

router.put('/:id', async (request,response) => {
    try{
        if (!request.body.truckNo) {
            return response.status(400).send({ 
                message: 'Please fill all required fields truckNo'
            });
        }
        const truck = await Truck.findByIdAndUpdate(request.params.id, request.body);
        if(truck){
            return response.status(200).send({message:'data updated successfully'});
        }
        return response.status(404).send({message: 'data not found'});
    }
    catch(error){
        console.log(error);
    }
});

export default router;