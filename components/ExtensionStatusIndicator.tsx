'use client';

import { useExtensionMonitor } from '@/hooks/useExtensionMonitor';

export default function ExtensionStatusIndicator() {
  const { 
    extensionStatus, 
    isValidating, 
    checkExtensionPresence, 
    validateSession 
  } = useExtensionMonitor();

  const getStatusColor = () => {
    if (!extensionStatus.isInstalled) return 'bg-red-500';
    if (!extensionStatus.isResponding) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (isValidating) return 'Checking...';
    if (!extensionStatus.isInstalled) return 'Extension Not Found';
    if (!extensionStatus.isResponding) return 'Extension Not Responding';
    return 'Extension Active';
  };

  const handleValidateSession = async () => {
    const isValid = await validateSession();
    if (!isValid) {
      alert('Session validation failed. Extension may be disabled or uninstalled.');
    } else {
      alert('Session validation successful. Extension is working properly.');
    }
  };

  const handleCheckPresence = async () => {
    const isPresent = await checkExtensionPresence();
    if (!isPresent) {
      alert('Extension not found. Please install or enable the Requill extension.\n\nNote: If you are logged in and the extension is not installed, you will be automatically logged out for security.');
    } else {
      alert('Extension found and responding.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Extension Status</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm text-gray-600">{getStatusText()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Installed:</span>
            <span className={`ml-2 ${extensionStatus.isInstalled ? 'text-green-600' : 'text-red-600'}`}>
              {extensionStatus.isInstalled ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Responding:</span>
            <span className={`ml-2 ${extensionStatus.isResponding ? 'text-green-600' : 'text-red-600'}`}>
              {extensionStatus.isResponding ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Version:</span>
            <span className="ml-2 text-gray-700">
              {extensionStatus.version || 'Unknown'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Last Heartbeat:</span>
            <span className="ml-2 text-gray-700">
              {extensionStatus.lastHeartbeat 
                ? new Date(extensionStatus.lastHeartbeat).toLocaleTimeString()
                : 'Never'
              }
            </span>
          </div>
        </div>

        <div className="flex space-x-2 pt-3 border-t border-gray-200">
          <button
            onClick={handleCheckPresence}
            disabled={isValidating}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Check Presence
          </button>
          <button
            onClick={handleValidateSession}
            disabled={isValidating}
            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Validate Session
          </button>
        </div>
      </div>
    </div>
  );
}