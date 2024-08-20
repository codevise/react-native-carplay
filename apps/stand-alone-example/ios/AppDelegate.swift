import UIKit
import CarPlay
import React

@main
class AppDelegate: RCTAppDelegate {

  var rootView: UIView?;

  static var shared: AppDelegate { return UIApplication.shared.delegate as! AppDelegate }

  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    moduleName = "RNCarPlayStandAlone"
    
    return true
  }
  
  /**
   In React Native 0.74 there are 3 public flags which depend on the new architecture:
   - bridgelessEnabled
   - fabricEnabled
   - turboModuleEnabled
   
   The accessor newArchEnabled is not publicly exposed, therefore it's recreated here
   */
  var newArchEnabled: Bool {
      #if RCT_NEW_ARCH_ENABLED
      return true
      #else
      return false
      #endif
  }
  
  /**
   Do not call RCTAppDelegate's application:didFinishLaunchingWithOptions.
   Instead, cherry-pick the code from RCTAppDelegate's application:didFinishLaunchingWithOptions except for window and rootViewController creation
   and do all app initialization manually in initAppFromScene(), moving the window and rootViewController creation to PhoneScene
   */
  func initAppFromScene(connectionOptions: UIScene.ConnectionOptions?) {
    // If bridge has already been initiated by another scene, there's nothing to do here
    if (self.bridge != nil) {
      return;
    }
    
    /**
     ReactNativeCarPlay requires a bridge and is not compatible with the bridgeless new architecture introduced in React Native 0.74.
     Therefore we need to eject when the new architecture is enabled
     */
    if (self.newArchEnabled) {
      return;
    }
    
    let application = UIApplication.shared;
    
    RCTSetNewArchEnabled(self.newArchEnabled)
    RCTAppSetupPrepareApp(application, self.newArchEnabled)
    
    let launchOptions = self.connectionOptionsToLaunchOptions(connectionOptions: connectionOptions)
    
    if (self.bridge == nil) {
      self.bridge = super.createBridge(with: self, launchOptions: launchOptions)
    }
    
    let initProps = self.initialProps as? [String: Any] ?? [String: Any]()
    self.rootView = self.createRootView(with: self.bridge!, moduleName: self.moduleName!, initProps: initProps)
    
    if #available(iOS 13.0, *) {
      self.rootView!.backgroundColor = UIColor.systemBackground
    } else {
      self.rootView!.backgroundColor = UIColor.white
    }
  }
  
  /**
   Convert ConnectionOptions to LaunchOptions
   When Scenes are used, the launchOptions param in "didFinishLaunchingWithOptions" is always null, and the expected data is provided through SceneDelegate's ConnectionOptions instead but in a different format
   */
  func connectionOptionsToLaunchOptions(connectionOptions: UIScene.ConnectionOptions?) -> [UIApplication.LaunchOptionsKey: Any] {
    var launchOptions: [UIApplication.LaunchOptionsKey: Any] = [:];
    
    if let options = connectionOptions {
      if options.notificationResponse != nil {
        launchOptions[UIApplication.LaunchOptionsKey.remoteNotification] = options.notificationResponse?.notification.request.content.userInfo;
      }
      
      if !options.userActivities.isEmpty {
        let userActivity = options.userActivities.first;
        let userActivityDictionary = [
          "UIApplicationLaunchOptionsUserActivityTypeKey": userActivity?.activityType as Any,
          "UIApplicationLaunchOptionsUserActivityKey": userActivity!
        ] as [String : Any];
        launchOptions[UIApplication.LaunchOptionsKey.userActivityDictionary] = userActivityDictionary;
      }
    }
    
    return launchOptions;
  }

  override func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
    if (connectingSceneSession.role == UISceneSession.Role.carTemplateApplication) {
      let scene =  UISceneConfiguration(name: "CarPlay", sessionRole: connectingSceneSession.role)
      scene.delegateClass = CarSceneDelegate.self
      return scene
    } else {
      let scene =  UISceneConfiguration(name: "Phone", sessionRole: connectingSceneSession.role)
      scene.delegateClass = PhoneSceneDelegate.self
      return scene
    }
  }
  
  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index");
    #else
      return Bundle.main.url(forResource:"main", withExtension:"jsbundle")
    #endif
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return bundleURL()
  }
}
