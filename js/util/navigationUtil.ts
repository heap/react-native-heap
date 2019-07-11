export default class NavigationUtil {
  static getActiveRouteName(navigationState: any): any {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return `${route.routeName}::${this.getActiveRouteName(route)}`;
    }

    return route.routeName;
  };
}
