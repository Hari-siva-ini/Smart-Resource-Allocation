import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MapPin, Clock, CheckCircle } from 'lucide-react';

export default function VolunteerDashboard() {
  const { currentUser } = useAuth();
  const [pendingReports, setPendingReports] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch Pending Reports
    const qReports = query(collection(db, 'reports'), where('status', '==', 'Pending'));
    const unsubReports = onSnapshot(qReports, (snapshot) => {
      setPendingReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch My Tasks
    const qTasks = query(collection(db, 'tasks'), where('volunteerUid', '==', currentUser.uid));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      setMyTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubReports();
      unsubTasks();
    };
  }, [currentUser]);

  const handleAccept = async (report) => {
    try {
      // Create Task
      await addDoc(collection(db, 'tasks'), {
        reportId: report.id,
        volunteerUid: currentUser.uid,
        status: 'In Progress',
        startedAt: serverTimestamp()
      });

      // Update Report
      await updateDoc(doc(db, 'reports', report.id), {
        status: 'In Progress',
        assignedVolunteerUid: currentUser.uid
      });

      toast.success('Task accepted successfully!');
    } catch (error) {
      toast.error('Failed to accept task: ' + error.message);
    }
  };

  const handleComplete = async (task) => {
    try {
      // Update Task
      await updateDoc(doc(db, 'tasks', task.id), {
        status: 'Completed',
        completedAt: serverTimestamp()
      });

      // Update Report
      if (task.reportId) {
        await updateDoc(doc(db, 'reports', task.reportId), {
          status: 'Completed'
        });
      }

      toast.success('Task marked as completed!');
    } catch (error) {
      toast.error('Failed to complete task: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div></div>;
  }

  const activeTasks = myTasks.filter(t => t.status === 'In Progress');
  const completedTasks = myTasks.filter(t => t.status === 'Completed');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <p className="text-sm text-gray-500">Find nearby needs and manage your tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Available Reports */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col max-h-[600px]">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircleIcon className="text-brand-500" /> Pending Reports
          </h2>
          <div className="overflow-y-auto pr-2 space-y-4 flex-grow">
            {pendingReports.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending reports at the moment.</p>
            ) : (
              pendingReports.map(report => (
                <div key={report.id} className="border border-gray-100 p-4 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{report.category}</span>
                    <span className="text-xs text-red-500 font-bold">{report.priority}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{report.location}</h3>
                  <p className="text-gray-600 text-xs mb-4 line-clamp-2">{report.description}</p>
                  <button 
                    onClick={() => handleAccept(report)}
                    className="w-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium py-2 rounded-lg text-sm transition-colors"
                  >
                    Accept Task
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Tasks */}
        <div className="flex flex-col gap-6">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="text-blue-500 w-5 h-5" /> Active Tasks ({activeTasks.length})
            </h2>
            <div className="space-y-4">
              {activeTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No active tasks.</p>
              ) : (
                activeTasks.map(task => (
                  <div key={task.id} className="border border-blue-100 bg-blue-50/30 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-blue-900">Task #{task.id.slice(0,6)}</span>
                      <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">In Progress</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">Report ID: {task.reportId}</p>
                    <button 
                      onClick={() => handleComplete(task)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                    >
                      Mark as Completed
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500 w-5 h-5" /> Completed Tasks ({completedTasks.length})
            </h2>
             <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
              {completedTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No completed tasks yet.</p>
              ) : (
                completedTasks.map(task => (
                  <div key={task.id} className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-600">Task #{task.id.slice(0,6)}</span>
                    <span className="text-xs text-green-600">Completed</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircleIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}
