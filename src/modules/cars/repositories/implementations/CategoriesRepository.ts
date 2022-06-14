import { Category } from '../../models/Category'
import { ICategoriesRepository, ICreateCategoryDTO } from '../ICategoriesRepository'

export class CategoriesRepository implements ICategoriesRepository {
  private categories: Category[]

  private static INSTANCE: CategoriesRepository

  private constructor() {
    this.categories = []
  }

  static getInstance(): CategoriesRepository {
    if (!this.INSTANCE) {
      this.INSTANCE = new CategoriesRepository()
    }
    return this.INSTANCE
  }

  create({ name, description }: ICreateCategoryDTO): void {
    const category = new Category()

    Object.assign(category, {
      name,
      description,
      created_at: new Date()
    })

    this.categories.push(category)
  }

  findByName(name: string): Category | undefined {
    const category = this.categories
      .find(category => category.name === name)

    return category
  }

  list(): Category[] {
    return this.categories
  }
}