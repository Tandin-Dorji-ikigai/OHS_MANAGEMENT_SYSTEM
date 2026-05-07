const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
};

const getPagingData = (count, page, limit) => ({
  totalItems: count,
  totalPages: Math.ceil(count / limit),
  currentPage: page,
  pageSize: limit
});

module.exports = {
  getPagination,
  getPagingData
};
