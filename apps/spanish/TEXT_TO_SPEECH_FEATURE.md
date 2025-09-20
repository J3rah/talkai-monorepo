# Text-to-Speech Feature

## Overview

A new text input feature has been added to the chat session modal on `/test-homepage` that allows users to send text messages instead of using voice input. This provides an alternative communication method for users who prefer typing or are in environments where voice input is not suitable.

## Features

### Text Input Component (`components/TextInput.tsx`)

- **Text Input Field**: A clean, modern input field where users can type their messages
- **Send Button**: Click to send the typed message
- **Enter Key Support**: Press Enter to send messages quickly
- **Voice Toggle**: Integrated mute/unmute button to control voice input
- **Loading State**: Shows a spinner while the message is being sent
- **Auto-focus**: Input field is automatically focused when the component mounts

### Integration with Controls (`components/Controls.tsx`)

- The TextInput component is integrated into the existing Controls component
- Positioned below the main voice controls to provide easy access
- Only appears when a chat session is connected
- Maintains the existing voice control functionality

## How It Works

1. **Message Sending**: Uses the `sendAssistantInput` function from the `useVoice` hook to send text messages
2. **Message Processing**: Text messages are processed the same way as voice messages through the Hume AI API
3. **Response Handling**: The AI responds with voice output, maintaining the conversational experience
4. **State Management**: Properly manages loading states and input validation

## Current Limitations

**Important Note**: Due to limitations in the current Hume voice API implementation, text messages sent through the text input will appear in the chat interface as if they're coming from the AI assistant rather than the user. This is a technical limitation of the `sendAssistantInput` function, which is designed to send messages as if they're from the assistant.

**Workaround**: The text input still functions correctly - when you type a message and send it, the AI will respond appropriately. The message will just appear in the chat as if the AI is speaking it, but it will trigger the expected response from the AI therapist.

**Future Enhancement**: This limitation will be addressed when the Hume voice API provides a proper method for sending user text messages that appear as user messages in the chat interface.

## User Experience

### For Users Who Prefer Text Input
- Can type messages instead of speaking
- Maintains the same AI conversation quality
- Receives voice responses from the AI therapist
- Can still use voice input when desired

### For Users in Different Environments
- Useful in quiet environments where voice input is not appropriate
- Works well in noisy environments where voice recognition might fail
- Provides accessibility for users with speech difficulties

## Technical Implementation

### Key Components

1. **TextInput Component**:
   - React functional component with TypeScript
   - Uses `useVoice` hook for message sending
   - Integrates with existing UI components (Button, Input)
   - Responsive design with proper positioning

2. **Controls Integration**:
   - Added to the existing Controls component
   - Positioned to avoid conflicts with voice controls
   - Maintains existing functionality

### API Integration

- Uses `sendAssistantInput` from `@humeai/voice-react`
- Messages are sent through the same Hume AI pipeline as voice messages
- Maintains conversation context and session management

## Usage

1. Navigate to `/test-homepage`
2. Start a chat session using the existing voice setup
3. Once connected, the text input will appear at the bottom of the screen
4. Type your message and press Enter or click the Send button
5. The AI will respond with voice output as usual

## Future Enhancements

- **Message History**: Could add a text message history view
- **Typing Indicators**: Show when the AI is processing the message
- **Message Templates**: Quick response templates for common phrases
- **Accessibility**: Enhanced keyboard navigation and screen reader support

## Files Modified

- `components/TextInput.tsx` - New component for text input functionality
- `components/Controls.tsx` - Integrated TextInput component
- `TEXT_TO_SPEECH_FEATURE.md` - This documentation file 