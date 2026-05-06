/**
 * AdPolicyManager handles frequency caps and pacing for ads.
 */
export enum AdType {
  BANNER = 'banner',
  NATIVE = 'native',
  INTERSTITIAL = 'interstitial',
  REWARDED = 'rewarded'
}

export enum AdPlacement {
  HOME_BANNER = 'home_banner',
  PRACTICE_BANNER = 'practice_banner',
  PROFILE_BANNER = 'profile_banner',
  HOME_FEED_NATIVE = 'home_feed_native',
  LESSON_LIST_NATIVE = 'lesson_list_native',
  DIARY_RESULTS_NATIVE = 'diary_results_native',
  MODULE_END_INTERSTITIAL = 'module_end_interstitial',
  SESSION_END_INTERSTITIAL = 'session_end_interstitial',
  REWARDED_AI_CREDITS = 'rewarded_ai_credits',
  REWARDED_EXAM_UNLOCK = 'rewarded_exam_unlock',
  REWARDED_CHEST_UPGRADE = 'rewarded_chest_upgrade'
}

interface AdStats {
  sessionInterstitials: number;
  dailyInterstitials: number;
  dailyRewarded: number;
  lastInterstitialTime: number;
  lastRewardedTime: number;
  sessionStartTime: number;
}

class AdPolicyManager {
  private stats: AdStats = {
    sessionInterstitials: 0,
    dailyInterstitials: 0,
    dailyRewarded: 0,
    lastInterstitialTime: 0,
    lastRewardedTime: 0,
    sessionStartTime: Date.now()
  };

  private lessonsSinceLastInterstitial = 0;

  private readonly MIN_TIME_BETWEEN_INTERSTITIALS = 120000; // 2 minutes
  private readonly MAX_SESSION_INTERSTITIALS = 15;
  private readonly MAX_DAILY_INTERSTITIALS = 40;
  private readonly MIN_TIME_FROM_LAUNCH = 60000; // 1 minute
  private readonly REWARDED_COOLDOWN = 30000; // 30 seconds

  recordLessonCompletion() {
    this.lessonsSinceLastInterstitial++;
  }

  canShowInterstitial(isModuleEnd = false): boolean {
    const now = Date.now();
    const timeSinceLaunch = now - this.stats.sessionStartTime;
    const timeSinceLast = now - this.stats.lastInterstitialTime;

    // Condição lógica: Fim de módulo OU a cada 3 lições
    const milestoneReached = isModuleEnd || this.lessonsSinceLastInterstitial >= 3;

    if (!milestoneReached) return false;
    if (timeSinceLaunch < this.MIN_TIME_FROM_LAUNCH) return false;
    if (timeSinceLast < this.MIN_TIME_BETWEEN_INTERSTITIALS) return false;
    if (this.stats.sessionInterstitials >= this.MAX_SESSION_INTERSTITIALS) return false;
    if (this.stats.dailyInterstitials >= this.MAX_DAILY_INTERSTITIALS) return false;

    return true;
  }

  canShowRewarded(): boolean {
    const now = Date.now();
    const timeSinceLast = now - this.stats.lastRewardedTime;
    return timeSinceLast >= this.REWARDED_COOLDOWN;
  }

  onInterstitialShown() {
    this.stats.sessionInterstitials++;
    this.stats.dailyInterstitials++;
    this.stats.lastInterstitialTime = Date.now();
    this.lessonsSinceLastInterstitial = 0; // Reset counter
  }

  onRewardedShown() {
    this.stats.dailyRewarded++;
    this.stats.lastRewardedTime = Date.now();
  }

  getStats() {
    return { ...this.stats };
  }

  getDebugStats() {
    return {
      interstitialCount: this.stats.dailyInterstitials,
      rewardedCount: this.stats.dailyRewarded,
      sessionInterstitials: this.stats.sessionInterstitials,
      lastInterstitial: this.stats.lastInterstitialTime
    };
  }
}

export const adPolicy = new AdPolicyManager();
