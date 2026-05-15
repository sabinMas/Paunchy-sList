import nodemailer from 'nodemailer';

let transporter = null;

export const initializeEmail = () => {
  // In production, use real SMTP settings from environment
  // For development, you can use Ethereal or Gmail with app-specific password
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.warn('⚠️  Email service not configured properly:', error.message);
      console.log('Extension submissions will not send emails. Configure SMTP settings in .env');
    } else {
      console.log('✓ Email service ready');
    }
  });
};

export const sendSubmissionNotification = async (submission) => {
  if (!transporter) {
    console.warn('Email transporter not initialized');
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@paunchyslist.dev';
  const fromEmail = process.env.FROM_EMAIL || 'noreply@paunchyslist.dev';

  const emailContent = `
    <h2>New Extension Submission</h2>
    <p><strong>Name:</strong> ${submission.name}</p>
    <p><strong>Environment:</strong> ${submission.environment}</p>
    <p><strong>Category:</strong> ${submission.category}</p>
    <p><strong>Dev Type:</strong> ${submission.devtype}</p>
    <p><strong>Price:</strong> $${submission.price.toFixed(2)}</p>
    <p><strong>URL:</strong> <a href="${submission.url}">${submission.url}</a></p>
    <p><strong>Description:</strong></p>
    <p>${submission.description}</p>
    <p><strong>Submitted by:</strong> ${submission.email}</p>
    <hr>
    <p><strong>Submission ID:</strong> ${submission.id}</p>
    <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/submissions/${submission.id}">Review Submission</a></p>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject: `New Extension Submission: ${submission.name}`,
      html: emailContent
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendApprovalEmail = async (submission) => {
  if (!transporter) return false;

  const fromEmail = process.env.FROM_EMAIL || 'noreply@moralkodebat.dev';

  const emailContent = `
    <h2>Extension Approved! 🎉</h2>
    <p>Congratulations! Your extension "<strong>${submission.name}</strong>" has been approved and is now listed on the Paunchy's List Marketplace.</p>
    <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/marketplace">View on Marketplace</a></p>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: submission.email,
      subject: 'Your Extension Has Been Approved!',
      html: emailContent
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendRejectionEmail = async (submission, reason) => {
  if (!transporter) return false;

  const fromEmail = process.env.FROM_EMAIL || 'noreply@moralkodebat.dev';

  const emailContent = `
    <h2>Extension Review Result</h2>
    <p>Thank you for your submission of "<strong>${submission.name}</strong>". Unfortunately, we're unable to approve it at this time.</p>
    <p><strong>Reason:</strong></p>
    <p>${reason}</p>
    <p>Feel free to revise and resubmit your extension.</p>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: submission.email,
      subject: 'Extension Review: Update Required',
      html: emailContent
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
