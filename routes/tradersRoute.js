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
            transportCostDescription: request.body.transportCostDescription,
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

        const result = await Trader.findByIdAndUpdate(id, request.body,{ new: true });
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

// router.get('/remainingTaka/:truckNo/:month/:year', async (request, response) => {
//     try {
//         const { truckNo, month, year } = request.params;
//         const decodedTruckNo = decodeURIComponent(truckNo);

//         const traders = await Trader.find({ truckNo: decodedTruckNo });
        
        
//         let sum = 0;
//         let tranSum = 0;
//         const filteredData = traders.filter(trader => {
//             const [traderYear, traderMonth, day] = trader.date.split('-');
//             if (traderMonth === month && traderYear === year) {
//                 tranSum += trader.transportCost;
//                 sum += trader.remainingTaka;
//                 return true;
//             }
//             return false;
//         });
        
//         return response.status(200).send({
//             total: sum,
//             transportCost: tranSum,
//             data: filteredData
            
            
//         });
//     } catch (error) {
//         console.log(error);
//         return response.status(500).send({ error: 'Internal Server Error' });
//     }
// });


// route to get sum of remaining taka by the end of the month

// router.get('/remainingTaka/:month/:year', async (request,response) => {
//     try{
//         const {month,year} = request.params;
//         const traders = await Trader.find({});
//         let sum = 0;
//         let tranSum = 0;
//         const filteredData = traders.filter(trader => {
//             const [traderYear, traderMonth, day] = trader.date.split('-');
//             if (traderMonth === month && traderYear === year) {
//                 tranSum += trader.transportCost;
//                 sum += trader.remainingTaka;
//                 return true;
//             }
//             return false;
//         });
//         return response.status(200).send({
//             total: sum,
//             transportCost: tranSum,
//             data: filteredData
//         });
//     }
//     catch(error){
//         console.log(error);
//     }
// })


router.get('/remainingTaka/:truckNo/:startDate/:endDate', async (req, res) => {
    try {
        const { truckNo, startDate, endDate } = req.params;
        
        // Parse startDate and endDate from yyyy-mm-dd to Date objects
        const [sYear, sMonth, sDay] = startDate.split('-');
        const start = new Date(sYear, sMonth - 1, sDay);
        
        const [eYear, eMonth, eDay] = endDate.split('-');
        const end = new Date(eYear, eMonth - 1, eDay);
        
        // Find traders with the given truck number.
        const traders = await Trader.find({ truckNo: truckNo });
        
        let sum = 0;
        let tranSum = 0;
        let fuelSum = 0;
        let takaSum = 0;
        
        // Filter traders whose date falls between start and end (inclusive)
        const filteredData = traders.filter(trader => {
            // Assuming trader.date is in "yyyy-mm-dd" format
            const [year, month, day] = trader.date.split('-');
            const traderDate = new Date(year, month - 1, day);
            
            if (traderDate >= start && traderDate <= end) {
                sum += trader.remainingTaka;
                tranSum += trader.transportCost;
                fuelSum += trader.fuelExpense;
                takaSum += trader.taka;
                return true;
            }
            return false;
        });
        
        return res.status(200).send({
            total: sum,
            transportCost: tranSum,
            fuelCost : fuelSum,
            totalTaka : takaSum,
            data: filteredData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
});



// route to get sum of remaining taka by the end of the month
router.get('/remainingTaka/:startDate/:endDate', async (req, res) => {
    try {
        const { startDate, endDate } = req.params;
        
        // Parse the start and end dates from dd/mm/yyyy to Date objects
        const [sYear,sMonth , sDay] = startDate.split('-');
        const start = new Date(sYear, sMonth - 1, sDay);
        
        const [eYear, eMonth, eDay] = endDate.split('-');
        const end = new Date(eYear, eMonth - 1, eDay);
        
        // First, get all traders .
        const traders = await Trader.find({ });
        let sum = 0;
        let tranSum = 0;
        let fuelSum = 0;
        let takaSum = 0;
        // Filter traders whose date falls between the start and end dates (inclusive)
        const filteredData = traders.filter(trader => {
            const [year, month, day] = trader.date.split('-');
            const traderDate = new Date(year, month - 1, day);
            if (traderDate >= start && traderDate <= end) {
                sum += trader.remainingTaka;
                tranSum += trader.transportCost;
                fuelSum += trader.fuelExpense;
                takaSum += trader.taka;
                return true;
            }
            return false;
        });
        
        return res.status(200).send({
            total: sum,
            transportCost: tranSum,
            fuelCost : fuelSum,
            totalTaka : takaSum,
            data: filteredData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
});


export default router;