import Route from '@ioc:Adonis/Core/Route'
import { capitalize } from './string';

/**
 * custom resource function
 *
 * @param route
 * @param controller
 * @param middleware
 * @param isProcessOpen
 * @param isGetOpen
 */
function resource(routes, controller, middleware = [], isProcessOpen = false, isGetOpen = true, paramName = 'id', prefix, as) {
    const routesGet = routes.filter(route => route?.method === 'get');
    const routesPost = routes.filter(route => route?.method === 'post');
    const routesUpdate = routes.filter(route => route?.method === 'patch' || route?.method === 'put');
    const routesDelete = routes.filter(route => route?.method === 'delete');
    if (isGetOpen) {
        if(routesGet.length > 0) {
          routesGet.forEach(route => {
            if(!route.isParam) {
              Route.get(`${prefix}/${route?.name}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).as(prefix.replace('/', `get.${route?.name}.`));
            } else {
              Route.get(`${prefix}/${route?.name}/:${paramName}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).as(prefix.replace('/', `get.${route?.name}.`));
            }
          });
          Route.get(`${prefix}`, `${controller}.index`).as(prefix.replace('/', 'index.'));
          Route.get(`${prefix}/:${paramName}`, `${controller}.show`).as(prefix.replace('/', 'show.'));
        } else {
          Route.get(`${prefix}`, `${controller}.index`).as(prefix.replace('/', 'index.'));
          Route.get(`${prefix}/:${paramName}`, `${controller}.show`).as(prefix.replace('/', 'show.'));
        }
    } else {
        if(routesGet.length > 0) {
          routesGet.forEach(route => {
            let middlewareRoute = route?.middleware?.length > 0 ? route?.middleware : middleware;
            if(route.isParam) {
              if(route?.name) {
                Route.get(`${prefix}/${route?.name}/:${paramName}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).middleware(middlewareRoute).as(prefix.replace('/', `index.${route?.name}.`));
              } else {
                Route.get(`${prefix}/:${paramName}`, `${controller}.show`).middleware(middlewareRoute).as(prefix.replace('/', 'show.'));
              }
            } else {
              if(route?.name) {
                Route.get(`${prefix}/${route?.name}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).middleware(middlewareRoute).as(prefix.replace('/', `index.${route?.name}.`));
              } else {
                Route.get(`${prefix}`, `${controller}.index`).middleware(middlewareRoute).as(prefix.replace('/', 'index.'));
              }
            }
          });
          Route.get(`${prefix}`, `${controller}.index`).middleware(middleware).as(prefix.replace('/', 'index.'));
          Route.get(`${prefix}/:${paramName}`, `${controller}.show`).middleware(middleware).as(prefix.replace('/', 'show.'));
        } else {
          Route.get(`${prefix}`, `${controller}.index`).middleware(middleware).as(prefix.replace('/', 'index.'));
          Route.get(`${prefix}/:${paramName}`, `${controller}.show`).middleware(middleware).as(prefix.replace('/', 'show.'));
        }
    }
  
    if (isProcessOpen) {

        if(routesPost.length > 0) {
            routesPost.forEach(route => {
                // Route.post(`${prefix}/${route?.name}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).as(prefix.replace('/', `${route?.name}`));
            })
        }
        Route.post(`${prefix}`, `${controller}.store`).as(prefix.replace('/', 'store.'));

        if(routesUpdate.length > 0) {
            routesUpdate.forEach(route => {
                if(!route.isParam) {
                  Route.patch(`${prefix}/${route?.name}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).as(prefix.replace('/', `patch.${route?.name}.`));
                } else {
                  Route.patch(`${prefix}/${route?.name}/:${paramName}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).as(prefix.replace('/', `patch.${route?.name}.`));
                }
            })
        }
        // Route.put(`${route}/:${paramName}`, `${controller}.update`).as(route.replace('/', 'update'));
        Route.patch(`${prefix}/:${paramName}`, `${controller}.update`).as(prefix.replace('/', 'update.'));

        Route.delete(`${prefix}/:${paramName}`, `${controller}.destroy`).as(prefix.replace('/', 'destroy.'));
    } else {

        if(routesPost.length > 0) {
            routesPost.forEach(route => {
                let middlewareRoute = route?.middleware?.length > 0 ? route?.middleware : middleware;
                if(route.isParam) {
                  if(route?.name) {
                    Route.post(`${prefix}/${route?.name}/:${paramName}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).middleware(middlewareRoute).as(prefix.replace('/', `post.${route?.name}.`));
                  } else {
                    Route.post(`${prefix}/:${paramName}`, `${controller}.store`).middleware(middlewareRoute).as(prefix.replace('/', 'store.'));
                  }
                } else {
                  if(route?.name) {
                    Route.post(`${prefix}/${route?.name}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).middleware(middlewareRoute).as(prefix.replace('/', `post.${route?.name}.`));
                  } else {
                    Route.post(`${prefix}`, `${controller}.store`).middleware(middlewareRoute).as(prefix.replace('/', 'store.'));
                  }
                }
            })
            Route.post(`${prefix}`, `${controller}.store`).middleware(middleware).as(prefix.replace('/', 'store.'));
        } else {
          Route.post(`${prefix}`, `${controller}.store`).middleware(middleware).as(prefix.replace('/', 'store.'));
        }

        if(routesUpdate.length > 0) {
            routesUpdate.forEach(route => {
                let middlewareRoute = route?.middleware?.length > 0 ? route?.middleware : middleware;
                if(!route.isParam) {
                  if(route?.name) {
                    Route.patch(`${prefix}/${route?.name}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).middleware(middlewareRoute).as(prefix.replace('/', `patch.${route?.name}.`));
                  } else {
                    Route.patch(`${prefix}`, `${controller}.update`).middleware(middleware).as(prefix.replace('/', 'update.'));
                  }
                } else {
                  if(route?.name) {
                    Route.patch(`${prefix}/${route?.name}/:${paramName}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).middleware(middlewareRoute).as(prefix.replace('/', `patch.${route?.name}.`));
                  } else {
                    Route.patch(`${prefix}/:${paramName}`, `${controller}.update`).middleware(middlewareRoute).as(prefix.replace('/', 'update.'));
                  }
                }
            })
            // Route.get(`${prefix}`, `${controller}.index`).middleware(middleware).as(prefix.replace('/', 'index.'));
            Route.patch(`${prefix}`, `${controller}.update`).middleware(middleware).as(prefix.replace('/', 'update.'));
            // Route.patch(`${prefix}/:${paramName}`, `${controller}.update`).middleware(middleware).as(prefix.replace('/', 'update.'));
        } else {
          // Route.put(`${route}/:${paramName}`, `${controller}.update`).middleware(middleware).as(route.replace('/', 'update'));
          Route.patch(`${prefix}/:${paramName}`, `${controller}.update`).middleware(middleware).as(prefix.replace('/', 'update.'));
        }
        
        if(routesDelete.length > 0) {
          routesDelete.forEach(route => {
              let middlewareRoute = route?.middleware?.length > 0 ? route?.middleware : middleware;
              if(!route.isParam) {
                Route.delete(`${prefix}/${route?.name}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).middleware(middlewareRoute).as(prefix.replace('/', `destroy.${route?.name}.`));
              } else {
                Route.delete(`${prefix}/${route?.name}:${paramName}`, `${controller}.${route?.action ? route?.action : route?.name + capitalize(route?.method)}`).middleware(middlewareRoute).as(prefix.replace('/', `destroy.${route?.name}`));
              }
              // Route.delete(`${prefix}/:${paramName}`, `${controller}.destroy`).middleware(middlewareRoute).as(prefix.replace('/', 'destroy.'));
          })
        } else {
          Route.delete(`${prefix}/:${paramName}`, `${controller}.destroy`).middleware(middleware).as(prefix.replace('/', 'destroy.'));
        }
    }
  
}

export {
    resource
}