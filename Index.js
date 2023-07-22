const express = require('express');
const app = express();
const PORT = 5000;

const trainsData = require('./trainData.json');

function findTrain(trainNumber) {
    return trainsData.find((train) => train.trainNumber === trainNumber);
  }

  function dynamicTrain(trainNumber, updatedData) {
    const index = trainsData.findIndex((train) => train.trainNumber === trainNumber);
  
    if (index !== -1) {
      trainsData[index] = {
        ...trainsData[index],
        ...updatedData,
      };
    }
}


function getAdjustedDepartureTime(departureTime, delay) {
    const adjustedTime = new Date();
    adjustedTime.setHours(departureTime.Hours);
    adjustedTime.setMinutes(departureTime.Minutes + delay);
    adjustedTime.setSeconds(departureTime.Seconds);
    return adjustedTime;
  }
  
  //To Get Data
  app.get('/trains', (req, res) => {
    const currentTime = new Date();
    const twelveHourLater = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000);
  
    // 12 Hours
    const next12HourTrains = trainsData.filter((train) => {
      const departureTime = new Date();
      departureTime.setHours(train.departureTime.Hours);
      departureTime.setMinutes(train.departureTime.Minutes);
      departureTime.setSeconds(train.departureTime.Seconds);
      return departureTime > currentTime && departureTime <= twelveHourLater;
    });
  
    //30 minutes
    const filteredOutTrains = next12HourTrains.filter((train) => {
      const departureTime = getAdjustedDepartureTime(train.departureTime, train.delayedBy);
      const thirtyMinutes = new Date(currentTime.getTime() + 30 * 60 * 1000);
      return departureTime > thirtyMinutes;
    });
  
    // Final Departure Time
    filteredOutTrains.sort((a, b) => {
      // Sort in ascending price of price
      const priceComparison = a.price.sleeper - b.price.sleeper;
      if (priceComparison !== 0) {
        return priceComparison;
      }
  
      // Sort in descending order of seats availability
      const seatsComparison = b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
      if (seatsComparison !== 0) {
        return seatsComparison;
      }
  
      // Sort in descending of final departure
      const a_AdjustedTime = getAdjustedDepartureTime(a.departureTime, a.delayedBy);
      const b_AdjustedTime = getAdjustedDepartureTime(b.departureTime, b.delayedBy);
      return b_AdjustedTime - a_AdjustedTime;
    });
  
    // Response Generated
    const finaltrains = filteredOutTrains.map((train) => ({
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      departureTime: getAdjustedDepartureTime(train.departureTime, train.delayedBy),
      seatsAvailable: train.seatsAvailable,
      price: train.price,
      delay:train.delayedBy
    }));
  
    res.json(finaltrains);
  });
  

app.get('/trains/:id', (req, res) => {
    const id = req.params.id;
    const train = findTrain(id);
  
    if (!train) {
      return res.status(404).json({ error: 'Please ReEnter the Train Number' });
    }
  
    const adjustedDepartureTime = getAdjustedDepartureTime(train.departureTime, train.delayedBy);
  
    const trainDetails = {
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      departureTime: adjustedDepartureTime,
      seatsAvailable: train.seatsAvailable,
      price: train.price,
    };
  
    res.json(trainDetails);
  });

  app.patch('/trains/:trainNumber', (req, res) => {
    const trainNumber = req.params.trainNumber;
    const train = findTrain(trainNumber);
    if (!train) {
      return res.status(404).json({ error: 'Train not found' });
    }
    const { seatsAvailable, price } = req.body;
    dynamicTrain(trainNumber, { seatsAvailable, price });
    res.json({ message: 'Train data updated' });
  });

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });