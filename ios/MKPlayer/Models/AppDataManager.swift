//
//  AppDataManager.swift
//  MKPlayerRefAppTVOS
//
//  Created by Priyank Saxena on 06/04/23.
//

import Foundation
import UIKit

/**
 * Static Class to help manage the various app specific data.
 */
final class AppDataManager {

    // Shared instance of this class
    static let shared = AppDataManager()

    // Private initializer
    private init() {
        // Get the appConfig data from file
        self.appConfig = self.getAppConfigFromFile

        // Restore from defaults
        if let savedAppData = userDefaultsData {
            self.appData = savedAppData
        } else {
            // Get and update the external source config list in app data
            if self.appData.externalSourceConfigList.count == 0 {
                self.appData.externalSourceConfigList = self.appConfig.externalSourceConfigList
            }

            // Get the player and analytics license key from Info.plist file and update app data
            if let playerLicense = self.getValueForKeyFromInfoPlist(forKey: Key.PlayerLicenseInfoPlistKey) {
                self.playerLicense = playerLicense
            }
            if let analyticsLicense = self.getValueForKeyFromInfoPlist(forKey: Key.AnalyticsLicenseInfoPlistKey) {
                self.analyticsLicense = analyticsLicense
            }
        }
    }

    // Save/Read data to UserDefaults
    private var userDefaultsData: AppData? {
        get {
            guard let savedData = UserDefaults.standard.object(forKey: Key.UserDefaultsAppDataKey) as? Data,
                  let decodedData = try? JSONDecoder().decode(AppData.self, from: savedData) else {
                return nil
            }

            return decodedData
        }
        set {
//            if let encoded = try? JSONEncoder().encode(newValue) {
//                UserDefaults.standard.set(encoded, forKey: Key.UserDefaultsAppDataKey)
//            }
        }
    }

    // Get contents of AppConfig.json
    private var getAppConfigFromFile: AppConfig {
        guard let url = Bundle.main.url(forResource: "AppConfig", withExtension: FileExtension.json),
              let data = try? Data(contentsOf: url),
              let appConfigData = try? JSONDecoder().decode(AppConfig.self, from: data) else {
            return AppConfig() // return empty lists
        }

        return appConfigData
    }

    // Get value for key from Info.plist
    private func getValueForKeyFromInfoPlist(forKey: String) -> String? {
        guard let value = Bundle.main.object(forInfoDictionaryKey: forKey) as? String, !value.isEmpty else {
            return nil
        }

        return value
    }

    // Update UserDefaults
    private func updateAppDataInUserDefaults() {
        // write to user defaults only if all the app data is available
        guard let stsToken = self.stsToken, !stsToken.isEmpty,
              let playerLicense = self.playerLicense, !playerLicense.isEmpty else {
            // return - we do not have the important stuff - so not saving yet!
            return
        }

        // save
        self.userDefaultsData = self.appData
    }

    // MARK: - Non-persistent properties
    // Contents of `AppConfig.json`
    private var appConfig: AppConfig = AppConfig()

    // Currently applicable source options
    var sourceOptions: SourceOptions = SourceOptions()

    // Currently applicable source config (selected source)
    var currentSourceConfig: SourceConfig? = nil

    // Environment config list (as read from AppConfig.json)
    var environmentConfigList: [EnvironmentConfig] {
        return self.appConfig.environmentConfigList
    }

    // currently selected Live event's external ID
    var liveEventExternalId: String? = nil

    // MARK: - Persistent properties
    // App data that will be saved to UserDefaults
    private var appData: AppData = AppData() {
        didSet {
            self.updateAppDataInUserDefaults()
        }
    }

    // Currently selected environment config
    var currentEnvironmentConfig: EnvironmentConfig? {
        get {
            return self.appData.currentEnvironmentConfig
        }
        set {
            self.appData.currentEnvironmentConfig = newValue
        }
    }

    // External source config list
    var externalSourceConfigList: [SourceConfig] {
        get {
            return self.appData.externalSourceConfigList
        }
        set {
            self.appData.externalSourceConfigList = newValue
        }
    }

    // STS Token
    var stsToken: String? {
        get {
            return self.appData.stsToken
        }
        set {
            self.appData.stsToken = newValue
        }
    }

    // Player License
    var playerLicense: String? {
        get {
            return self.appData.playerLicense
        }
        set {
            self.appData.playerLicense = newValue
        }
    }

    // Analytics License
    var analyticsLicense: String? {
        get {
            return self.appData.analyticsLicense
        }
        set {
            self.appData.analyticsLicense = newValue
        }
    }

    // Indicates whether Analytics is enabled or not
    var isAnalyticsEnabled: Bool {
        get {
            return self.appData.isAnalyticsEnabled
        }
        set {
            self.appData.isAnalyticsEnabled = newValue
        }
    }
    
    // Indicates whether Adobe Primetime is enabled or not
    var isAdobePrimetimeEnabled: Bool {
        get {
            return self.appData.isAdobePrimetimeEnabled
        }
        set {
            self.appData.isAdobePrimetimeEnabled = newValue
        }
    }

    // Indicates whether Source Options are enabled or not
    var isSourceOptionsEnabled: Bool {
        get {
            return self.appData.isSourceOptionsEnabled
        }
        set {
            self.appData.isSourceOptionsEnabled = newValue
        }
    }
    
    // Indicates whether tissot is enabled or not
    var isTissotEnabled: Bool {
        get {
            return self.appData.isTissotEnabled
        }
        set {
            self.appData.isTissotEnabled = newValue
        }
    }
    
    // Indicates whether thumbnail support is enabled or not
    var isThumbnailEnabled: Bool {
        get {
            return self.appData.isThumbnailEnabled
        }
        set {
            self.appData.isThumbnailEnabled = newValue
        }
    }

    // Get/Set bootstrap data
    var bootstrapData: BootstrapData? {
        get {
            return self.appData.bootstrapData
        }
        set {
            self.appData.bootstrapData = newValue
        }
    }

    // Update current environment config and restore the source lists
    func updateCurrentEnvironmentAndRestoreSourceLists(currentEnvironmentConfig: EnvironmentConfig) {
        // update current environment config and with that the source config list for this selected environement
        self.currentEnvironmentConfig = currentEnvironmentConfig

        // also restore the external source list to default
        self.externalSourceConfigList = self.appConfig.externalSourceConfigList
    }
}

// Struct for file extensionss
struct FileExtension {
    static let json = "json"
    static let txt  = "txt"
    static let pdf  = "pdf"
}
