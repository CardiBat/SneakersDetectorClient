import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './styles.css';
import './tailwind.css';

function App() {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sneakerData, setSneakerData] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        console.log(file);
        setFile(file);
        // Reset stato in caso di nuovi upload
        setSneakerData(null);
        setError('');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const sendFile = () => {
        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        axios.post('http://192.168.1.15:5000/predictor', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            setLoading(false);
            if(response.data.success === true) {
                setSneakerData(response.data.data);
            } else {
                setError(response.data.message);
            }
        })
        .catch(error => {
            setLoading(false);
            setError("Si è verificato un errore durante l'invio del file");
        });
    };

    return (
        <div className="h-screen overflow-hidden">
            <div className="w-screen bg-gray-100 flex flex-col justify-center items-center pt-8">
                <h1 className="text-4xl md:text-6xl font-bold text-center text-blue-950">Sneakers Detector</h1>
            </div>
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 pb-12">
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out" style={{ transform: file ? 'scale(1.05)' : 'scale(1)' }}>
                    <div className="bg-blue-950 p-5">
                        <h2 className="text-white text-2xl font-bold text-center">Use this form to catch your sneakers!</h2>
                    </div>
                    <div className="p-8">
                        <div {...getRootProps()} className="flex flex-col items-center justify-center bg-gray-50 p-8 rounded-lg shadow-inner border-dashed border-2 border-gray-300 cursor-pointer">
                            <input {...getInputProps()} />
                            {isDragActive ?
                                <p className="text-center">Drop here now!</p> :
                                <p className="text-center">Drag a file here or click to select one...</p>
                            }
                        </div>
                        {loading && <p className="text-center mt-4">Loading...</p>}
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        {file && !loading && !error && (
                            <>
                                <p className="text-green-500 text-center mt-4">Loaded file: {file.name}</p>
                                <div className="flex justify-center">
                                    <button onClick={sendFile} className="mt-4 bg-blue-950 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Send now
                                    </button>
                                </div>
                            </>
                        )}
                        {sneakerData && (
                            <div className="mt-6 bg-gray-200 p-4 rounded-lg">
                                <ul className="list-disc pl-5">
                                    <li><strong>SKU:</strong> {sneakerData.SKU}</li>
                                    <li><strong>Name:</strong> {sneakerData.Name}</li>
                                    <li><strong>Model:</strong> {sneakerData.Model}</li>
                                    <li><strong>Brand:</strong> {sneakerData.Brand}</li>
                                    <li><strong>Release Date:</strong> {sneakerData['Release Date']}</li>
                                    <li><strong>Retail Price:</strong> {sneakerData['Retail Price']}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
