require "json"

json = File.read(File.join(__dir__, "package.json"))
package = JSON.parse(json).deep_symbolize_keys

HEAP_CONFIG_FILENAME = 'heap.config.json'

# This function creates a `HeapSettings` plist file that the Obj-C library
# uses for initialization. This is a bit of a hack, but I couldn't find a better way:
#
#    - Client apps couldn't directly access .xcconfig files from a static library.
#    - Ditto for Info.plist files, which are stripped since this library is statically linked.
#
# Instead, simply declare a new "resource bundle" containing just a single plist file with the
# settings, and load it from Obj-C.
#
# KLUDGE: Cocoapods loads this file in a way that doesn't allow direct method calls, so we use a Proc here instead.
write_heap_settings = Proc.new do
  # `pwd` is <client_app>/node_modules/@heap/react-native-heap, so we go up three levels.
  settings_filename = File.expand_path("../../../#{HEAP_CONFIG_FILENAME}")

  if File.file?(settings_filename)
    json = JSON.parse(File.read(settings_filename).strip).deep_symbolize_keys
    dev, prod, default = json.values_at(:dev, :prod, :default)

    auto_init_dev = dev[:heapAutoInit]
    auto_init_dev = default[:heapAutoInit] if auto_init_dev.nil?
    auto_init_dev = true if auto_init_dev.nil?

    auto_init_prod = prod[:heapAutoInit]
    auto_init_prod = default[:heapAutoInit] if auto_init_prod.nil?
    auto_init_prod = true if auto_init_prod.nil?

    app_id_dev = dev[:heapAppId] || default[:heapAppId] if auto_init_dev
    app_id_prod = prod[:heapAppId] || default[:heapAppId] if auto_init_prod
  else
    puts "Not auto-initializing Heap; couldn't find #{HEAP_CONFIG_FILENAME}."
  end

  template = File.read(File.join(__dir__, 'ios', 'HeapSettings', 'HeapSettings.plist.template'))
  output_path = File.join(__dir__, 'ios', 'HeapSettings', 'HeapSettings.plist')

  settings = template
    .gsub('__HEAP_APP_ID_DEV__', app_id_dev || '')
    .gsub('__HEAP_APP_ID_PROD__', app_id_prod || '')

  IO.write(output_path, settings)
end

write_heap_settings.call

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

  # This declaration rebuilds the `HeapSettings` bundle when the `heap.config.json` file is changed.
  s.resources = 'ios/HeapSettings/HeapSettings.plist'

  s.resource_bundles = {HeapSettings: ['ios/HeapSettings/HeapSettings.plist']}

  s.dependency "React"
end
