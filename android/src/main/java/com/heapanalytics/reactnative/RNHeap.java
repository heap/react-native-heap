package com.heapanalytics.reactnative;

import android.content.Context;
import com.heapanalytics.android.Heap;
import com.heapanalytics.android.config.Options;
import com.heapanalytics.android.internal.HeapImpl;

public class RNHeap {
    public static void init(Context context, String appId) {
        HeapImpl.skipInstrumentorChecks = true;
        Options options = new Options().debug();
        Heap.init(context, appId, options);
    }
}
