// components/FileUpload.tsx
"use client"; // This line is essential for client-side functionality

import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button"; // Adjust path as needed

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const uploadUrl = 'YOUR_UPLOADTHING_ENDPOINT'; // Replace with your Uploadthing endpoint
    const uploadToken = 'YOUR_UPLOAD_TOKEN'; // Replace with your Upload token

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${uploadToken}`, // If required
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        alert('File uploaded successfully!');
      } else {
        console.error('Upload failed:', response.statusText);
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
      />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default FileUpload;
