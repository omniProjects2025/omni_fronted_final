import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  // Determines if the route should be stored
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Store the home route to prevent reinitialization
    return route.routeConfig?.path === '';
  }

  // Stores the detached route
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    const id = this.getRouteId(route);
    if (handle) {
      this.storedRoutes.set(id, handle);
    }
  }

  // Determines if the route should be reattached
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const id = this.getRouteId(route);
    return this.storedRoutes.has(id);
  }

  // Retrieves the stored route
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const id = this.getRouteId(route);
    return this.storedRoutes.get(id) || null;
  }

  // Determines if the route should be reused
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteId(route: ActivatedRouteSnapshot): string {
    return route.routeConfig?.path || '';
  }
}
