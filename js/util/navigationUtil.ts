export default class NavigationUtil {
  // :TODO: (jmtaber129): Add typing for this ref.
  private static heapNavRef: any;

  static setNavigationRef(ref: any): void {
    this.heapNavRef = ref;
  }

  static getScreenPropsForCurrentRoute(): {
    path: string;
    screen_name: string;
  } | null {
    if (
      !(this.heapNavRef && this.heapNavRef.state && this.heapNavRef.state.nav)
    ) {
      return null;
    }

    const routeProps = this.getActiveRouteProps(this.heapNavRef.state.nav);

    if (routeProps) {
      return routeProps;
    }

    return null;
  }

  // :TODO: (jmtaber129): Add type for navigationState.
  static getActiveRouteProps(
    navigationState: any
  ): { path: string; screen_name: string } {
    const paths = this.getActiveRouteNames(navigationState);
    return {
      path: paths.join('::'),
      screen_name: paths[paths.length - 1],
    };
  }

  // Returns an array of route names, with the root name first, and the most nested name last.
  private static getActiveRouteNames(navigationState: any): Array<string> {
    const route = navigationState.routes[navigationState.index];

    // Dive into nested navigators.
    if (route.routes) {
      const paths = this.getActiveRouteNames(route);
      return [route.routeName].concat(paths);
    }

    return [route.routeName];
  }
}
