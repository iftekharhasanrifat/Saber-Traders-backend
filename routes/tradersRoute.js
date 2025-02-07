import express from 'express';
import { Trader } from '../models/TraderModel.js';

const router = express.Router();

// post request to create a new trader

router.post('/', async (request,response) => {
    try{
        if (!request.body.truckNo || !request.body.date || !request.body.description || !request.body.taka || !request.body.driverSalary || !request.body.remainingTaka ) {
            return response.status(400).send({ 
                message: 'Please fill all required fields truckNo, date, description, taka, driverSalary, remainingTaka'
            });
        }
        const newTrader = {
            truckNo:request.body.truckNo,
            date:request.body.date,
            description:request.body.description,
            quantityOfCementBagRod:request.body.quantityOfCementBagRod,
            priceRate:request.body.priceRate,
            taka:request.body.taka,
            driverSalary:request.body.driverSalary,
            fuelExpense:request.body.fuelExpense,
            labourGratuity:request.body.labourGratuity,
            toll:request.body.toll,
            transportCost:request.body.transportCost,
            remainingTaka:request.body.remainingTaka
        }
        const trader = await Trader.create(newTrader);
        return response.status(201).send(trader);
    }
    catch(error){
        console.log(error);
    }
})

// get request to get all traders

router.get('/', async (request,response) => {
    try{
        const traders = await Trader.find({});
        return response.status(200).send({
            count: traders.length,
            data: traders
        });
    }
    catch(error){
        console.log(error);
    }
})

// get request to get a trader by id

router.get('/:id', async (request,response) => {
    try{
        const trader = await Trader.findById(request.params.id);
        if(trader){
            return response.status(200).send(trader);
        }
        return response.status(404).send({message: 'data not found'});
    }
    catch(error){
        console.log(error);
    }
})

// put request to update a trader by id

router.put('/:id', async (request,response) => {
    try{
        if (!request.body.truckNo || !request.body.date || !request.body.description || !request.body.taka || !request.body.driverSalary || !request.body.remainingTaka ) {
            return response.status(400).send({ 
                message: 'Please fill all required fields truckNo, date, description, taka, driverSalary, remainingTaka'
            });
        }
        const {id} = request.params;

        const result = await Trader.findByIdAndUpdate(id, request.body);
        if (!result) {
            return response.status(404).send({message:'data not found'});
        }
        return response.status(200).send({message:'data updated successfully'});
    }
    catch(error){
        console.log(error);
    }
})

// delete request to delete a trader by id

router.delete('/:id', async (request,response) => {
    try{
        const {id} = request.params;
        const result = await Trader.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).send({message:'data not found'});
        }
        return response.status(200).send({message:'data deleted successfully'});
    }
    catch(error){
        console.log(error);
    }
})

// Route to get sum of remainingTaka by truckNo and specific month

// router.get('/remainingTaka/:truckNo/:month/:year', async (request,response) => {
//     try{
//         const {truckNo, month, year} = request.params;
//         const traders = await Trader.find({truckNo:truckNo});
//         console.log(traders);
//         let sum = 0;
//         traders.forEach(trader => {
//             if(trader.date.split('/')[1] === month && trader.date.split('/')[2] === year){
//                 sum += trader.remainingTaka;
//             }
//         });
//         return response.status(200).send({
//             truckNo: truckNo,
//             total: sum
//         });
//     }
//     catch(error){
//         console.log(error);
//     }
// })

router.get('/remainingTaka/:truckNo/:month/:year', async (request, response) => {
    try {
        const { truckNo, month, year } = request.params;
        const traders = await Trader.find({ truckNo: truckNo });

        let sum = 0;
        const filteredData = traders.filter(trader => {
            const [day, traderMonth, traderYear] = trader.date.split('/');
            if (traderMonth === month && traderYear === year) {
                sum += trader.remainingTaka;
                return true;
            }
            return false;
        });

        return response.status(200).send({
            total: sum,
            data: filteredData
            
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send({ error: 'Internal Server Error' });
    }
});


// route to get sum of remaining taka by the end of the month

router.get('/remainingTaka/:month/:year', async (request,response) => {
    try{
        const {month,year} = request.params;
        const traders = await Trader.find({});
        let sum = 0;
        const filteredData = traders.filter(trader => {
            const [day, traderMonth, traderYear] = trader.date.split('/');
            if (traderMonth === month && traderYear === year) {
                sum += trader.remainingTaka;
                return true;
            }
            return false;
        });
        return response.status(200).send({
            total: sum,
            data: filteredData
        });
    }
    catch(error){
        console.log(error);
    }
})





export default router;