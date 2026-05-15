import { allAsync, getAsync, runAsync, waitForDb } from '../config/database.js';

// Get all extensions with optional filtering
export const getExtensions = async (req, res) => {
  console.log('[getExtensions] Request received', { query: req.query });

  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error('[getExtensions] Request timeout after 20 seconds');
      res.status(504).json({
        success: false,
        error: 'Request timeout - database query taking too long'
      });
    }
  }, 20000);

  try {
    await waitForDb();
    const { environment, devtype, category } = req.query;

    let sql = 'SELECT * FROM extensions ORDER BY created_at DESC';
    const params = [];

    const conditions = [];
    if (environment) {
      conditions.push('environment = ?');
      params.push(environment);
    }
    if (devtype) {
      conditions.push('devtype = ?');
      params.push(devtype);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      sql = `SELECT * FROM extensions WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
    }

    console.log('[getExtensions] Querying database with:', { sql: sql.substring(0, 100), paramCount: params.length });
    const extensions = await allAsync(sql, params);
    console.log('[getExtensions] Query successful, found', extensions?.length || 0, 'extensions');

    clearTimeout(timeout);

    res.json({
      success: true,
      data: extensions,
      count: extensions.length
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('[getExtensions] Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch extensions',
      details: error.message
    });
  }
};

// Get single extension by ID
export const getExtensionById = async (req, res) => {
  try {
    await waitForDb();
    const { id } = req.params;
    const extension = await getAsync(
      'SELECT * FROM extensions WHERE id = ?',
      [id]
    );

    if (!extension) {
      return res.status(404).json({
        success: false,
        error: 'Extension not found'
      });
    }

    res.json({
      success: true,
      data: extension
    });
  } catch (error) {
    console.error('Error fetching extension:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch extension'
    });
  }
};

// Get available filters for UI
export const getFilters = async (req, res) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error('[getFilters] Request timeout after 15 seconds');
      res.status(504).json({
        success: false,
        error: 'Request timeout'
      });
    }
  }, 15000);

  try {
    console.log('[getFilters] Request received');
    await waitForDb();
    console.log('[getFilters] Database ready, fetching filters');

    // Run all three queries in parallel for speed
    const [environments, devtypes, categories] = await Promise.all([
      allAsync('SELECT DISTINCT environment FROM extensions ORDER BY environment'),
      allAsync('SELECT DISTINCT devtype FROM extensions ORDER BY devtype'),
      allAsync('SELECT DISTINCT category FROM extensions ORDER BY category')
    ]);

    console.log('[getFilters] Found', environments.length, 'environments,', devtypes.length, 'devtypes,', categories.length, 'categories');

    clearTimeout(timeout);

    res.json({
      success: true,
      data: {
        environments: environments.map(e => e.environment),
        devtypes: devtypes.map(d => d.devtype),
        categories: categories.map(c => c.category)
      }
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('[getFilters] Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch filters',
      details: error.message
    });
  }
};

// Get statistics
export const getStats = async (req, res) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error('getStats request timeout');
      res.status(504).json({
        success: false,
        error: 'Request timeout'
      });
    }
  }, 25000);

  try {
    await waitForDb();
    const stats = await getAsync(`
      SELECT
        COUNT(*) as totalExtensions,
        COUNT(DISTINCT environment) as environments,
        COUNT(DISTINCT devtype) as devTypes,
        COUNT(DISTINCT category) as categories
      FROM extensions
    `);

    const visitors = await getAsync(`
      SELECT total_visits FROM visitors WHERE id = 1
    `);

    clearTimeout(timeout);

    res.json({
      success: true,
      data: {
        ...stats,
        visitors: visitors?.total_visits || 0
      }
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};

// Increment visitor count
export const incrementVisitors = async (req, res) => {
  try {
    await waitForDb();
    await runAsync(`
      UPDATE visitors SET total_visits = total_visits + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `);

    const visitors = await getAsync(`
      SELECT total_visits FROM visitors WHERE id = 1
    `);

    res.json({
      success: true,
      data: {
        visitors: visitors?.total_visits || 0
      }
    });
  } catch (error) {
    console.error('Error incrementing visitors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update visitor count'
    });
  }
};

// Chat with Cerebras AI (secure backend proxy)
export const chatWithCerebras = async (req, res) => {
  try {
    const apiKey = process.env.CEREBRAS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Cerebras API key not configured on server'
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }

    const systemPrompt = `You are an expert extension recommendation assistant for Paunchy's List, a comprehensive platform for discovering developer tools and extensions across VS Code, JetBrains, Unreal Engine, Browsers, and AI platforms.

Your role is to:
1. Understand the user's development workflow, languages, tools, and pain points
2. Ask clarifying questions to understand their specific needs
3. Recommend the most suitable extensions from Paunchy's List
4. Explain why each extension is a good fit for their use case
5. When recommending extensions, provide their names and what environments they're available in

Available categories: productivity, testing, ai, themes, debugging, languages
Available environments: VS Code, JetBrains, Unreal Engine, Browser, AI Agent

Start by greeting the user and asking about their development background (languages, frameworks, tools they use). Then progressively understand their pain points and recommend extensions.

Be conversational, friendly, and genuinely helpful. Ask follow-up questions to make targeted recommendations. When recommending, be specific about which extension solves which problem.`;

    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages
        ],
        max_tokens: 1024,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cerebras API error:', errorData);
      return res.status(response.status).json({
        success: false,
        error: errorData.error?.message || 'Cerebras API error'
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    res.json({
      success: true,
      data: {
        message: assistantMessage
      }
    });
  } catch (error) {
    console.error('Error calling Cerebras API:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat request'
    });
  }
};
