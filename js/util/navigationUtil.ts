export default class NavigationUtil {
  // :TODO: (jmtaber129): Add typing for this ref.
  private static heapNavRef: any;

  static setNavigationRef(ref: any): void {
    this.heapNavRef = ref;
  }

  static getScreenPropsForCurrentRoute(): {
    screen_path: string;
    screen_name: string;
  } | null {
    let rootState: any = null;
    if (this.heapNavRef && this.heapNavRef.state && this.heapNavRef.state.nav) {
      rootState = this.heapNavRef.state.nav;
    } else if (this.heapNavRef && this.heapNavRef.getRootState) {
      rootState = this.heapNavRef.getRootState();
    } else {
      return null;
    }

    const routeProps = this.getActiveRouteProps(rootState);

    if (routeProps) {
      return routeProps;
    }

    return null;
  }

  static isHocEnabled(): boolean {
    return !!this.heapNavRef;
  }

  // :TODO: (jmtaber129): Add type for navigationState.
  static getActiveRouteProps(
    navigationState: any
  ): { screen_path: string; screen_name: string } {
    const paths = this.getActiveRouteNames(navigationState);
    return {
      screen_path: paths.join('::'),
      screen_name: paths[paths.length - 1],
    };
  }

  // Returns an array of route names, with the root name first, and the most nested name last.
  private static getActiveRouteNames(navigationState: any): Array<string> {
    const route = navigationState.routes[navigationState.index];

    // Dive into nested navigators.
    let paths;
    if (route.routes) {
      paths = this.getActiveRouteNames(route);
    } else if (route.state && route.state.routes) {
      paths = this.getActiveRouteNames(route.state);
    }

    const routeName = route.routeName || route.name;

    if (paths) {
      return [routeName].concat(paths);
    }

    return [routeName];
  }
}
