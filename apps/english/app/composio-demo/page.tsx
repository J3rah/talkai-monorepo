import ComposioToolsDemo from '@/components/ComposioToolsDemo';

export default function ComposioDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Composio Integration Demo</h1>
          <p className="text-gray-600">
            This page demonstrates how to integrate Composio tools into your AI therapy application.
            You can use these tools to enhance your therapy sessions with external integrations.
          </p>
        </div>
        
        <ComposioToolsDemo />
        
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium">1. Get Your API Key</h3>
              <p className="text-gray-600">
                Visit <a href="https://app.composio.dev" className="text-blue-600 hover:underline">Composio Studio</a> to get your API key.
              </p>
            </div>
            <div>
              <h3 className="font-medium">2. Set Environment Variable</h3>
              <p className="text-gray-600">
                Add <code className="bg-gray-200 px-1 rounded">COMPOSIO_API_KEY=your_api_key_here</code> to your environment variables.
              </p>
            </div>
            <div>
              <h3 className="font-medium">3. Connect Your Tools</h3>
              <p className="text-gray-600">
                In Composio Studio, connect the tools you want to use (Google Sheets, Gmail, etc.).
              </p>
            </div>
            <div>
              <h3 className="font-medium">4. Use in Your Code</h3>
              <p className="text-gray-600">
                Use the <code className="bg-gray-200 px-1 rounded">useComposio</code> hook in your components to access and execute tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}