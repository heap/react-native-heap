import NavigationUtil from '../navigationUtil';

describe('Navigation utilities', () => {
  describe('no ref', () => {
    describe('getScreenPropsForCurrentRoute', () => {
      beforeEach(() => {
        NavigationUtil.setNavigationRef(undefined);
      });
      it('returns null', () => {
        expect(NavigationUtil.getScreenPropsForCurrentRoute()).toBeNull();
      });
    });
  });

  describe('react-navigation v5+', () => {
    let navigationRef: any;
    beforeEach(() => {
      navigationRef = {
        getRootState: jest.fn(),
      };
      NavigationUtil.setNavigationRef(navigationRef);
    });

    describe('getScreenPropsForCurrentRoute', () => {
      it('returns null if the root state is undefined', () => {
        expect(NavigationUtil.getScreenPropsForCurrentRoute()).toBeNull();
      });

      it('returns the correct screen props for a single route', () => {
        navigationRef.getRootState.mockReturnValue({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        expect(NavigationUtil.getScreenPropsForCurrentRoute()).toEqual({
          screen_path: 'Home',
          screen_name: 'Home',
        });
      });

      it('returns the correct screen props for a nested route', () => {
        navigationRef.getRootState.mockReturnValue({
          index: 0,
          routes: [
            { name: 'Home', state: { index: 0, routes: [{ name: 'Feed' }] } },
          ],
        });
        expect(NavigationUtil.getScreenPropsForCurrentRoute()).toEqual({
          screen_path: 'Home::Feed',
          screen_name: 'Feed',
        });
      });

      it('returns the correct screen props for multiple routes', () => {
        navigationRef.getRootState.mockReturnValue({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'Settings' }],
        });
        expect(NavigationUtil.getScreenPropsForCurrentRoute()).toEqual({
          screen_path: 'Settings',
          screen_name: 'Settings',
        });
      });

      it('returns the correct screen props for multiple routes, taking into account the index', () => {
        navigationRef.getRootState.mockReturnValue({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'Settings' }, { name: 'Profile' }],
        });
        expect(NavigationUtil.getScreenPropsForCurrentRoute()).toEqual({
          screen_path: 'Settings',
          screen_name: 'Settings',
        });
      });

      it('returns the correct screen props for multiple nested routes', () => {
        navigationRef.getRootState.mockReturnValue({
          index: 1,
          routes: [
            { name: 'Profile' },
            {
              name: 'Home',
              state: {
                index: 1,
                routes: [{ name: 'Feed' }, { name: 'Messages' }],
              },
            },
          ],
        });
        expect(NavigationUtil.getScreenPropsForCurrentRoute()).toEqual({
          screen_path: 'Home::Messages',
          screen_name: 'Messages',
        });
      });
    });
  });
});
