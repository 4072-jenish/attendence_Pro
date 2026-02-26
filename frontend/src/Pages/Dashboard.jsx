import { useState, useEffect } from "react";
import API from "../Services/api";
import jsPDF from "jspdf";
import { 
  Clock, 
  LogIn, 
  Coffee, 
  LogOut, 
  FileText, 
  Award,
  Calendar,
  ChevronRight,
  Download,
  CheckCircle,
  Timer,
  Play,
  Pause,
  StopCircle,
  Coffee as CoffeeIcon,
  FileDown,
  User,
  Briefcase
} from "lucide-react";
import "../styles/dashboard.css"

export default function Dashboard() {
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeSession, setActiveSession] = useState('none');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchToday();
  }, []);

  useEffect(() => {
    if (todayData) {
      if (todayData.punchOut) {
        setActiveSession('completed');
      } else if (todayData.freshBreakStart && !todayData.freshBreakEnd) {
        setActiveSession('break');
      } else if (todayData.punchIn) {
        setActiveSession('working');
      } else {
        setActiveSession('none');
      }
    }
  }, [todayData]);

  const fetchToday = async () => {
    try {
      const { data } = await API.get("/attend/today");
      setTodayData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAction = async (action, actionName, successMsg) => {
    setLoading(prev => ({ ...prev, [actionName]: true }));
    try {
      let response;
      switch(action) {
        case 'punchIn':
          response = await API.get("/attend/punchIn");
          break;
        case 'freshStart':
          response = await API.get("/attend/freshBreakStart");
          break;
        case 'freshEnd':
          response = await API.get("/attend/freshBreakEnd");
          break;
        case 'punchOut':
          response = await API.get("/attend/punchOut");
          showSuccessMessage(`Worked: ${response.data.totalWork}`);
          break;
      }
      
      if (action !== 'punchOut') {
        showSuccessMessage(successMsg);
      }
      
      await fetchToday();
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      showSuccessMessage(`Error: Could not ${actionName}`);
    } finally {
      setLoading(prev => ({ ...prev, [actionName]: false }));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Attendance Report", 20, 20);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    doc.setFontSize(12);
    const details = [
      { label: "Punch In", value: todayData?.punchIn || "-" },
      { label: "Fresh Break Start", value: todayData?.freshBreakStart || "-" },
      { label: "Fresh Break End", value: todayData?.freshBreakEnd || "-" },
      { label: "Punch Out", value: todayData?.punchOut || "-" },
      { label: "Total Work", value: todayData?.totalWork || "-" }
    ];
    
    details.forEach((detail, index) => {
      doc.text(`${detail.label}: ${detail.value}`, 20, 70 + (index * 10));
    });
    
    doc.save(`attendance-${new Date().toISOString().split('T')[0]}.pdf`);
    showSuccessMessage("PDF Generated Successfully!");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-bg"></div>
        <div className="animated-shapes">
          <div className="shape shape1"></div>
          <div className="shape shape2"></div>
          <div className="shape shape3"></div>
        </div>
      </div>

      {/* Success Toast */}
      <div className={`success-toast ${showSuccess ? 'show' : ''}`}>
        <CheckCircle size={20} />
        <span>{successMessage}</span>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-left">
            <div className="logo-wrapper">
              <Briefcase size={32} color="#3b82f6" />
            </div>
            <div className="header-text">
              <h1 className="title">Attendance Tracker</h1>
              <p className="subtitle">Manage your work hours efficiently</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="time-card">
              <Timer size={20} />
              <div className="time-display">
                <span className="time">{formatTime(currentTime)}</span>
                <span className="date">{currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Status Card */}
        <div className="user-status-card">
          <div className="user-avatar">
            <User size={40} />
          </div>
          <div className="user-info">
            <h3>Welcome Back!</h3>
            <p>Employee ID: EMP-2024-001</p>
          </div>
          <div className="status-badge">
            <span className={`status-dot ${activeSession}`}></span>
            <span className="status-text">
              {activeSession === 'working' && 'Currently Working'}
              {activeSession === 'break' && 'On Break'}
              {activeSession === 'completed' && 'Day Completed'}
              {activeSession === 'none' && 'Not Started'}
            </span>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-item total-work">
            <div className="stat-icon-wrapper">
              <Award size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Total Work Today</span>
              <span className="stat-value-large">{todayData?.totalWork || "0h 0m"}</span>
            </div>
          </div>
          <div className="stat-item current-status">
            <div className="stat-icon-wrapper">
              <Clock size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Current Session</span>
              <span className="stat-value status-color">
                {activeSession === 'working' && 'Working'}
                {activeSession === 'break' && 'On Break'}
                {activeSession === 'completed' && 'Completed'}
                {activeSession === 'none' && 'Not Started'}
              </span>
            </div>
          </div>
        </div>

        <div className="action-center">
          <h2 className="section-title">Action Center</h2>
          
          <div className="primary-actions">
            <div 
              className={`action-card punch-in ${!todayData?.punchIn ? 'available' : 'disabled'}`}
              onClick={() => !todayData?.punchIn && handleAction('punchIn', 'punchIn', '✓ Punched In Successfully')}
              style={{ cursor: !todayData?.punchIn ? 'pointer' : 'not-allowed' }}
            >
              <div className="action-card-inner">
                <div className="action-icon-wrapper">
                  <LogIn size={32} />
                </div>
                <div className="action-content">
                  <h3>Punch In</h3>
                  <p>Start your work day</p>
                  {todayData?.punchIn && (
                    <span className="action-time">{todayData.punchIn}</span>
                  )}
                </div>
                {loading.punchIn && <div className="action-spinner"></div>}
              </div>
            </div>

            {/* Break Control Card - Split Design */}
            <div className="break-control-card">
              <div className="break-header">
                <CoffeeIcon size={24} />
                <h3>Break Time</h3>
              </div>
              <div className="break-actions">
                <button 
                  className={`break-btn start ${todayData?.freshBreakStart && !todayData?.freshBreakEnd ? 'active' : ''}`}
                  onClick={() => handleAction('freshStart', 'freshStart', '☕ Break Started')}
                  disabled={!todayData?.punchIn || todayData?.freshBreakStart || todayData?.punchOut}
                >
                  <Play size={18} />
                  Start Break
                  {todayData?.freshBreakStart && !todayData?.freshBreakEnd && (
                    <span className="break-time">{todayData.freshBreakStart}</span>
                  )}
                </button>
                <button 
                  className={`break-btn end ${todayData?.freshBreakEnd ? 'completed' : ''}`}
                  onClick={() => handleAction('freshEnd', 'freshEnd', '✓ Break Ended')}
                  disabled={!todayData?.freshBreakStart || todayData?.freshBreakEnd || todayData?.punchOut}
                >
                  <Pause size={18} />
                  End Break
                  {todayData?.freshBreakEnd && (
                    <span className="break-time">{todayData.freshBreakEnd}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Punch Out Card */}
            <div 
              className={`action-card punch-out ${todayData?.punchIn && !todayData?.punchOut ? 'available' : 'disabled'}`}
              onClick={() => todayData?.punchIn && !todayData?.punchOut && handleAction('punchOut', 'punchOut', '')}
              style={{ cursor: todayData?.punchIn && !todayData?.punchOut ? 'pointer' : 'not-allowed' }}
            >
              <div className="action-card-inner">
                <div className="action-icon-wrapper">
                  <LogOut size={32} />
                </div>
                <div className="action-content">
                  <h3>Punch Out</h3>
                  <p>End your work day</p>
                  {todayData?.punchOut && (
                    <span className="action-time">{todayData.punchOut}</span>
                  )}
                </div>
                {loading.punchOut && <div className="action-spinner"></div>}
              </div>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="secondary-actions">
            {/* Timeline Preview */}
            <div className="timeline-preview">
              <h4>Today's Timeline</h4>
              <div className="timeline-steps">
                <div className={`timeline-step ${todayData?.punchIn ? 'completed' : ''}`}>
                  <div className="step-marker">1</div>
                  <span>Punch In</span>
                  <small>{todayData?.punchIn || 'Pending'}</small>
                </div>
                <div className={`timeline-step ${todayData?.freshBreakStart ? 'completed' : ''}`}>
                  <div className="step-marker">2</div>
                  <span>Break Start</span>
                  <small>{todayData?.freshBreakStart || 'Pending'}</small>
                </div>
                <div className={`timeline-step ${todayData?.freshBreakEnd ? 'completed' : ''}`}>
                  <div className="step-marker">3</div>
                  <span>Break End</span>
                  <small>{todayData?.freshBreakEnd || 'Pending'}</small>
                </div>
                <div className={`timeline-step ${todayData?.punchOut ? 'completed' : ''}`}>
                  <div className="step-marker">4</div>
                  <span>Punch Out</span>
                  <small>{todayData?.punchOut || 'Pending'}</small>
                </div>
              </div>
            </div>

            {/* Report Generation */}
            <div className="report-card">
              <div className="report-icon">
                <FileText size={32} />
              </div>
              <div className="report-content">
                <h4>Daily Report</h4>
                <p>Download your attendance summary</p>
                <button 
                  className="report-btn"
                  onClick={generatePDF}
                  disabled={!todayData?.punchIn}
                >
                  <Download size={18} />
                  Generate PDF
                  {loading.generatePDF && <div className="btn-spinner"></div>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="quick-stats">
          <div className="quick-stat">
            <Clock size={16} />
            <span>Punch In: {todayData?.punchIn || '--:--'}</span>
          </div>
          <div className="quick-stat">
            <Coffee size={16} />
            <span>Break: {todayData?.freshBreakStart ? todayData.freshBreakStart : '--:--'}</span>
          </div>
          <div className="quick-stat">
            <LogOut size={16} />
            <span>Punch Out: {todayData?.punchOut || '--:--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}