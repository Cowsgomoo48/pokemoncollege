Pod::Spec.new do |s|
  s.name = 'CapacitorChattalk'
  s.version = '0.1.0'
  s.summary = 'PokemonCollege native helpers: ChatTalk, PokePics, StudyAI and the app icon badge'
  s.license = 'Private'
  s.homepage = 'https://example.invalid/pokemoncollege'
  s.author = 'PokemonCollege'
  s.source = { :git => '', :tag => s.version.to_s }
  s.source_files = 'ios/Plugin/**/*.swift'
  s.ios.deployment_target = '14.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.1'
  s.frameworks = 'AVFoundation', 'Speech', 'Vision'
  # On-device AI (iOS 26 SDK). Weak-linked so the app still opens on older iOS; skipped if the SDK doesn't have it.
  sdk = `xcrun --sdk iphoneos --show-sdk-path 2>/dev/null`.strip
  s.weak_frameworks = 'FoundationModels' if !sdk.empty? && File.exist?(File.join(sdk, 'System/Library/Frameworks/FoundationModels.framework'))
end
