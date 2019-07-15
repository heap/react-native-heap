export default class NavigationUtil {
  // :TODO: (jmtaber129): Add typing for this ref.
  private static heapNavRef: any;

  static setNavigationRef(ref: any): void {
    this.heapNavRef = ref;
  }

  static getScreenPropsForCurrentRoute(): {
    path: string;
    screenName: string;
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
  ): { path: string; screenName: string } {
    const route = navigationState.routes[navigationState.index];

    // Dive into nested navigators.
    if (route.routes) {
      const { path, screenName } = this.getActiveRouteProps(route);
      return {
        path: `${route.routeName}::${path}`,
        screenName: screenName,
      };
    }

    return {
      path: route.routeName,
      screenName: route.routeName,
    };
  }
}
