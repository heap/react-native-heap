package com.testdriver;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.heapanalytics.reactnative.RNHeap;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        RNHeap.init(getApplicationContext(), "11");
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TestDriver";
    }
}
