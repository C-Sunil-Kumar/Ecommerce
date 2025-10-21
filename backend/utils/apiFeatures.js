class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        this.query = this.query.find({ ...keyword });
        return this;
    }

   filter(){
        const queryStrCopy = { ...this.queryStr };
        // Removing fields from the query
        const removeFields = ['keyword', 'page', 'limit'];
        removeFields.forEach(field => delete queryStrCopy[field]);

        // Filter for price and rating
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(queryStr));
        return this;
   }
    
   paginate(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query.limit(resultPerPage).skip(skip);
        return this;
   }

}

module.exports = ApiFeatures;