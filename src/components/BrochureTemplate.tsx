'use client';

import React from 'react';
import { BrochureData } from '@/types';
import { 
  MapPinIcon, 
  BuildingOfficeIcon, 
  ChartBarIcon,
  StarIcon,
  ArrowRightCircleIcon,
  TruckIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface BrochureTemplateProps {
  data: BrochureData;
  className?: string;
}

export default function BrochureTemplate({ data, className = '' }: BrochureTemplateProps) {
  const { property, agent, epcData, googleMapsData, aiEnhanced } = data;
  const mapImageUrl = googleMapsData?.staticMapUrl;
  const enhancedDescription = aiEnhanced?.enhanced_description;
  const marketAnalysis = aiEnhanced?.market_analysis;
  const locationBenefits = aiEnhanced?.key_features;
  const transportLinks = googleMapsData?.nearbyTransport;

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'rail': return ArrowRightCircleIcon;
      case 'bus': return TruckIcon;
      case 'airport': return PaperAirplaneIcon;
      default: return ArrowRightCircleIcon;
    }
  };

  const getEPCColor = (rating: string) => {
    switch (rating?.toUpperCase()) {
      case 'A': return '#00a651';
      case 'B': return '#5cb85c';
      case 'C': return '#f0ad4e';
      case 'D': return '#ff9500';
      case 'E': return '#f0ad4e';
      case 'F': return '#d9534f';
      case 'G': return '#d9534f';
      default: return '#6c757d';
    }
  };

  return (
    <div className={`bg-white ${className}`} id="brochure-template">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#FF6B35] to-[#2DA5B8] text-white p-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{property.address}</h1>
            <p className="text-xl opacity-90 mb-4">{property.propertyType} Property</p>
            {property.size && (
              <p className="text-lg opacity-80">{property.size}</p>
            )}
          </div>
          
          {/* Vail Williams Logo Area */}
          <div className="text-right">
            <div className="mb-4">
              {/* Three Diamond Logo */}
              <div className="flex space-x-1 justify-end mb-2">
                <div className="w-4 h-4 bg-white transform rotate-45"></div>
                <div className="w-4 h-4 bg-white transform rotate-45"></div>
                <div className="w-4 h-4 bg-white transform rotate-45"></div>
              </div>
              <h2 className="text-2xl font-bold">VAIL WILLIAMS</h2>
              <p className="text-sm opacity-90">Estate Agents</p>
            </div>
          </div>
        </div>
        
        {/* EPC Rating Badge */}
        {epcData && (
          <div className="absolute top-8 right-8 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: getEPCColor(epcData.currentEnergyRating) }}
              >
                {epcData.currentEnergyRating}
              </div>
              <div>
                <p className="text-xs font-medium">EPC Rating</p>
                <p className="text-xs text-gray-600">{epcData.currentEnergyEfficiency}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8 p-8">
        {/* Left Column - Property Details */}
        <div className="col-span-8 space-y-8">
          {/* Property Description */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="h-6 w-6 mr-2 text-[#FF6B35]" />
              Property Description
            </h3>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">{enhancedDescription || property.description || 'Attractive property opportunity in excellent location.'}</p>
            </div>
          </section>

          {/* Key Features */}
          {data.property.features && data.property.features.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <StarIcon className="h-6 w-6 mr-2 text-[#2DA5B8]" />
                Key Features
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {data.property.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#FF6B35] rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Market Analysis */}
          {marketAnalysis && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-2 text-[#2DA5B8]" />
                Market Analysis
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{marketAnalysis}</p>
              </div>
            </section>
          )}

          {/* Property Photos Grid */}
          {property.photos && property.photos.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-[#FF6B35] mr-2">📸</span>
                Property Gallery
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {property.photos.slice(0, 4).map((photo, index) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                ))}
              </div>
              {property.photos.length > 4 && (
                <p className="text-sm text-gray-500 mt-2">
                  +{property.photos.length - 4} more photos available
                </p>
              )}
            </section>
          )}
        </div>

        {/* Right Column - Location & Contact */}
        <div className="col-span-4 space-y-6">
          {/* Location Map */}
          {mapImageUrl && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-[#FF6B35]" />
                Location
              </h3>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img
                  src={mapImageUrl}
                  alt="Property location map"
                  className="w-full h-48 object-cover"
                />
              </div>
            </section>
          )}

          {/* Location Benefits */}
          {locationBenefits && locationBenefits.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Location Benefits
              </h3>
              <ul className="space-y-2">
                {locationBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-[#2DA5B8] rounded-full mt-2"></div>
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Transport Links */}
          {transportLinks && transportLinks.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Transport Links
              </h3>
              <div className="space-y-2">
                {transportLinks.map((link, index) => {
                  const IconComponent = getTransportIcon(link.type);
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-[#2DA5B8]" />
                        <span className="text-gray-700">{link.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-600">{link.distance}</span>
                        {link.walkingTime && (
                          <div className="text-xs text-gray-500">{link.walkingTime} walk</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* EPC Information */}
          {epcData && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Energy Performance
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Current Rating</span>
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: getEPCColor(epcData.currentEnergyRating) }}
                  >
                    {epcData.currentEnergyRating}
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Efficiency: {epcData.currentEnergyEfficiency}</p>
                  <p>CO₂ Emissions: {epcData.co2EmissionsCurrent} kg/year</p>
                  <p>Valid until: {new Date(epcData.lodgementDate).getFullYear() + 10}</p>
                </div>
              </div>
            </section>
          )}

          {/* Contact Information */}
          <section className="bg-gradient-to-b from-[#FF6B35] to-[#2DA5B8] text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-lg">{agent.name}</p>
                <p className="text-sm opacity-90">{agent.title}</p>
              </div>
              <div className="space-y-1 text-sm">
                <p>📧 {agent.email}</p>
                <p>📱 {agent.phone}</p>
              </div>
              <div className="pt-3 border-t border-white border-opacity-20">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-white transform rotate-45"></div>
                  <div className="w-3 h-3 bg-white transform rotate-45"></div>
                  <div className="w-3 h-3 bg-white transform rotate-45"></div>
                </div>
                <p className="text-sm font-bold mt-1">VAIL WILLIAMS</p>
                <p className="text-xs opacity-90">Professional Property Services</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">© 2024 Vail Williams LLP. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-1">
              Regulated by RICS. VAT Registration: 123456789
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">www.vailwilliams.com</p>
            <p className="text-xs text-gray-400">Generated on {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
