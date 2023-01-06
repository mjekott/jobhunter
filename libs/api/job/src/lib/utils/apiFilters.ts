import { Query } from 'mongoose'

export class ApiFilters {
  constructor(public query: Query<unknown, unknown>, public queryStr: { [key: string]: string }) {
    this.query = query
    this.queryStr = queryStr
  }

  filter() {
    const queryCopy = { ...this.queryStr }

    //removing fields from query
    const removeFields = ['sort', 'limit', 'fields', 'search', 'page']
    removeFields.forEach((el) => delete queryCopy[el])

    // append $ to lt,lte,gt,gte filters
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query.sort('-createdAt')
    }
    return this
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    }
    return this
  }

  searchByQuery() {
    if (this.queryStr.search) {
      const search = this.queryStr.search.split('-').join(' ')
      console.log(search)
      this.query = this.query.find({ $text: { $search: '"' + search + '"' } })
    }

    return this
  }

  pagination() {
    const page = parseInt(this.queryStr.page, 10) || 1
    const limit = parseInt(this.queryStr.limit, 10) || 10
    const skipResults = (page - 1) * limit
    this.query = this.query.skip(skipResults).limit(limit)
    return this
  }
}
