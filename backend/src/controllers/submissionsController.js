import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync, waitForDb } from '../config/database.js';
import { sendSubmissionNotification } from '../config/email.js';

// Validate submission data
const validateSubmission = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Extension name must be at least 3 characters');
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  if (!data.environment) {
    errors.push('Environment is required');
  }
  if (!data.category) {
    errors.push('Category is required');
  }
  if (!data.devtype) {
    errors.push('Developer type is required');
  }
  if (data.price === undefined || data.price === null || isNaN(parseFloat(data.price))) {
    errors.push('Valid price is required');
  }
  if (!data.url || !isValidUrl(data.url)) {
    errors.push('Valid URL is required');
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  return errors;
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Submit new extension
export const submitExtension = async (req, res) => {
  try {
    await waitForDb();
    const { name, description, environment, category, devtype, price, url, email } = req.body;

    // Validate submission
    const errors = validateSubmission(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors
      });
    }

    // Check if URL already exists
    const existing = await getAsync(
      'SELECT id FROM extensions WHERE url = ?',
      [url]
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'An extension with this URL already exists'
      });
    }

    const id = uuidv4();
    const icon = req.body.icon || '📦';

    await runAsync(
      `INSERT INTO submissions (id, name, description, environment, category, devtype, price, url, icon, email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description, environment, category, devtype, parseFloat(price), url, icon, email]
    );

    const submission = await getAsync(
      'SELECT * FROM submissions WHERE id = ?',
      [id]
    );

    // Send notification email to admin
    await sendSubmissionNotification(submission);

    res.status(201).json({
      success: true,
      message: 'Extension submitted successfully! We\'ll review it and send you an email with the result.',
      data: {
        id,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error submitting extension:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit extension'
    });
  }
};

// Get submission status
export const getSubmissionStatus = async (req, res) => {
  try {
    await waitForDb();
    const { id } = req.params;

    const submission = await getAsync(
      'SELECT id, name, status, email, created_at, reviewed_at FROM submissions WHERE id = ?',
      [id]
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submission'
    });
  }
};

// Get recent submissions (public - shows only count and status)
export const getRecentSubmissions = async (req, res) => {
  try {
    await waitForDb();
    const submissions = await allAsync(
      'SELECT id, name, status, created_at FROM submissions ORDER BY created_at DESC LIMIT 10'
    );

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
};
