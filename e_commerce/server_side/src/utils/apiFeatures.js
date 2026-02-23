class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Search functionality
  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            { name: { $regex: this.queryStr.keyword, $options: "i" } },
            { description: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter functionality
  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing fields for category
    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter for price
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Sorting functionality
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // Pagination functionality
  pagination(resultPerPage = 10) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }

  // Get the total count
  async getTotal() {
    const total = await this.query.model.countDocuments(this.query.getFilter());
    return total;
  }
}

module.exports = APIFeatures;
