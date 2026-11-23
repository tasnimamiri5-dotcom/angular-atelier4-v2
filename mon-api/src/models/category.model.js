
const pool = require('../config/db');

/**
 * Find all categories ordered by name
 */

/**
 * Find all categories with products count
 */
const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT
      c.*,
      COUNT(p.id) AS products_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id
    ORDER BY c.name ASC
  `);

  return rows;
};


/**
 * Find a category by id
 */
const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );

  return rows[0] || null;
};

/**
 * Create a new category
 */
const create = async (name) => {
  const [result] = await pool.query(
    'INSERT INTO categories (name) VALUES (?)',
    [name]
  );

  return findById(result.insertId);
};

/**
 * Update a category
 */
const update = async (id, name) => {
  await pool.query(
    'UPDATE categories SET name = ? WHERE id = ?',
    [name, id]
  );

  return findById(id);
};

/**
 * Check if category has products
 */
const hasProducts = async (id) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM products WHERE category_id = ?',
    [id]
  );

  return rows[0].total > 0;
};


/**
 * Delete a category
 */
const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  hasProducts,
  create,
  update,
  remove,
};
