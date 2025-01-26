import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

interface PredictorProps {
  data: ({ timestamp: string} & { [key:string] : number })[];
  metric: string;
}

const Predictor: React.FC<PredictorProps> = ({ data, metric }) => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [days, setDays] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const normalize = (values: number[]) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (min === max) {
      return values.map(() => 0.5);
    }
    return values.map(v => (v - min) / (max - min));
  };

  const denormalize = (value: number, min: number, max: number) => value * (max - min) + min;

  const prepareData = () => {
    const days = data.map((_, index) => index);
    const volumes = data.map(item => item[metric]);

    const normalizedVolumes = normalize(volumes);

    const X = tf.tensor2d(days, [days.length, 1]);
    const y = tf.tensor2d(normalizedVolumes, [volumes.length, 1]);

    // console.log('Normalized X:', X.arraySync());
    // console.log('Normalized y:', y.arraySync());

    return { X, y, minVolume: Math.min(...volumes), maxVolume: Math.max(...volumes) };
  };

  const trainModel = async (X: tf.Tensor2D, y: tf.Tensor2D) => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [1] }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: tf.train.sgd(0.01), loss: 'meanSquaredError' });

    await model.fit(X, y, {
      epochs: 500,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
        //   console.log(`Epoch ${epoch}: Loss = ${logs?.loss}`);
        },
      },
    });

    return model;
  };

  const predictVolume = async (model: tf.Sequential, days: number, minVolume: number, maxVolume: number) => {
    const input = tf.tensor2d([[days]], [1, 1]);
    const prediction = model.predict(input) as tf.Tensor;
    // console.log('Prediction Tensor:', prediction);
    // console.log('Prediction Values:', prediction.arraySync());

    const predictedValue = prediction.dataSync()[0];
    prediction.dispose(); // Dispose of the tensor

    const denormalizedPrediction = denormalize(predictedValue, minVolume, maxVolume);
    setPrediction(denormalizedPrediction);
  };

  const handlePredict = async () => {
    setIsLoading(true); // Show loading state
    try {
      const { X, y, minVolume, maxVolume } = prepareData();
      const model = await trainModel(X, y);
      await predictVolume(model, days, minVolume, maxVolume);
    } catch (error) {
      console.error('Error making prediction:', error);
      setPrediction(null); // Reset prediction if there's an error
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  useEffect(() => {
    const fetchDataAndPredict = async () => {
      setIsLoading(true); // Show loading state
      try {
        const { X, y, minVolume, maxVolume } = prepareData();
        const model = await trainModel(X, y);
        await predictVolume(model, days, minVolume, maxVolume);
      } catch (error) {
        console.error('Error making prediction:', error);
        setPrediction(null); // Reset prediction if there's an error
      } finally {
        setIsLoading(false); // Hide loading state
      }
    };

    fetchDataAndPredict();
  }, [data]);

  return (
    <>
    <div className='text-3xl font-semi-bold'>NFT Market Trend Prediction</div>
    <div className='border-2 flex flex-col items-center border-zinc-600 px-3 py-[30px] rounded w-[80%]'>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="number"
          value={days}
          onChange={(e) => {
            const value = Number(e.target.value);
            setDays(value < 1 ? 1 : value);}}
          className="border p-2 rounded"
          min="1"
        />
        <button
          onClick={handlePredict}
          className="w-[130px] border-2 text-[#8884d8] px-4 py-2 rounded"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Predicting...' : 'Predict'}
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-4 text-xl font-bold">
        <span>Loading prediction</span>
        <span className="dot-animation"></span>
      </div>
      
      ) : prediction !== null ? (
        <h2 className="text-xl font-bold mt-2">
          Predicted {metric} in {days} Days: <span className='text-[#8884d8]'>{prediction.toFixed(prediction < 1 ? 8 : 2)}</span>
        </h2>
      ) : (
        <p>Unable to make a prediction.</p>
      )}
    </div>
    </>
  );
};

export default Predictor;