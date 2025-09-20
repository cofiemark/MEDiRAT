import React, { useState, useMemo } from 'react';
import type { AppNotification } from '../types';
import { useAuth } from '../hooks/useAuth';
import { ConfirmationDialog } from './ConfirmationDialog';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onAcknowledge: (notificationId: string) => void;
  onAcknowledgeAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onAcknowledge, onAcknowledgeAll }) => {
  const { hasPermission } = useAuth();
  const [acknowledgeTarget, setAcknowledgeTarget] = useState<string | null>(null);
  const [isMarkAllDialogOpen, setIsMarkAllDialogOpen] = useState(false);

  const groupedNotifications = useMemo(() => {
    if (!notifications) return {};
    return notifications.reduce((acc, notification) => {
        const department = notification.department;
        if (!acc[department]) {
            acc[department] = [];
        }
        acc[department].push(notification);
        return acc;
    }, {} as Record<string, AppNotification[]>);
  }, [notifications]);

  if (notifications.length === 0) {
    return null;
  }
  
  const handleAcknowledgeClick = (notificationId: string) => {
    setAcknowledgeTarget(notificationId);
  };
  
  const handleConfirmAcknowledge = () => {
    if (acknowledgeTarget) {
      onAcknowledge(acknowledgeTarget);
    }
    setAcknowledgeTarget(null); // Close dialog
  };

  const handleConfirmAcknowledgeAll = () => {
    onAcknowledgeAll();
    setIsMarkAllDialogOpen(false);
  };
  
  const targetNotification = acknowledgeTarget ? notifications.find(n => n.id === acknowledgeTarget) : null;

  return (
    <>
      <div role="region" aria-live="polite" className="fixed top-24 right-8 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Service Alerts</h3>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto flex-grow">
          {Object.entries(groupedNotifications).map(([department, departmentNotifications]) => (
            <li key={department} className="px-4 py-3">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">{department}</h4>
              <ul className="space-y-3">
                {departmentNotifications.map((notification) => (
                  <li key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-2">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{notification.equipmentName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {notification.location}
                      </p>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                      Service due: {notification.nextServiceDate.toLocaleString()}
                    </p>
                    {hasPermission('acknowledge:notification') && (
                        <button
                        onClick={() => handleAcknowledgeClick(notification.id)}
                        className="w-full py-1.5 px-3 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                        Acknowledge
                        </button>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {hasPermission('acknowledge:notification') && notifications.length > 1 && (
          <div className="p-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
            <button
                onClick={() => setIsMarkAllDialogOpen(true)}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Mark All as Acknowledged
            </button>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!acknowledgeTarget}
        title="Acknowledge Service Alert"
        message={`Are you sure you want to acknowledge this service alert for ${targetNotification?.equipmentName || 'this equipment'}? This action cannot be undone.`}
        onConfirm={handleConfirmAcknowledge}
        onCancel={() => setAcknowledgeTarget(null)}
        confirmText="Acknowledge"
        confirmButtonClass="bg-green-600 hover:bg-green-700 focus:ring-green-500"
      />

      <ConfirmationDialog
        isOpen={isMarkAllDialogOpen}
        title="Mark All Alerts as Acknowledged"
        message={`Are you sure you want to acknowledge all ${notifications.length} service alerts? This action cannot be undone.`}
        onConfirm={handleConfirmAcknowledgeAll}
        onCancel={() => setIsMarkAllDialogOpen(false)}
        confirmText="Acknowledge All"
        confirmButtonClass="bg-green-600 hover:bg-green-700 focus:ring-green-500"
      />
    </>
  );
};