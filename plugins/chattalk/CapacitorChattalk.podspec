Pod::Spec.new do |s|
  s.name = 'CapacitorChattalk'
  s.version = '0.1.0'
  s.summary = 'PokemonCollege native helpers: ChatTalk recorder/transcription and PokePics photo text reading'
  s.license = 'Private'
  s.homepage = 'https://example.invalid/pokemoncollege'
  s.author = 'PokemonCollege'
  s.source = { :git => '', :tag => s.version.to_s }
  s.source_files = 'ios/Plugin/**/*.swift'
  s.ios.deployment_target = '14.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.1'
  s.frameworks = 'AVFoundation', 'Speech', 'Vision'
end
