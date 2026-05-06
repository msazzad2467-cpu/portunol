package com.portunolplus

import android.os.Bundle
import android.widget.RelativeLayout
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Create root layout programmatically for demonstration
        val rootLayout = RelativeLayout(this)
        setContentView(rootLayout)

        // Initialize Unity Ads (Test Mode: true)
        UnityAdsManager.init(this, "1234567", true)

        // Load and display banner at the bottom
        UnityAdsManager.loadBanner(this, rootLayout)
        
        // Note: You can call UnityAdsManager.showInterstitial(this) or 
        // UnityAdsManager.showRewarded(this) { /* grant reward */ } from user actions
    }
}
