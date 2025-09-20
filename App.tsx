import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { EquipmentList } from './components/EquipmentList';
import { EquipmentDetail } from './components/EquipmentDetail';
import { AddNewEquipment } from './components/AddNewEquipment';
import { AddStaff } from './components/AddStaff';
import { NotificationCenter } from './components/NotificationCenter';
import { MOCK_EQUIPMENT } from './services/mockData';
import type { Equipment, AppNotification, DashboardFilter, RiskAssessment, EquipmentStatus } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LoginScreen } from './components/LoginScreen';
import { Footer } from './components/Footer';
import { AssessmentForm } from './components/AssessmentForm';

export interface EquipmentWithNextService extends Equipment {
  nextServiceDate: Date;
}

export type View = 'dashboard' | 'list' | 'detail' | 'addEquipment' | 'addStaff' | 'assessment';

const AppContent: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(MOCK_EQUIPMENT);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeListFilter, setActiveListFilter] = useState<DashboardFilter | null>(null);

  const equipmentWithNextService = useMemo((): EquipmentWithNextService[] => {
    return equipmentList.map(eq => {
      const lastService = eq.maintenanceHistory.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      const baseDate = lastService ? lastService.date : eq.installationDate;
      const nextServiceDate = new Date(baseDate);
      nextServiceDate.setDate(nextServiceDate.getDate() + eq.maintenanceIntervalDays);
      return { ...eq, nextServiceDate };
    });
  }, [equipmentList]);

  useEffect(() => {
    // Generate notifications for services due in the next 24 hours
    const now = new Date();
    const twentyFourHoursFromNow = new Date();
    twentyFourHoursFromNow.setHours(now.getHours() + 24);

    const upcomingServices = equipmentWithNextService.filter(e => 
      e.nextServiceDate > now && e.nextServiceDate <= twentyFourHoursFromNow
    );

    const newNotifications: AppNotification[] = upcomingServices.map(e => ({
      id: `notif-${e.id}`,
      equipmentId: e.id,
      equipmentName: e.name,
      department: e.department,
      location: e.location,
      nextServiceDate: e.nextServiceDate,
    }));
    setNotifications(newNotifications);
  }, [equipmentWithNextService]);


  const selectedEquipment = useMemo(() => {
    if (!selectedEquipmentId) return null;
    return equipmentWithNextService.find(e => e.id === selectedEquipmentId) || null;
  }, [selectedEquipmentId, equipmentWithNextService]);

  const handleSelectEquipment = (id: string) => {
    setSelectedEquipmentId(id);
    setCurrentView('detail');
  };
  
  const handleSetView = (view: View) => {
    if(view !== 'detail') {
        setSelectedEquipmentId(null);
    }
    if (view === 'list') {
      setActiveListFilter(null); // Clear dashboard filters when navigating to list view directly
    }
    setCurrentView(view);
  };
  
  const handleCardClick = (filter: DashboardFilter) => {
      setActiveListFilter(filter);
      setCurrentView('list');
  };

  const handleAcknowledgeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleAcknowledgeAllNotifications = () => {
    setNotifications([]);
  };
  
  const handleEquipmentAdded = () => {
      // In a real app, you would refetch data. Here, we just go back to the list.
      setCurrentView('list');
  };
  
  const handleStaffAdded = () => {
    setCurrentView('dashboard');
  }

  const handleAssessmentSubmitted = (equipmentId: string, newAssessmentData: Omit<RiskAssessment, 'assessmentDate'>, newStatus: EquipmentStatus) => {
    setEquipmentList(prevList => {
      return prevList.map(eq => {
        if (eq.id === equipmentId) {
          const newAssessment: RiskAssessment = {
            ...newAssessmentData,
            assessmentDate: new Date(),
          };
          // Prepend the new assessment to the history
          const updatedAssessments = [newAssessment, ...eq.riskAssessments];
          return { ...eq, riskAssessments: updatedAssessments, status: newStatus };
        }
        return eq;
      });
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard equipment={equipmentWithNextService} onSelectEquipment={handleSelectEquipment} onCardClick={handleCardClick}/>;
      case 'list':
        return <EquipmentList equipment={equipmentWithNextService} onSelectEquipment={handleSelectEquipment} activeFilter={activeListFilter} setActiveFilter={setActiveListFilter} />;
      case 'detail':
        return selectedEquipment ? <EquipmentDetail equipment={selectedEquipment} /> : <p>Equipment not found.</p>;
      case 'addEquipment':
        return <AddNewEquipment onEquipmentAdded={handleEquipmentAdded} />;
      case 'addStaff':
        return <AddStaff onStaffAdded={handleStaffAdded}/>;
      case 'assessment':
        return <AssessmentForm allEquipment={equipmentWithNextService} onAssessmentSubmit={handleAssessmentSubmitted} />;
      default:
        return <Dashboard equipment={equipmentWithNextService} onSelectEquipment={handleSelectEquipment} onCardClick={handleCardClick}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar currentView={currentView} onSetView={handleSetView} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleNotifications={() => setShowNotifications(s => !s)} notifications={notifications}/>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
              {renderContent()}
          </main>
          <Footer />
           {showNotifications && <NotificationCenter notifications={notifications} onAcknowledge={handleAcknowledgeNotification} onAcknowledgeAll={handleAcknowledgeAllNotifications}/>}
      </div>
  </div>
  );
}

const App: React.FC = () => {
  const { user } = useAuth();
  return user ? <AppContent /> : <LoginScreen />;
}

const AppWrapper: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);

export default AppWrapper;