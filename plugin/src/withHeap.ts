import type { ConfigPlugin } from '@expo/config-plugins';
import { AndroidConfig, withStringsXml } from '@expo/config-plugins';

const WithHeap: ConfigPlugin = (expoConfig) => 
  withStringsXml(expoConfig, (modConfig) => {
    if (!expoConfig?.android?.package) { 
      console.warn('Please manually update strings.xml with the android package name.')
      return modConfig;
    }
    modConfig.modResults = AndroidConfig.Strings.setStringItem([{
      _: expoConfig.android?.package as string,
      $: {
        
        name: 'com.heapanalytics.android.buildConfigPkgName',
        translatable: 'false',

      }
    }],
    modConfig.modResults
    )
    return modConfig;
  })
  export default WithHeap;