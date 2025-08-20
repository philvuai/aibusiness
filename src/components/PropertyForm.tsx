'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { 
  BuildingOfficeIcon,
  HomeIcon,
  BuildingOffice2Icon,
  PhotoIcon,
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { PropertyFormData, Agent } from '@/types';

// Google Maps type declaration
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google: any;
  }
}

// Validation schema
const propertySchema = z.object({
  address: z.string().min(10, 'Please enter a complete address'),
  postcode: z.string().min(5, 'Please enter a valid postcode'),
  propertyType: z.enum(['Commercial', 'Residential', 'Industrial']),
  size: z.string().min(1, 'Please specify the property size').optional(),
  agent: z.string().min(1, 'Please select an agent'),
  description: z.string().optional(),
});

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  loading?: boolean;
  agents: Agent[];
}

export default function PropertyForm({ onSubmit, loading, agents }: PropertyFormProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<Omit<PropertyFormData, 'photos'>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      propertyType: 'Commercial'
    }
  });


  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current!,
        {
          types: ['address'],
          componentRestrictions: { country: 'GB' }
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setValue('address', place.formatted_address);
          
          // Extract postcode from address components
          const postcodeComponent = place.address_components?.find(
            (component: any) => component.types.includes('postal_code')
          );
          if (postcodeComponent) {
            setValue('postcode', postcodeComponent.long_name);
          }
        }
      });
    }
  }, [setValue]);

  // Handle photo upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      setPhotos(prev => [...prev, ...acceptedFiles].slice(0, 10));
    }
  });

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: Omit<PropertyFormData, 'photos'>) => {
    onSubmit({ ...data, photos });
  };

  const propertyTypes = [
    { value: 'Commercial', label: 'Commercial', icon: BuildingOfficeIcon },
    { value: 'Residential', label: 'Residential', icon: HomeIcon },
    { value: 'Industrial', label: 'Industrial', icon: BuildingOffice2Icon },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create Property Brochure
        </h2>
        <p className="text-gray-600">
          Enter property details to generate a professional brochure
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Property Address */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <MapPinIcon className="h-6 w-6 mr-2 text-[#FF6B35]" />
            Property Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Address
              </label>
              <input
                {...register('address')}
                ref={addressInputRef}
                type="text"
                placeholder="Enter full property address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postcode
              </label>
              <input
                {...register('postcode')}
                type="text"
                placeholder="SW1A 1AA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors"
              />
              {errors.postcode && (
                <p className="mt-1 text-sm text-red-600">{errors.postcode.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Property Type</h3>
          <Controller
            name="propertyType"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {propertyTypes.map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      field.value === value
                        ? 'border-[#FF6B35] bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      {...field}
                      value={value}
                      className="sr-only"
                    />
                    <Icon className={`h-6 w-6 mr-3 ${
                      field.value === value ? 'text-[#FF6B35]' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      field.value === value ? 'text-[#FF6B35]' : 'text-gray-700'
                    }`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Property Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Property Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (sq ft or description)
              </label>
              <input
                {...register('size')}
                type="text"
                placeholder="e.g., 2,500 sq ft or 3 bedroom house"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors"
              />
              {errors.size && (
                <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Agent
              </label>
              <select
                {...register('agent')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors"
              >
                <option value="">Select an agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} - {agent.title}
                  </option>
                ))}
              </select>
              {errors.agent && (
                <p className="mt-1 text-sm text-red-600">{errors.agent.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <PhotoIcon className="h-6 w-6 mr-2 text-[#FF6B35]" />
            Property Photos
          </h3>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-[#FF6B35] bg-orange-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <PhotoIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop photos here' : 'Upload property photos'}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop up to 10 photos, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports: JPEG, PNG, WebP (Max 10MB each)
            </p>
          </div>

          {/* Photo Preview */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Any additional information about the property..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF6B35] text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating Brochure...' : 'Generate Brochure'}
          </button>
        </div>
      </form>
    </div>
  );
}
