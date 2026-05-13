import { useState } from 'react';
import { submissionsAPI } from '../utils/api';

export default function Submit({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    environment: '',
    category: '',
    devtype: 'fullstack',
    price: '0',
    url: '',
    email: '',
    icon: '📦'
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessage(null);
    setSubmitting(true);

    try {
      const response = await submissionsAPI.submit(formData);

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: response.data.message
        });
        setFormData({
          name: '',
          description: '',
          environment: '',
          category: '',
          devtype: 'fullstack',
          price: '0',
          url: '',
          email: '',
          icon: '📦'
        });
        setTimeout(() => {
          onNavigate('marketplace');
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: response.data.error || 'Submission failed'
        });
        if (response.data.errors) {
          setErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to submit extension. Please try again.'
      });
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="form-header">
        <div className="container">
          <div className="form-container">
            <h1>Submit Your Extension</h1>
            <p className="section-subtitle">Add your extension to the Paunchy'sList marketplace</p>
          </div>
        </div>
      </div>

      <div className="form-page">
        <div className="container">
          <div className="form-container">
            <div className="form-card">
              {message && (
                <div className={`form-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              {errors.length > 0 && (
                <div className="form-message error">
                  <strong>Please fix the following errors:</strong>
                  <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                    {errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Extension Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="e.g., Live Server"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description *
                  </label>
                  <p className="form-hint">
                    Provide a clear description of what your extension does
                  </p>
                  <textarea
                    id="description"
                    name="description"
                    className="form-textarea"
                    placeholder="Describe your extension's key features and benefits..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="environment">
                    Environment *
                  </label>
                  <select
                    id="environment"
                    name="environment"
                    className="form-select"
                    value={formData.environment}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select environment...</option>
                    <option value="vscode">VS Code</option>
                    <option value="jetbrains">JetBrains</option>
                    <option value="unreal">Unreal Engine</option>
                    <option value="browser">Browser</option>
                    <option value="ai">AI Agent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="category">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="productivity">Productivity</option>
                    <option value="testing">Testing</option>
                    <option value="ai">AI</option>
                    <option value="themes">Themes</option>
                    <option value="debugging">Debugging</option>
                    <option value="languages">Languages</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="devtype">
                    Developer Type *
                  </label>
                  <select
                    id="devtype"
                    name="devtype"
                    className="form-select"
                    value={formData.devtype}
                    onChange={handleChange}
                    required
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Fullstack</option>
                    <option value="devops">DevOps</option>
                    <option value="gamedev">Game Dev</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="price">
                    Price *
                  </label>
                  <p className="form-hint">Enter 0 for free extensions</p>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="url">
                    Download / Install URL *
                  </label>
                  <p className="form-hint">
                    Link to the extension's marketplace or installation page
                  </p>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    className="form-input"
                    placeholder="https://marketplace.visualstudio.com/items?itemName=..."
                    value={formData.url}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="icon">
                    Icon / Emoji
                  </label>
                  <p className="form-hint">Single emoji or 2-3 char symbol representing your extension</p>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    className="form-input"
                    maxLength="3"
                    placeholder="📦"
                    value={formData.icon}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Your Email *
                  </label>
                  <p className="form-hint">We'll send you updates about your submission</p>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onNavigate('marketplace')}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Extension'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
