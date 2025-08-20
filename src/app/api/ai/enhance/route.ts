import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const enhanceSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  size: z.number().optional(),
  price: z.number().optional(),
  features: z.array(z.string()).optional(),
  description: z.string().optional(),
});

interface AIResponse {
  enhanced_description: string;
  market_analysis: string;
  key_features: string[];
  target_buyer: string;
  investment_potential: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = enhanceSchema.parse(body);

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1';

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Create detailed prompt for property enhancement
    const prompt = `You are a professional estate agent copywriter specializing in luxury property marketing. 

Property Details:
- Address: ${validatedData.address}
- Type: ${validatedData.propertyType}
${validatedData.bedrooms ? `- Bedrooms: ${validatedData.bedrooms}` : ''}
${validatedData.bathrooms ? `- Bathrooms: ${validatedData.bathrooms}` : ''}
${validatedData.size ? `- Size: ${validatedData.size} sq ft` : ''}
${validatedData.price ? `- Price: £${validatedData.price.toLocaleString()}` : ''}
${validatedData.features ? `- Features: ${validatedData.features.join(', ')}` : ''}
${validatedData.description ? `- Current Description: ${validatedData.description}` : ''}

Please provide a comprehensive property marketing analysis in JSON format with the following structure:

{
  "enhanced_description": "A compelling, detailed property description that highlights unique selling points, lifestyle benefits, and emotional appeal. Write in professional yet engaging British English.",
  "market_analysis": "Professional market analysis including location benefits, investment potential, comparable properties, and market trends. Include specific data points where possible.",
  "key_features": ["List of 5-8 key features that make this property stand out"],
  "target_buyer": "Detailed profile of the ideal buyer for this property",
  "investment_potential": "Analysis of the property's investment potential, growth prospects, and rental yield estimates"
}

Ensure the content is:
- Professional and sophisticated
- Factual yet persuasive
- Tailored to the UK property market
- Free of any assumptions about features not mentioned
- Focused on the property's unique selling points`;

    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Vail Williams Property Brochure Generator',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to enhance property description' },
        { status: response.status }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No content received from AI service' },
        { status: 500 }
      );
    }

    // Try to parse JSON response
    let enhancedData: AIResponse;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      enhancedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: create structured response from raw text
      enhancedData = {
        enhanced_description: content.slice(0, 500) + '...',
        market_analysis: 'Market analysis available upon request.',
        key_features: ['Professional enhancement available', 'Contact agent for details'],
        target_buyer: 'Suitable for various buyer profiles',
        investment_potential: 'Investment potential analysis available upon request',
      };
    }

    return NextResponse.json({
      success: true,
      data: enhancedData,
    });
  } catch (error) {
    console.error('Error in AI enhance route:', error);
    
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
