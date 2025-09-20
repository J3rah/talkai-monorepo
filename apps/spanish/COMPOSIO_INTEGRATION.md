# Composio Integration for AI Therapy Application

This document explains how to use the Composio integration in your AI therapy application to enhance functionality with external tools and services.

## Overview

Composio allows your AI therapy application to integrate with various external services like:
- **Google Sheets** - Store session data, track progress, maintain client records
- **Gmail** - Send follow-up emails, appointment reminders, progress reports
- **Google Calendar** - Schedule sessions, manage appointments, set reminders
- **Notion** - Document therapy notes, create client profiles
- **Slack** - Team communication, notifications
- And many more...

## Setup

### 1. Get Your Composio API Key

1. Visit [Composio Studio](https://app.composio.dev)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key

### 2. Configure Environment Variables

Add your API key to your environment variables:

```bash
# .env.local
COMPOSIO_API_KEY=your_api_key_here
```

### 3. Connect Your Tools

In Composio Studio:
1. Go to the "Connections" section
2. Connect the tools you want to use (Google Sheets, Gmail, etc.)
3. Follow the authentication flow for each tool

## Usage

### Basic Usage

```typescript
import { useComposio } from '@/hooks/useComposio';

function MyComponent() {
  const { tools, loading, error, executeTool } = useComposio();

  const handleSendEmail = async () => {
    try {
      const result = await executeTool('GMAIL_SEND_EMAIL', {
        to: 'client@example.com',
        subject: 'Session Follow-up',
        body: 'Thank you for your session today...'
      });
      console.log('Email sent:', result);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  return (
    <div>
      {tools.map(tool => (
        <div key={tool.name}>
          <h3>{tool.name}</h3>
          <p>{tool.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### API Routes

The integration provides two main API endpoints:

#### GET `/api/composio/tools`
Returns a list of available tools.

#### POST `/api/composio/tools`
Executes a specific tool.

```typescript
// Example: Execute a Google Sheets tool
const response = await fetch('/api/composio/tools', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    toolName: 'GOOGLESHEETS_BATCH_UPDATE',
    arguments: {
      spreadsheetId: 'your-spreadsheet-id',
      sheetName: 'Sessions',
      values: [
        ['Date', 'Client', 'Session Type', 'Notes'],
        ['2024-01-15', 'John Doe', 'Anxiety', 'Good progress today']
      ]
    }
  })
});
```

## Integration Examples

### 1. Session Data Storage

Store therapy session data in Google Sheets:

```typescript
const saveSessionData = async (sessionData) => {
  await executeTool('GOOGLESHEETS_BATCH_UPDATE', {
    spreadsheetId: process.env.SESSIONS_SPREADSHEET_ID,
    sheetName: 'Sessions',
    values: [
      [
        new Date().toISOString(),
        sessionData.clientId,
        sessionData.sessionType,
        sessionData.notes,
        sessionData.mood,
        sessionData.duration
      ]
    ]
  });
};
```

### 2. Follow-up Emails

Send automated follow-up emails after sessions:

```typescript
const sendFollowUpEmail = async (clientEmail, sessionNotes) => {
  await executeTool('GMAIL_SEND_EMAIL', {
    to: clientEmail,
    sessionNotes,
    subject: 'Session Follow-up',
    body: `
      Hi there,
      
      Thank you for your session today. Here's a summary of what we discussed:
      
      ${sessionNotes}
      
      Remember to practice the techniques we discussed.
      
      Best regards,
      Your AI Therapist
    `
  });
};
```

### 3. Appointment Scheduling

Schedule follow-up appointments in Google Calendar:

```typescript
const scheduleFollowUp = async (clientEmail, dateTime) => {
  await executeTool('GOOGLECALENDAR_CREATE_EVENT', {
    summary: 'Therapy Session',
    description: 'Follow-up therapy session',
    startTime: dateTime,
    endTime: new Date(dateTime.getTime() + 60 * 60 * 1000), // 1 hour later
    attendees: [clientEmail]
  });
};
```

## Demo Page

Visit `/composio-demo` to see a live demonstration of the Composio integration.

## Error Handling

The integration includes comprehensive error handling:

```typescript
const { error, executeTool } = useComposio();

if (error) {
  console.error('Composio error:', error);
  // Handle error appropriately
}
```

## Security Considerations

1. **API Key Security**: Never expose your API key in client-side code
2. **Tool Permissions**: Only connect tools that your application actually needs
3. **Data Privacy**: Be mindful of what data you send to external services
4. **Rate Limiting**: Respect API rate limits for connected services

## Troubleshooting

### Common Issues

1. **"Composio API key not configured"**
   - Make sure `COMPOSIO_API_KEY` is set in your environment variables
   - Restart your development server after adding the key

2. **"No tools available"**
   - Check that you've connected tools in Composio Studio
   - Verify your API key has the correct permissions

3. **"Tool execution failed"**
   - Check the tool's required parameters
   - Verify the connected account has the necessary permissions
   - Check the browser console for detailed error messages

### Getting Help

- [Composio Documentation](https://v3.docs.composio.dev)
- [Composio Studio](https://app.composio.dev)
- Check the browser console for detailed error messages

## Next Steps

1. **Connect Your First Tool**: Start with Google Sheets for session data storage
2. **Test the Integration**: Use the demo page to test tool execution
3. **Integrate into Your Workflow**: Add Composio tools to your existing therapy sessions
4. **Monitor Usage**: Keep track of API usage and tool execution

The Composio integration is now ready to enhance your AI therapy application with powerful external tool capabilities!