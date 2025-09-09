import React, { useState } from 'react';
import { fileAPI } from '../services/api';

const FileUpload = ({ userPlan = 'free', onUpgradeClick }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (userPlan === 'free') {
      showUpgradePrompt();
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (userPlan === 'free') {
      showUpgradePrompt();
      return;
    }
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    setIsUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const res = await fileAPI.upload(file);
          const uploadedFile = res.data.data.file;
          return {
            id: uploadedFile._id,
            name: uploadedFile.originalName,
            size: uploadedFile.size,
            type: uploadedFile.mimeType,
            status: uploadedFile.status,
            analysis: "Processing started. Results will be available soon."
          };
        })
      );
      setUploadedFiles(prev => [...prev, ...uploaded]);
    } catch (error) {
      alert(error.response?.data?.message || "File upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const generateFileAnalysis = (fileName) => {
    const analyses = [
      "File structure validated. No critical errors found. Recommended: Check joinery settings in section 3.",
      "CNC path optimization needed. Found 2 potential collision points. Suggested fixes included.",
      "Material calculations accurate. Consider adjusting cutting depth for better finish quality.",
      "Assembly sequence optimized. Installation notes generated for complex joinery sections."
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const showUpgradePrompt = () => {
    alert("Upgrade to Pro for file parsing and diagnostics. Pro analyzes .cab, .cabx, .mzb, and .xml with a step-by-step fix plan.");
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  if (userPlan === 'free') {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <div className="flex flex-col items-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">File Upload Disabled</h3>
            <p className="mt-2 text-sm text-gray-600">
              Upgrade to Pro for file parsing and diagnostics. Pro analyzes .cab, .cabx, .mzb, and .xml with a step-by-step fix plan.
            </p>
            <button
              onClick={onUpgradeClick}
              className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative bg-white rounded-lg file-upload-area p-8 text-center ${
          dragActive ? 'drag-active' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".cab,.cabx,.mzb,.xml"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Upload Millwork Files</h3>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your .cab, .cabx, .mzb, or .xml files here, or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: .cab, .cabx, .mzb, .xml
          </p>
        </div>
      </div>

      
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-sm text-blue-800">Analyzing files...</span>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Analyzed Files</h3>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-gray-900">{file.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{file.analysis}</p>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
