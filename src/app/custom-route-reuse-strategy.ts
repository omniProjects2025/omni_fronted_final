import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Don't detach any routes to prevent caching issues
    return false;
  }

  // Stores the detached route
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // No need to store since we're not detaching
  }

  // Determines if the route should be reattached
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Don't reattach since we're not storing
    return false;
  }

  // Retrieves the stored route
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Return null since we're not storing routes
    return null;
  }

  // Determines if the route should be reused
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Only reuse routes if they have the same route config and params
    return future.routeConfig === curr.routeConfig && 
           JSON.stringify(future.params) === JSON.stringify(curr.params) &&
           JSON.stringify(future.queryParams) === JSON.stringify(curr.queryParams);
  }

  private getRouteId(route: ActivatedRouteSnapshot): string {
    return route.routeConfig?.path || '';
  }
}
