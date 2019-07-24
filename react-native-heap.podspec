require "json"

json = File.read(File.join(__dir__, "package.json"))
package = JSON.parse(json).deep_symbolize_keys

Pod::Spec.new do |s|
  s.name = "react-native-heap"
  s.version = package[:version]
  s.summary = package[:description]
  s.license = { type: "MIT" }
  s.author = package[:author]
  s.homepage = package[:homepage]
  s.source = { git: package[:repository] }
  s.source_files = "ios/**/*.{h,m}"
  s.platform = :ios, "8.0"
  s.preserve_paths = "ios/Vendor"
  s.vendored_libraries = "ios/Vendor/libHeap.a"

  s.dependency "React"

  s.script_phase = {
    name: 'Generate `HeapSettings.plist`',
    script: '../../node_modules/@heap/react-native-heap/ios/HeapSettings.bundle/generate_settings',
    execution_position: :after_compile,
    shell_path: '/bin/bash'
  }
  s.resource_bundles = {HeapSettings: ['ios/HeapSettings.bundle/HeapSettings.plist.template', 'ios/HeapSettings.bundle/HeapSettings.plist']}
end
