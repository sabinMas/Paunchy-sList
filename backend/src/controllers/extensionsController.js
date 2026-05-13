import { allAsync, getAsync } from '../config/database.js';

// Get all extensions with optional filtering
export const getExtensions = async (req, res) => {
  try {
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

    const extensions = await allAsync(sql, params);

    res.json({
      success: true,
      data: extensions,
      count: extensions.length
    });
  } catch (error) {
    console.error('Error fetching extensions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch extensions'
    });
  }
};

// Get single extension by ID
export const getExtensionById = async (req, res) => {
  try {
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
  try {
    const environments = await allAsync(
      'SELECT DISTINCT environment FROM extensions ORDER BY environment'
    );
    const devtypes = await allAsync(
      'SELECT DISTINCT devtype FROM extensions ORDER BY devtype'
    );
    const categories = await allAsync(
      'SELECT DISTINCT category FROM extensions ORDER BY category'
    );

    res.json({
      success: true,
      data: {
        environments: environments.map(e => e.environment),
        devtypes: devtypes.map(d => d.devtype),
        categories: categories.map(c => c.category)
      }
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch filters'
    });
  }
};

// Get statistics
export const getStats = async (req, res) => {
  try {
    const stats = await getAsync(`
      SELECT
        COUNT(*) as totalExtensions,
        COUNT(DISTINCT environment) as environments,
        COUNT(DISTINCT devtype) as devTypes,
        COUNT(DISTINCT category) as categories
      FROM extensions
    `);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};
