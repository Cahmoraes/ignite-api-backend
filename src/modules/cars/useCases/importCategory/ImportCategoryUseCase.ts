import fs from 'fs'
import { parse as csvParse } from 'csv-parse'
import { CategoriesRepository } from '../../repositories/implementations/CategoriesRepository'

interface IImportCategory {
  name: string
  description: string
}

export class ImportCategoryUseCase {

  constructor(
    private categoriesRepository: CategoriesRepository
  ) { }

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path)
      const categories: IImportCategory[] = []

      const parseFile = csvParse()

      stream.pipe(parseFile)

      parseFile.on("data", async (line) => {
        const [name, description] = line

        categories.push({
          name, description
        })
      })
        .on('end', () => {
          resolve(categories)
        })
        .on('error', (err) => {
          fs.promises.unlink(file.path)
          reject(err)
        })
    })
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file)
    console.log(categories)

    categories.map(async ({ name, description }) => {
      const existCategory = this.categoriesRepository.findByName(name)

      if(!existCategory) {
        this.categoriesRepository.create({
          name, description
        })
      }
    })
  }
}