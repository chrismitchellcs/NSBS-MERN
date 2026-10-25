const { request } = require("./phpPosClient");

/**
 * POST /categories (OpenAPI: addCategory, NewCategoryWithImageUrl).
 * @param {object} payload e.g. { name, color, category_info_popup, hide_from_grid, parent_id, image_url }
 */
async function createCategory(payload) {
  return request("post", "/categories", payload);
}

module.exports = {
  createCategory,
};
