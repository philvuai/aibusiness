import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const searchSchema = z.object({
  postcode: z.string().min(1, 'Postcode is required'),
  address: z.string().optional(),
});

type EpcRecord = Record<string, unknown>;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get('postcode');
    const address = searchParams.get('address');

    if (!postcode) {
      return NextResponse.json(
        { error: 'Postcode is required' },
        { status: 400 }
      );
    }

    const validatedData = searchSchema.parse({ postcode, address });

    const EPC_API_BASE_URL = process.env.EPC_API_BASE_URL || 'https://epc.opendatacommunities.org/api/v1';
    const EPC_API_KEY = process.env.EPC_API_KEY;

    if (!EPC_API_KEY) {
      return NextResponse.json(
        { error: 'EPC API key not configured' },
        { status: 500 }
      );
    }

    // Try domestic properties first
    let epcData: EpcRecord[] = [];
    
    try {
      const domesticUrl = `${EPC_API_BASE_URL}/domestic/search?postcode=${encodeURIComponent(validatedData.postcode)}&size=50`;
      const domesticResponse = await fetch(domesticUrl, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${EPC_API_KEY}:`).toString('base64')}`,
          'Accept': 'application/json',
        },
      });

      if (domesticResponse.ok) {
        const domesticResult = await domesticResponse.json();
        if (domesticResult.rows && Array.isArray(domesticResult.rows)) {
          epcData = [...epcData, ...domesticResult.rows];
        }
      }
    } catch (error) {
      console.warn('Domestic EPC search failed:', error);
    }

    // Try non-domestic properties
    try {
      const nonDomesticUrl = `${EPC_API_BASE_URL}/non-domestic/search?postcode=${encodeURIComponent(validatedData.postcode)}&size=50`;
      const nonDomesticResponse = await fetch(nonDomesticUrl, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${EPC_API_KEY}:`).toString('base64')}`,
          'Accept': 'application/json',
        },
      });

      if (nonDomesticResponse.ok) {
        const nonDomesticResult = await nonDomesticResponse.json();
        if (nonDomesticResult.rows && Array.isArray(nonDomesticResult.rows)) {
          epcData = [...epcData, ...nonDomesticResult.rows];
        }
      }
    } catch (error) {
      console.warn('Non-domestic EPC search failed:', error);
    }

    // Filter by address if provided
    if (validatedData.address && epcData.length > 0) {
      const addressFilter = validatedData.address.toLowerCase();
      epcData = epcData.filter(record => {
        const recordAddress = String(record.address || '').toLowerCase();
        return recordAddress.includes(addressFilter);
      });
    }

    // Transform and clean the data
    const transformedData = epcData.map(record => ({
      lmkKey: record['lmk-key'] || record.lmkKey || '',
      address: record.address || '',
      postcode: record.postcode || '',
      currentEnergyRating: record['current-energy-rating'] || record.currentEnergyRating || '',
      potentialEnergyRating: record['potential-energy-rating'] || record.potentialEnergyRating || '',
      currentEnergyEfficiency: record['current-energy-efficiency'] || record.currentEnergyEfficiency || '',
      potentialEnergyEfficiency: record['potential-energy-efficiency'] || record.potentialEnergyEfficiency || '',
      propertyType: record['property-type'] || record.propertyType || '',
      totalFloorArea: record['total-floor-area'] || record.totalFloorArea || '',
      environmentalImpactCurrent: record['environmental-impact-current'] || record.environmentalImpactCurrent || '',
      co2EmissionsCurrent: record['co2-emissions-current'] || record.co2EmissionsCurrent || '',
      lodgementDate: record['lodgement-date'] || record.lodgementDate || '',
      transactionType: record['transaction-type'] || record.transactionType || '',
    }));

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
    });
  } catch (error) {
    console.error('Error in EPC search route:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = searchSchema.parse(body);

    const EPC_API_BASE_URL = process.env.EPC_API_BASE_URL || 'https://epc.opendatacommunities.org/api/v1';
    const EPC_API_KEY = process.env.EPC_API_KEY;

    if (!EPC_API_KEY) {
      return NextResponse.json(
        { error: 'EPC API key not configured' },
        { status: 500 }
      );
    }

    let epcData: EpcRecord[] = [];
    
    // Try domestic properties first
    try {
      const domesticUrl = `${EPC_API_BASE_URL}/domestic/search?postcode=${encodeURIComponent(validatedData.postcode)}&size=50`;
      const domesticResponse = await fetch(domesticUrl, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${EPC_API_KEY}:`).toString('base64')}`,
          'Accept': 'application/json',
        },
      });

      if (domesticResponse.ok) {
        const domesticResult = await domesticResponse.json();
        if (domesticResult.rows && Array.isArray(domesticResult.rows)) {
          epcData = [...epcData, ...domesticResult.rows];
        }
      }
    } catch (error) {
      console.warn('Domestic EPC search failed:', error);
    }

    // Try non-domestic properties
    try {
      const nonDomesticUrl = `${EPC_API_BASE_URL}/non-domestic/search?postcode=${encodeURIComponent(validatedData.postcode)}&size=50`;
      const nonDomesticResponse = await fetch(nonDomesticUrl, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${EPC_API_KEY}:`).toString('base64')}`,
          'Accept': 'application/json',
        },
      });

      if (nonDomesticResponse.ok) {
        const nonDomesticResult = await nonDomesticResponse.json();
        if (nonDomesticResult.rows && Array.isArray(nonDomesticResult.rows)) {
          epcData = [...epcData, ...nonDomesticResult.rows];
        }
      }
    } catch (error) {
      console.warn('Non-domestic EPC search failed:', error);
    }

    // Filter by address if provided
    if (validatedData.address && epcData.length > 0) {
      const addressFilter = validatedData.address.toLowerCase();
      epcData = epcData.filter(record => {
        const recordAddress = String(record.address || '').toLowerCase();
        return recordAddress.includes(addressFilter);
      });
    }

    // Transform and clean the data
    const transformedData = epcData.map(record => ({
      lmkKey: record['lmk-key'] || record.lmkKey || '',
      address: record.address || '',
      postcode: record.postcode || '',
      currentEnergyRating: record['current-energy-rating'] || record.currentEnergyRating || '',
      potentialEnergyRating: record['potential-energy-rating'] || record.potentialEnergyRating || '',
      currentEnergyEfficiency: record['current-energy-efficiency'] || record.currentEnergyEfficiency || '',
      potentialEnergyEfficiency: record['potential-energy-efficiency'] || record.potentialEnergyEfficiency || '',
      propertyType: record['property-type'] || record.propertyType || '',
      totalFloorArea: record['total-floor-area'] || record.totalFloorArea || '',
      environmentalImpactCurrent: record['environmental-impact-current'] || record.environmentalImpactCurrent || '',
      co2EmissionsCurrent: record['co2-emissions-current'] || record.co2EmissionsCurrent || '',
      lodgementDate: record['lodgement-date'] || record.lodgementDate || '',
      transactionType: record['transaction-type'] || record.transactionType || '',
    }));

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
    });
  } catch (error) {
    console.error('Error in EPC search route:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
