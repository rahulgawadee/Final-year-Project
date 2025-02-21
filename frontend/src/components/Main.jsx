import React from 'react';
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Terminal, Camera, Upload, Activity, Download, PlayCircle, StopCircle, Layers, FileCode, AlertTriangle } from 'lucide-react';

function Main() {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [defectPercentage, setDefectPercentage] = useState(0);
  const [detections, setDetections] = useState([]);
  const [materialType, setMaterialType] = useState("");
  const [dominantColor, setDominantColor] = useState("");
  const [threadCount, setThreadCount] = useState("");
  const [reportUrl, setReportUrl] = useState(null);
  const [ws, setWs] = useState(null);
  const [liveStream, setLiveStream] = useState(false);
  const [processingTime, setProcessingTime] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState({
    fps: 0,
    confidence: 0,
    memoryUsage: 0
  });

  const canvasRef = useRef(null);

  useEffect(() => {
    // Simulate system metrics updates
    const interval = setInterval(() => {
      setSystemMetrics({
        fps: Math.random() * (30 - 25) + 25,
        confidence: Math.random() * (0.98 - 0.95) + 0.95,
        memoryUsage: Math.random() * (80 - 60) + 60
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const startTime = performance.now();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/detect/", formData);
      const endTime = performance.now();
      setProcessingTime((endTime - startTime) / 1000);

      setImageSrc(`data:image/jpeg;base64,${response.data.image}`);
      setDefectPercentage(response.data.defect_percentage);
      setDetections(response.data.detections);
      setMaterialType(response.data.material || "Unknown");
      setDominantColor(response.data.color || "Not detected");
      setThreadCount(response.data.thread_count || "N/A");
      setReportUrl("http://127.0.0.1:8000/download_report");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const startLiveStream = () => {
    setLiveStream(true);
    const socket = new WebSocket("ws://127.0.0.1:8000/video_feed");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProcessedImage(`data:image/jpeg;base64,${data.image}`);
      setDefectPercentage(data.defect_percentage);
      setDetections(data.detections);
      setMaterialType(data.material || "Unknown");
      setDominantColor(data.color || "Not detected");
      setThreadCount(data.thread_count || "N/A");
    };

    setWs(socket);
  };

  const stopLiveStream = () => {
    if (ws) ws.close();
    setLiveStream(false);
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/download_report/", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Fabric_Analysis_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const defectData = detections.map((detection, index) => ({
    id: index + 1,
    type: detection.class,
    confidence: (detection.confidence * 100).toFixed(1),
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header with System Metrics */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold flex items-center">
          <Terminal className="mr-2" /> Fabric Analysis 
        </h2>
        <div className="flex gap-6">
          <div className="bg-gray-800 p-2 rounded-lg">
            <div className="text-xs text-gray-400">FPS</div>
            <div className="font-mono">{systemMetrics.fps.toFixed(1)}</div>
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <div className="text-xs text-gray-400">Confidence</div>
            <div className="font-mono">{(systemMetrics.confidence * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <div className="text-xs text-gray-400">Memory</div>
            <div className="font-mono">{systemMetrics.memoryUsage.toFixed(1)}MB</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Upload and Controls */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2" /> Input Source
            </h3>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="bg-gray-700 p-2 rounded-md w-full text-white mb-4 font-mono text-sm" 
            />
            <button 
              onClick={handleUpload} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md flex items-center justify-center"
            >
              <Activity className="mr-2" /> Process Image
            </button>
          </div>

          {/* System Information */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Layers className="mr-2" /> System Info
            </h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Processing Time:</span>
                <span>{processingTime ? `${processingTime.toFixed(3)}s` : 'N/A'}</span>
              </div>
              
            </div>
          </div>

          {/* Live Stream Controls */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Camera className="mr-2" /> Stream Controls
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={startLiveStream} 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
              >
                <PlayCircle className="mr-2" /> Start
              </button>
              {liveStream && (
                <button 
                  onClick={stopLiveStream} 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
                >
                  <StopCircle className="mr-2" /> Stop
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Image Display */}
        <div className="col-span-2 space-y-6">
          {/* Image Display */}
          {(imageSrc || processedImage) && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileCode className="mr-2" /> Analysis Output
              </h3>
              <img 
                src={imageSrc || processedImage} 
                alt="Processed" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          )}

          {/* Analysis Results */}
          <div className="grid grid-cols-2 gap-6">
            {/* Defect Percentage */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="mr-2" /> Defect Analysis
              </h3>
              <div className="w-full bg-gray-700 h-4 rounded-lg overflow-hidden mt-2">
                <div 
                  className="bg-red-500 h-4 transition-all duration-500" 
                  style={{ width: `${defectPercentage}%` }}
                />
              </div>
              <p className="text-center mt-2 font-mono">
                Defect Rate: {defectPercentage.toFixed(2)}%
              </p>
            </div>

            {/* Confidence Graph */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Detection Confidence</h3>
              {detections.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={defectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip />
                    <Bar dataKey="confidence" fill="#FF3B30" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center mt-4 font-mono">No defects detected</p>
              )}
            </div>
          </div>

          {/* Download Report */}
          {reportUrl && (
            <div className="flex justify-end">
              <button 
                onClick={handleDownloadReport} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
              >
                <Download className="mr-2" /> Export Technical Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;