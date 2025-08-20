'use client';

import React, { useState, useEffect } from 'react';
import PropertyForm from '@/components/PropertyForm';
import BrochureTemplate from '@/components/BrochureTemplate';
import { Property, PropertyFormData, Agent, BrochureData } from '@/types';
import { initGoogleMaps } from '@/lib/googleMaps';

// Mock agents data - in production, this would come from your database
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@vailwilliams.com',
    phone: '+44 20 7123 4567',
    title: 'Senior Commercial Property Consultant',
    photo: '/agents/sarah-johnson.jpg'
  },
  {
    id: '2',
    name: 'Michael Thompson',
    email: 'michael.thompson@vailwilliams.com',
    phone: '+44 20 7123 4568',
    title: 'Residential Property Specialist',
    photo: '/agents/michael-thompson.jpg'
  },
  {
    id: '3',
    name: 'Emily Davies',
    email: 'emily.davies@vailwilliams.com',
    phone: '+44 20 7123 4569',
    title: 'Industrial Property Advisor',
    photo: '/agents/emily-davies.jpg'
  },
];

export default function HomePage() {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [loading, setLoading] = useState(false);
  const [brochureData, setBrochureData] = useState<BrochureData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps when component mounts
  useEffect(() => {
    initGoogleMaps().catch(console.error);
  }, []);

  const handleFormSubmit = async (formData: PropertyFormData & { photos: File[] }) => {
    setLoading(true);
    setError(null);

    try {
      // First, upload the photos
      const uploadedPhotos = await uploadPhotos(formData.photos);

      // Find the selected agent
      const selectedAgent = mockAgents.find(agent => agent.id === formData.agent);
      if (!selectedAgent) {
        throw new Error('Selected agent not found');
      }

      // Create property object
      const property: Property = {
        address: formData.address,
        postcode: formData.postcode,
        propertyType: formData.propertyType,
        size: formData.size,
        photos: uploadedPhotos,
        agent: selectedAgent,
        description: formData.description,
        createdAt: new Date()
      };

      // Generate brochure data
      const response = await fetch('/api/brochure/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property,
          format: 'html' // Get HTML first for preview
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate brochure');
      }

      const result = await response.json();
      if (result.success) {
        setBrochureData(result.data.brochureData);
        setStep('preview');
      } else {
        throw new Error(result.error || 'Failed to generate brochure');
      }

    } catch (error) {
      console.error('Error generating brochure:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!brochureData) return;

    setLoading(true);
    try {
      const response = await fetch('/api/brochure/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property: brochureData.property,
          format: 'pdf'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `property-brochure-${brochureData.property.address.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error exporting PDF:', error);
      setError('Failed to export PDF');
    } finally {
      setLoading(false);
    }
  };

  const uploadPhotos = async (photos: File[]) => {
    const uploadedPhotos = [];
    
    for (const photo of photos) {
      try {
        // Create a mock URL for the photo (in production, upload to your storage service)
        const photoUrl = URL.createObjectURL(photo);
        
        uploadedPhotos.push({
          id: Math.random().toString(36).substr(2, 9),
          url: photoUrl,
          name: photo.name,
          size: photo.size,
          type: photo.type,
          uploadedAt: new Date()
        });
      } catch (error) {
        console.warn(`Failed to upload photo ${photo.name}:`, error);
      }
    }
    
    return uploadedPhotos;
  };

  const resetForm = () => {
    setStep('form');
    setBrochureData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#FF6B35] to-[#2DA5B8] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-white transform rotate-45"></div>
                <div className="w-3 h-3 bg-white transform rotate-45"></div>
                <div className="w-3 h-3 bg-white transform rotate-45"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">VAIL WILLIAMS</h1>
                <p className="text-sm text-white opacity-90">Property Brochure Generator</p>
              </div>
            </div>
            
            {step === 'preview' && (
              <button
                onClick={resetForm}
                className="bg-white text-[#FF6B35] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Create New Brochure
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <PropertyForm
            onSubmit={handleFormSubmit}
            loading={loading}
            agents={mockAgents}
          />
        )}

        {step === 'preview' && brochureData && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Brochure Preview
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Edit Property
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={loading}
                    className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Generating PDF...' : 'Export PDF'}
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <BrochureTemplate data={brochureData} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-white transform rotate-45"></div>
                  <div className="w-3 h-3 bg-white transform rotate-45"></div>
                  <div className="w-3 h-3 bg-white transform rotate-45"></div>
                </div>
                <h3 className="text-lg font-bold">VAIL WILLIAMS</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Professional property services with innovative brochure generation technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• AI-Enhanced Descriptions</li>
                <li>• EPC Data Integration</li>
                <li>• Google Maps Integration</li>
                <li>• Professional PDF Export</li>
                <li>• Mobile-Responsive Design</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📧 info@vailwilliams.com</p>
                <p>📱 +44 20 7123 4567</p>
                <p>🌐 www.vailwilliams.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 Vail Williams LLP. All rights reserved. Regulated by RICS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
