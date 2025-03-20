import React from 'react';
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { Terminal, Camera, Upload, Activity, Download, PlayCircle, StopCircle, FileCode, AlertTriangle, Shield, Zap, Server, Database, Cpu, Gauge, Settings, ChevronDown } from 'lucide-react';

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
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({
    fps: 0,
    confidence: 0,
    memoryUsage: 0,
    cpuLoad: 0,
    gpuUtilization: 0,
    networkLatency: 0
  });

  const canvasRef = useRef(null);

  useEffect(() => {
    // Simulate system metrics updates
    const interval = setInterval(() => {
      const newMetrics = {
        fps: Math.random() * (30 - 25) + 25,
        confidence: Math.random() * (0.98 - 0.95) + 0.95,
        memoryUsage: Math.random() * (80 - 60) + 60,
        cpuLoad: Math.random() * (70 - 40) + 40,
        gpuUtilization: Math.random() * (90 - 70) + 70,
        networkLatency: Math.random() * (40 - 5) + 5
      };
      
      setSystemMetrics(newMetrics);
      
      // Add to session history for graphing
      setSessionHistory(prev => {
        const newHistory = [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          fps: newMetrics.fps.toFixed(1),
          confidence: (newMetrics.confidence * 100).toFixed(1),
          defectRate: defectPercentage
        }];
        
        // Keep last 20 readings
        if (newHistory.length > 20) return newHistory.slice(newHistory.length - 20);
        return newHistory;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [defectPercentage]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    // Show filename in UI
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.setAttribute('data-file', event.target.files[0].name);
    }
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
    handleDownloadReport();
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

  const getSeverityColor = (percentage) => {
    if (percentage > 15) return 'bg-red-500';
    if (percentage > 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-mono">
      {/* Header with Enhanced System Metrics */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4 shadow-lg border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center">
            <Terminal className="mr-2 text-blue-400" /> 
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Fabric Analysis System</h2>
              <p className="text-xs text-gray-400">v2.5.3 | ML Engine: YOLOv8-X | TensorRT Optimized</p>
            </div>
          </div>
          
          {/* System Metrics */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full md:w-auto">
            <div className="bg-gray-900 p-2 rounded-lg flex flex-col items-center border border-gray-700">
              <div className="text-xs text-blue-400 mb-1 flex items-center"><Zap size={10} className="mr-1" /> FPS</div>
              <div className="font-mono text-sm">{systemMetrics.fps.toFixed(1)}</div>
            </div>
            <div className="bg-gray-900 p-2 rounded-lg flex flex-col items-center border border-gray-700">
              <div className="text-xs text-green-400 mb-1 flex items-center"><Gauge size={10} className="mr-1" /> CONF</div>
              <div className="font-mono text-sm">{(systemMetrics.confidence * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-gray-900 p-2 rounded-lg flex flex-col items-center border border-gray-700">
              <div className="text-xs text-purple-400 mb-1 flex items-center"><Cpu size={10} className="mr-1" /> CPU</div>
              <div className="font-mono text-sm">{systemMetrics.cpuLoad.toFixed(1)}%</div>
            </div>
            <div className="bg-gray-900 p-2 rounded-lg flex flex-col items-center border border-gray-700">
              <div className="text-xs text-amber-400 mb-1 flex items-center"><Server size={10} className="mr-1" /> GPU</div>
              <div className="font-mono text-sm">{systemMetrics.gpuUtilization.toFixed(1)}%</div>
            </div>
            <div className="bg-gray-900 p-2 rounded-lg flex flex-col items-center border border-gray-700">
              <div className="text-xs text-red-400 mb-1 flex items-center"><Database size={10} className="mr-1" /> MEM</div>
              <div className="font-mono text-sm">{systemMetrics.memoryUsage.toFixed(1)}%</div>
            </div>
            <div className="bg-gray-900 p-2 rounded-lg flex flex-col items-center border border-gray-700">
              <div className="text-xs text-cyan-400 mb-1 flex items-center"><Activity size={10} className="mr-1" /> PROC</div>
              <div className="font-mono text-sm">{processingTime ? `${processingTime.toFixed(3)}s` : 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column - Controls */}
        <div className="space-y-4">
          {/* Input Source Section */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-blue-400">
              <Upload className="mr-2" /> Input Configuration
            </h3>
            
            <div className="relative mt-2 rounded-md">
              <input 
                id="file-input"
                type="file" 
                onChange={handleFileChange} 
                className="sr-only"
              />
              <label 
                htmlFor="file-input" 
                className="bg-gray-700 border border-gray-600 p-2 rounded-md w-full text-gray-200 mb-3 font-mono text-sm flex items-center justify-between cursor-pointer hover:bg-gray-600 transition-colors"
                data-file="No file selected"
              >
                <span className="truncate block">
                  {file ? file.name : "Select fabric sample image"}
                </span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">Browse</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-xs text-gray-400">Material</div>
                <div className="text-sm truncate">{materialType || "Unknown"}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded text-center">
                <div className="text-xs text-gray-400">Thread Count</div>
                <div className="text-sm truncate">{threadCount || "N/A"}</div>
              </div>
            </div>
            
            <button 
              onClick={handleUpload} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center font-semibold transition-colors"
            >
              <Activity className="mr-2" /> Analyze Image
            </button>
            
            {/* Advanced Options */}
            <div className="mt-3 border-t border-gray-700 pt-3">
              <button 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="text-sm text-gray-400 flex items-center justify-between w-full"
              >
                <span className="flex items-center">
                  <Settings size={12} className="mr-1" /> Advanced Options
                </span>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {showAdvancedOptions && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <input type="checkbox" id="high-precision" className="mr-1" />
                    <label htmlFor="high-precision">High Precision</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="edge-detection" className="mr-1" />
                    <label htmlFor="edge-detection">Edge Detection</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="noise-reduction" className="mr-1" />
                    <label htmlFor="noise-reduction">Noise Reduction</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="export-metadata" className="mr-1" checked />
                    <label htmlFor="export-metadata">Export Metadata</label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Stream Controls */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-green-400">
              <Camera className="mr-2" /> Real-time Monitoring
            </h3>
            
            {/* Connection Info */}
            <div className="bg-gray-700 p-2 rounded mb-3">
              <div className="text-xs text-gray-400 mb-1">Connection Status</div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{liveStream ? "Connected" : "Disconnected"}</span>
                <span className={`w-3 h-3 rounded-full ${liveStream ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={startLiveStream} 
                className={`flex-1 ${liveStream ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white py-2 rounded-md flex items-center justify-center font-medium transition-colors`}
                disabled={liveStream}
              >
                <PlayCircle className="mr-2" /> Start Stream
              </button>
              <button 
                onClick={stopLiveStream} 
                className={`flex-1 ${!liveStream ? 'bg-gray-700 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white py-2 rounded-md flex items-center justify-center font-medium transition-colors`}
                disabled={!liveStream}
              >
                <StopCircle className="mr-2" /> Stop & Save
              </button>
            </div>
            
            {/* Stream Metrics */}
            {liveStream && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-gray-700 p-2 rounded text-center">
                  <div className="text-xs text-gray-400">Latency</div>
                  <div className="text-sm">{systemMetrics.networkLatency.toFixed(1)} ms</div>
                </div>
                <div className="bg-gray-700 p-2 rounded text-center">
                  <div className="text-xs text-gray-400">Buffer</div>
                  <div className="text-sm">98%</div>
                </div>
              </div>
            )}
          </div>

          {/* Performance Monitor */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-purple-400">
              <Cpu className="mr-2" /> Performance Monitor
            </h3>
            {sessionHistory.length > 5 && (
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionHistory.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="timestamp" tick={false} />
                    <YAxis domain={[0, 100]} fontSize={10} width={25} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    <Line type="monotone" dataKey="fps" stroke="#3B82F6" dot={false} />
                    <Line type="monotone" dataKey="confidence" stroke="#10B981" dot={false} />
                    <Line type="monotone" dataKey="defectRate" stroke="#EF4444" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="flex justify-between mt-2 text-xs">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 mr-1"></span>FPS
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 mr-1"></span>Confidence
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-500 mr-1"></span>Defect Rate
              </div>
            </div>
          </div>
        </div>

        {/* Middle Columns - Image Analysis */}
        <div className="lg:col-span-2">
          {/* Image Analysis Display */}
          {(imageSrc || processedImage) ? (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 h-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold flex items-center text-amber-400">
                  <FileCode className="mr-2" /> Analysis Output
                </h3>
                <div className="bg-gray-900 px-2 py-1 rounded text-xs border border-gray-700">
                  {new Date().toLocaleString()}
                </div>
              </div>
              <div className="border-2 border-gray-700 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <img 
                  src={imageSrc || processedImage} 
                  alt="Processed" 
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
              
              {/* Detection Info */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <div className="text-xs text-gray-400">Material Type</div>
                  <div className="text-sm font-semibold">{materialType}</div>
                </div>
                <div className="bg-gray-700 p-2 rounded-lg">
                  <div className="text-xs text-gray-400">Dominant Color</div>
                  <div className="text-sm font-semibold">{dominantColor}</div>
                </div>
                <div className="bg-gray-700 p-2 rounded-lg">
                  <div className="text-xs text-gray-400">Thread Count</div>
                  <div className="text-sm font-semibold">{threadCount}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col items-center justify-center text-gray-500">
              <Camera size={64} className="mb-3 opacity-30" />
              <p className="text-center">No image data available</p>
              <p className="text-center text-xs mt-2">Upload an image or start live stream to analyze fabric</p>
            </div>
          )}
        </div>

        {/* Results Column */}
        {(imageSrc || processedImage) && (
          <div className="lg:col-span-1 space-y-4">
            {/* Defect Percentage */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold flex items-center text-red-400">
                  <AlertTriangle className="mr-2" /> Defect Analysis
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-mono 
                  ${defectPercentage > 10 ? 'bg-red-900/70 text-red-200' : 'bg-green-900/70 text-green-200'}`}>
                  {defectPercentage > 10 ? 'FAIL' : 'PASS'}
                </span>
              </div>
              
              {/* Progress bar with label */}
              <div className="relative w-full bg-gray-700 h-6 rounded-lg overflow-hidden mt-2">
                <div 
                  className={`h-6 transition-all duration-500 ${getSeverityColor(defectPercentage)}`}
                  style={{ width: `${Math.max(defectPercentage, 2)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  Defect Rate: {defectPercentage.toFixed(2)}%
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">QC Metrics:</div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-xs text-gray-400">Issues Detected</div>
                    <div className="font-mono text-lg">{detections.length}</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-xs text-gray-400">Severity Level</div>
                    <div className={`font-mono text-lg ${
                      defectPercentage > 15 ? 'text-red-400' : 
                      defectPercentage > 5 ? 'text-yellow-400' : 'text-green-400'
                    }`}>{
                      defectPercentage > 15 ? 'HIGH' : 
                      defectPercentage > 5 ? 'MED' : 'LOW'
                    }</div>
                  </div>
                </div>
              </div>
              
              {/* Decision Threshold */}
              <div className="mt-4">
                <div className="text-xs text-gray-400 mb-1">Decision Threshold: 10.00%</div>
                <div className="w-full bg-gray-700 h-1 rounded-full relative">
                  <div className="absolute h-3 w-1 bg-white -top-1" style={{ left: '10%' }}></div>
                </div>
              </div>
            </div>

            {/* Detection Confidence */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-blue-400">
                Detection Confidence
              </h3>
              {detections.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={defectData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="type" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />
                    <Bar dataKey="confidence" name="Confidence (%)" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-mono text-green-400">No defects detected</p>
                  </div>
                </div>
              )}
              
              {detections.length > 0 && (
                <div className="mt-3 overflow-y-auto max-h-40 bg-gray-700 rounded-md">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-right">Confidence</th>
                        <th className="p-2 text-right">Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {defectData.map((defect, i) => (
                        <tr key={i} className="border-t border-gray-600">
                          <td className="p-2">{defect.type}</td>
                          <td className="p-2 text-right">{defect.confidence}%</td>
                          <td className="p-2 text-right">
                            <span className={`rounded-full w-2 h-2 inline-block 
                              ${parseInt(defect.confidence) > 90 ? 'bg-red-500' : 
                                parseInt(defect.confidence) > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Download Report Button */}
            {reportUrl && (
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                <button 
                  onClick={handleDownloadReport} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md flex items-center justify-center font-medium transition-colors"
                >
                  <Download className="mr-2" /> Download Analysis Report
                </button>
                <div className="text-xs text-center mt-2 text-gray-400">
                  PDF | Includes detailed metrics and recommendations
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;