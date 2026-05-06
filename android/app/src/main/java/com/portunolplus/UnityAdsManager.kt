package com.portunolplus

import android.app.Activity
import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.RelativeLayout
import com.unity3d.ads.*
import com.unity3d.services.ads.UnityAdsShowOptions
import com.unity3d.services.banners.BannerErrorInfo
import com.unity3d.services.banners.BannerView
import com.unity3d.services.banners.UnityBannerSize

object UnityAdsManager {
    private const val TAG = "UnityAdsManager"
    
    private var gameId = "1234567"
    private var testMode = true
    
    // Placement IDs
    private const val BANNER_ID = "Banner_Android"
    private const val INTERSTITIAL_ID = "Interstitial_Android"
    private const val REWARDED_ID = "Rewarded_Android"

    private var bannerView: BannerView? = null

    fun init(context: Context, gameId: String, testMode: Boolean) {
        this.gameId = gameId
        this.testMode = testMode
        
        UnityAds.initialize(context, gameId, testMode, object : IUnityAdsInitializationListener {
            override fun onInitializationComplete() {
                Log.d(TAG, "Unity Ads Initialization Complete")
                loadInterstitial()
                loadRewarded()
            }

            override fun onInitializationFailed(error: UnityAds.UnityAdsInitializationError?, message: String?) {
                Log.e(TAG, "Unity Ads Initialization Failed: $message")
            }
        })
    }

    // --- BANNERS ---
    fun loadBanner(activity: Activity, rootLayout: ViewGroup) {
        if (bannerView != null) {
            rootLayout.removeView(bannerView)
        }

        bannerView = BannerView(activity, BANNER_ID, UnityBannerSize(320, 50))
        bannerView?.listener = object : BannerView.IListener {
            override fun onBannerLoaded(bannerAdView: BannerView?) {
                Log.d(TAG, "Banner loaded")
            }

            override fun onBannerClick(bannerAdView: BannerView?) {}
            override fun onBannerFailedToLoad(bannerAdView: BannerView?, error: BannerErrorInfo?) {
                Log.e(TAG, "Banner failed: ${error?.errorMessage}")
            }
            override fun onBannerLeftApplication(bannerAdView: BannerView?) {}
        }

        val params = RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.WRAP_CONTENT,
            RelativeLayout.LayoutParams.WRAP_CONTENT
        )
        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM)
        params.addRule(RelativeLayout.CENTER_HORIZONTAL)
        
        rootLayout.addView(bannerView, params)
        bannerView?.load()
    }

    // --- INTERSTITIALS ---
    fun loadInterstitial() {
        UnityAds.load(INTERSTITIAL_ID, object : IUnityAdsLoadListener {
            override fun onUnityAdsAdLoaded(placementId: String?) {
                Log.d(TAG, "Interstitial loaded: $placementId")
            }

            override fun onUnityAdsFailedToLoad(placementId: String?, error: UnityAds.UnityAdsLoadError?, message: String?) {
                Log.e(TAG, "Interstitial failed to load: $message")
            }
        })
    }

    fun showInterstitial(activity: Activity) {
        UnityAds.show(activity, INTERSTITIAL_ID, UnityAdsShowOptions(), object : IUnityAdsShowListener {
            override fun onUnityAdsShowFailure(placementId: String?, error: UnityAds.UnityAdsShowError?, message: String?) {
                Log.e(TAG, "Interstitial show failed: $message")
                loadInterstitial() // Reload on failure
            }

            override fun onUnityAdsShowStart(placementId: String?) {}
            override fun onUnityAdsShowClick(placementId: String?) {}
            override fun onUnityAdsShowComplete(placementId: String?, state: UnityAds.UnityAdsShowCompletionState?) {
                Log.d(TAG, "Interstitial complete")
                loadInterstitial() // Reload after dismissal
            }
        })
    }

    // --- REWARDED ---
    fun loadRewarded() {
        UnityAds.load(REWARDED_ID, object : IUnityAdsLoadListener {
            override fun onUnityAdsAdLoaded(placementId: String?) {
                Log.d(TAG, "Rewarded loaded: $placementId")
            }

            override fun onUnityAdsFailedToLoad(placementId: String?, error: UnityAds.UnityAdsLoadError?, message: String?) {
                Log.e(TAG, "Rewarded failed to load: $message")
            }
        })
    }

    fun showRewarded(activity: Activity, onReward: () -> Unit) {
        UnityAds.show(activity, REWARDED_ID, UnityAdsShowOptions(), object : IUnityAdsShowListener {
            override fun onUnityAdsShowFailure(placementId: String?, error: UnityAds.UnityAdsShowError?, message: String?) {
                Log.e(TAG, "Rewarded show failed: $message")
                loadRewarded()
            }

            override fun onUnityAdsShowStart(placementId: String?) {}
            override fun onUnityAdsShowClick(placementId: String?) {}
            override fun onUnityAdsShowComplete(placementId: String?, state: UnityAds.UnityAdsShowCompletionState?) {
                if (state == UnityAds.UnityAdsShowCompletionState.COMPLETED) {
                    Log.d(TAG, "User rewarded")
                    onReward()
                }
                loadRewarded() // Reload after dismissal
            }
        })
    }
}
