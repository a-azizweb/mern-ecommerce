class ApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: 'i',
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    //filter for category
    const queryCopy = { ...this.queryString };

    //   Removing some fields for category
    const removeFields = ['keyword', 'page', 'limit'];

    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // filter for category ends here
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(productsPerpage) {
    //geting page from the url queryString
    const currentpage = this.queryString.page || 1;

    //skipping products of previous page
    const skip = productsPerpage * (currentpage - 1);

    //returning products of next page (adding limits of products)
    this.query = this.query.limit(productsPerpage).skip(skip);
    return this;
  }
}

module.exports = ApiFeature;
