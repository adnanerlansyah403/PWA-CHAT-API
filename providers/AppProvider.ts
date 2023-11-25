import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    
    // Extending Query Builders
    const {
      DatabaseQueryBuilder
    } = this.app.container.use('Adonis/Lucid/Database')
    DatabaseQueryBuilder.macro('getCount', async function () {
      const result = await this.count('* as total')
      return BigInt(result[0].total)
    })
    DatabaseQueryBuilder.macro('withoutColumns', async function (excludedColumns: string[]) {
      const data = await this.returning('*');
      const filteredData = data.map((item) => {
        const filteredItem = Object.entries(item).reduce((result, [key, value]) => {
          if (!excludedColumns.includes(key)) {
            result[key] = value;
          }
          return result;
        }, {});
      
        return filteredItem;
      });
      return filteredData;
    })

    const {
      InsertQueryBuilder
    } = this.app.container.use('Adonis/Lucid/Database')
    InsertQueryBuilder.macro('withoutColumns', async function (excludedColumns: string[]) {
      const data = await this.returning('*');
      const filteredData = data.map((item) => {
        const filteredItem = Object.entries(item).reduce((result, [key, value]) => {
          if (!excludedColumns.includes(key)) {
            result[key] = value;
          }
          return result;
        }, {});
      
        return filteredItem;
      });
      return filteredData;
    })
    InsertQueryBuilder.macro('withData', async function (excludedColumns: string[]) {
      const data = await this.returning('*');
      return data[0];
    })
    
    // Extending Response Class
    const Response = this.app.container.use('Adonis/Core/Response')

    Response.macro('success', function (data, message = "") {
      this.ctx!.response.send({
        status: true,
        message: message,
        data: data ?? null
      });
      return this
    })
    
    Response.macro('error', function (message, statusCode = 400) {
      this.ctx!.response.status(statusCode).send({
        status: false,
        message: message,
        data: null
      });
      return this
    })
  }

  public async ready () {
    if (this.app.environment === 'web') {
      await import('../start/socket')
    }
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
  
}
