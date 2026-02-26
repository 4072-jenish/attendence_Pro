import { useState, useEffect } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, Shield } from "lucide-react";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const navigate = useNavigate();

  // Update time for live clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes('@')) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      
      // Show success animation before redirect
      setLoading(false);
      document.querySelector('.login-card').classList.add('success');
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (err) {
      setLoading(false);
      setError("Invalid email or password");
      
      // Shake animation on error
      document.querySelector('.login-card').classList.add('shake');
      setTimeout(() => {
        document.querySelector('.login-card')?.classList.remove('shake');
      }, 500);
    }
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
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="gradient-sphere"></div>
        <div className="animated-grid">
          <div className="grid-line"></div>
          <div className="grid-line"></div>
          <div className="grid-line"></div>
          <div className="grid-line"></div>
        </div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="login-wrapper">
        {/* Brand Side */}
        <div className="brand-side">
          <div className="brand-content">
            <div className="brand-logo">
              <Briefcase size={48} />
              <Shield size={48} className="logo-shield" />
            </div>
            <h1 className="brand-title">Attendance Pro</h1>
            <p className="brand-subtitle">Smart attendance tracking for modern workplaces</p>
            
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Real-time tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Automated reports</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Break management</span>
              </div>
            </div>

            <div className="live-clock">
              <div className="clock-icon">🕒</div>
              <div className="clock-time">{formatTime(currentTime)}</div>
              <div className="clock-date">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Login Side */}
        <div className="login-side">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Please enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className={`input-group ${emailFocused ? 'focused' : ''} ${error && !email ? 'error' : ''}`}>
                <div className="input-icon">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  disabled={loading}
                />
                <div className="input-border"></div>
              </div>

              <div className={`input-group ${passwordFocused ? 'focused' : ''} ${error && !password ? 'error' : ''}`}>
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  disabled={loading}
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <div className="input-border"></div>
              </div>

              {error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}

              <div className="form-options">
                <label className="remember-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                className={`login-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="loader"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} className="button-icon" />
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>Demo credentials:</p>
              <div className="demo-creds">
                <span>admin@company.com</span>
                <span>••••••••</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}