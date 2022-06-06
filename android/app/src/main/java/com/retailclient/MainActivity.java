package com.retailclient;

import com.facebook.react.ReactActivity;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "RetailClient";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.allowRTL(context, true);
    super.onCreate(null);
  }
}
