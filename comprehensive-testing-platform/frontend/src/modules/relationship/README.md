# Relationship Module AI Configuration

## Overview

The Relationship Module now uses DeepSeek AI service, consistent with the MBTI test implementation, to provide personalized and intelligent analysis of relationship test results.

## AI Service Configuration

### Environment Variables

To enable AI functionality, set the following environment variable:

```bash
REACT_APP_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### DeepSeek API Setup

1. **Get API Key**: Sign up at [DeepSeek AI](https://platform.deepseek.com/) and obtain your API key
2. **Configure Environment**: Add the API key to your `.env` file
3. **Restart Application**: Restart your development server after adding the environment variable

## AI Features

### Supported Test Types

- **Love Language Test**: Analyzes communication patterns and love expression preferences
- **Love Style Assessment**: Evaluates attachment styles and relationship approaches  
- **Interpersonal Skills**: Assesses communication and conflict resolution abilities

### AI-Generated Content

- **Personalized Test Summary**: AI-generated overview of test results
- **Customized Recommendations**: Tailored advice based on individual responses
- **Relationship Improvement Tips**: Specific, actionable suggestions for better relationships
- **Professional Interpretation**: Expert-level analysis using psychological theories

## Technical Implementation

### Service Architecture

```typescript
export class RelationshipAIService {
  private apiKey: string;
  private baseURL: string = 'https://api.deepseek.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
}
```

### AI Analysis Flow

1. **User completes test** → Clicks "Complete Test" button
2. **AI service called** → DeepSeek API processes responses
3. **Response parsed** → JSON converted to TestResult
4. **Fallback handling** → Traditional processing if AI fails
5. **Results displayed** → Personalized AI-generated content shown

### Prompt Engineering

Each test type has specialized AI prompts designed by relationship experts:

- **Love Language**: Based on Dr. Gary Chapman's theory
- **Love Style**: Grounded in attachment theory
- **Interpersonal**: Rooted in communication psychology

## Fallback Mechanism

If AI analysis fails, the system automatically falls back to traditional processing methods, ensuring reliable test completion.

## Performance Considerations

- **Temperature**: 0.3 (consistent, focused responses)
- **Model**: deepseek-chat (optimized for relationship counseling)
- **Max Tokens**: 2000 (comprehensive analysis)

## Error Handling

- API key validation
- Network error handling
- Response parsing validation
- Graceful degradation to traditional methods

## Usage Example

```typescript
import { relationshipAIService } from './services/relationshipAIService';

// AI analysis will be automatically triggered when user completes test
const result = await relationshipAIService.analyzeTest(session);
```

## Quick Test Guide

### 1. Start the Application
```bash
npm run dev
```

### 2. Navigate to Relationship Module
- Go to `/relationship` route
- Select "Love Language Test"

### 3. Complete the Test
- Answer all questions
- Click "Submit Answers" on the last question
- Click "Complete Test" button

### 4. Verify AI Service
- Check browser console for AI service logs
- Look for "AI Service: Active" indicator in results
- Verify personalized content is generated

### 5. Expected Behavior
- ✅ AI analysis triggered automatically
- ✅ Personalized summary generated
- ✅ Custom recommendations provided
- ✅ Fallback to traditional processing if AI fails

## Troubleshooting

### Common Issues

1. **"AI API key not configured"**: Set `REACT_APP_DEEPSEEK_API_KEY` environment variable
2. **"API request failed"**: Check internet connection and API key validity
3. **"Failed to parse AI response"**: AI response format issue, falls back to traditional processing

### Debug Mode

Enable console logging to debug AI service calls:

```typescript
// Check browser console for detailed error messages
console.log('AI analysis error:', error);
```

## Future Enhancements

- Multi-language support
- Advanced prompt customization
- Batch processing for multiple tests
- Enhanced error recovery mechanisms
