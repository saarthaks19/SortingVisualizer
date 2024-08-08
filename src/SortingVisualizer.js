import React, { useState, useEffect, useRef } from 'react';
import './SortingVisualizer.css';

const SortingVisualizer = () => {
    const [array, setArray] = useState([]);
    const [speed, setSpeed] = useState(800); // Default speed
    const [arraySize, setArraySize] = useState(50);
    const [isSorting, setIsSorting] = useState(false);
    const sortingRef = useRef(null);

    useEffect(() => {
        resetArray();
    }, [arraySize]);

    const resetArray = () => {
        if (isSorting) return;
        const newArray = [];
        for (let i = 0; i < arraySize; i++) {
            newArray.push(randomIntFromInterval(5, 500));
        }
        setArray(newArray);
    };

    const randomIntFromInterval = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const bubbleSort = async () => {
        if (isSorting) return;
        setIsSorting(true);
        sortingRef.current = true;

        const arrayCopy = [...array];
        for (let i = 0; i < arrayCopy.length - 1; i++) {
            if (!sortingRef.current) break;
            for (let j = 0; j < arrayCopy.length - i - 1; j++) {
                if (!sortingRef.current) break;
                if (arrayCopy[j] > arrayCopy[j + 1]) {
                    let temp = arrayCopy[j];
                    arrayCopy[j] = arrayCopy[j + 1];
                    arrayCopy[j + 1] = temp;
                    setArray([...arrayCopy]);
                    await new Promise((resolve) => setTimeout(resolve, getDelay()));
                }
            }
        }
        setIsSorting(false);
    };

    const insertionSort = async () => {
        if (isSorting) return;
        setIsSorting(true);
        sortingRef.current = true;

        const arrayCopy = [...array];
        for (let i = 1; i < arrayCopy.length; i++) {
            if (!sortingRef.current) break;
            let key = arrayCopy[i];
            let j = i - 1;
            while (j >= 0 && arrayCopy[j] > key) {
                if (!sortingRef.current) break;
                arrayCopy[j + 1] = arrayCopy[j];
                j = j - 1;
                setArray([...arrayCopy]);
                await new Promise((resolve) => setTimeout(resolve, getDelay()));
            }
            arrayCopy[j + 1] = key;
            setArray([...arrayCopy]);
        }
        setIsSorting(false);
    };

    const quickSort = async (array, left, right) => {
        if (left >= right) return;
        if (!sortingRef.current) return;

        const pivotIndex = await partition(array, left, right);
        await quickSort(array, left, pivotIndex - 1);
        await quickSort(array, pivotIndex + 1, right);

        setArray([...array]);
    };

    const partition = async (array, left, right) => {
        const pivot = array[right];
        let i = left - 1;

        for (let j = left; j < right; j++) {
            if (array[j] <= pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                setArray([...array]);
                await new Promise((resolve) => setTimeout(resolve, getDelay()));
            }
        }
        [array[i + 1], array[right]] = [array[right], array[i + 1]];
        setArray([...array]);
        await new Promise((resolve) => setTimeout(resolve, getDelay()));
        return i + 1;
    };

    const mergeSort = async (array, left, right) => {
        if (left >= right) return;
        if (!sortingRef.current) return;

        const mid = Math.floor((left + right) / 2);
        await mergeSort(array, left, mid);
        await mergeSort(array, mid + 1, right);
        await merge(array, left, mid, right);

        setArray([...array]);
    };

    const merge = async (array, left, mid, right) => {
        const tempArray = [];
        let i = left, j = mid + 1;

        while (i <= mid && j <= right) {
            if (array[i] <= array[j]) {
                tempArray.push(array[i]);
                i++;
            } else {
                tempArray.push(array[j]);
                j++;
            }
        }

        while (i <= mid) tempArray.push(array[i++]);
        while (j <= right) tempArray.push(array[j++]);

        for (let k = 0; k < tempArray.length; k++) {
            array[left + k] = tempArray[k];
            setArray([...array]);
            await new Promise((resolve) => setTimeout(resolve, getDelay()));
        }
    };

    const getDelay = () => {
        // Speed options are 0, 200, 400, 600, 800, 1000
        // Higher slider value means shorter delay (faster sorting)
        return 1000 - speed;
    };

    const handleSpeedChange = (event) => {
        setSpeed(Number(event.target.value));
    };

    const handleArraySizeChange = (event) => {
        setArraySize(Number(event.target.value));
    };

    const stopSorting = () => {
        sortingRef.current = false;
        setIsSorting(false);
    };

    const handleSortClick = (sortAlgorithm) => async () => {
        if (isSorting) return;
        setIsSorting(true);
        sortingRef.current = true;

        const arrayCopy = [...array];
        if (sortAlgorithm === 'quick') {
            await quickSort(arrayCopy, 0, arrayCopy.length - 1);
        } else if (sortAlgorithm === 'merge') {
            await mergeSort(arrayCopy, 0, arrayCopy.length - 1);
        } else if (sortAlgorithm === 'bubble') {
            await bubbleSort();
        } else if (sortAlgorithm === 'insertion') {
            await insertionSort();
        }

        setIsSorting(false);
    };

    return (
        <div>
            <div className="controls">
                <div className="control-buttons">
                    <h1 class="head">Sorting Visualizer</h1>
                    <button onClick={resetArray} disabled={isSorting}>Generate New Array</button>
                    <button onClick={handleSortClick('bubble')} disabled={isSorting}>Bubble Sort</button>
                    <button onClick={handleSortClick('insertion')} disabled={isSorting}>Insertion Sort</button>
                    <button onClick={handleSortClick('quick')} disabled={isSorting}>Quick Sort</button>
                    <button onClick={handleSortClick('merge')} disabled={isSorting}>Merge Sort</button>
                    <button onClick={stopSorting} disabled={!isSorting}>Stop Sorting</button>
                </div>
                <div className="sliders">
                    <label>
                        Speed:
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="200"
                            value={speed}
                            onChange={handleSpeedChange}
                            disabled={isSorting}
                        />
                        <span>{speed}</span>
                    </label>
                    <label>
                        Array Size:
                        <input
                            type="range"
                            min="10"
                            max="200"
                            value={arraySize}
                            onChange={handleArraySizeChange}
                            disabled={isSorting}
                        />
                        <span>{arraySize}</span>
                    </label>
                </div>
            </div>

            <div className="array-container">
                {array.map((value, idx) => (
                    <div
                        className="array-bar"
                        key={idx}
                        style={{
                            height: `${value}px`,
                            width: `${Math.max(10, (window.innerWidth * 0.6) / arraySize - 2)}px`, // Adjust width based on screen width and array size
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default SortingVisualizer;
