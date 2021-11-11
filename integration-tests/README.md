# Integration tests

These tests exercise a variety of user interactions and validate the results passed to mock web servers, included in tests/util/server.ts.

Assuming there are no breaking source and component changes between ReactNative releases, the goal is to eventually run these tests against
multiple versions of ReactNative.  This is why tests and src live outside of the actual test driver.  When `test.sh` is run, those
directories are rsynced into the driver, built and executed.

## Dependencies

`test.sh` requires a macOS device and have paths hardcoded assuming a standard macOS file system layout.  If you are just running Android
tests, you could probably execute the appropriate steps on a Linux or Windows device and arrive at working tests, but it is not guaranteed.

Other dependencies:

- Android Studio, installed as `/Applications/Android Studio.app`
- Xcode with command line tools installed.
- xcpretty
- node and npm

## Running the tests

Run `test.sh`

## Developing new tests

1. Run `test.sh` once to sync the tests into the test driver and bootstrap everything.
2. Edit tests and src from inside drivers/TestDriver063.
3. Run your tests using `npx detox build` and `npx detox test`.
3. Use `rsync src tests ../../` to get the tests back in the source controlled folder.
4. Commit your changes.

You may be able to simplify things by hard linking the src and tests directories with the driver folder, but I haven't tried that out.
There may also be something I missed that will allow softlinks to work, but I've not done that successfully.
