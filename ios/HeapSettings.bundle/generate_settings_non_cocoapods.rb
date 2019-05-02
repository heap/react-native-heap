#!/usr/bin/env ruby

require "json"
require 'fileutils'

# `HeapSettings` is a custom "resource bundle" that exists for the sole purpose of allowing runtime 
# code to receive settings from the `heap.config.json` file. This script parses the JSON configuration
# file and generates a bundle containing a single `HeapSettings.plist` that runtime code can directly 
# access. This doesn't _have_ to be in Ruby, but it's consistent because the `podspec` is in Ruby, and 
# all `macOS` installs come with a Ruby installed at `/usr/bin/ruby`.

HEAP_CONFIG_FILENAME = 'heap.config.json'

def perform_substitution(dir, app_id_dev, app_id_prod)
  template = File.read File.join(dir, 'HeapSettings.plist.template')
  output_path = File.join dir, 'HeapSettings.plist'

  settings = template
    .gsub('__HEAP_APP_ID_DEV__', app_id_dev || '')
    .gsub('__HEAP_APP_ID_PROD__', app_id_prod || '')

  IO.write output_path, settings
end

def write_heap_settings
  # `pwd` is <client_app>/ios/Pods
  settings_filename = File.expand_path "../../../../#{HEAP_CONFIG_FILENAME}"

  if File.file?(settings_filename)
    json = JSON.parse File.read(settings_filename).strip
    dev, prod, default = json.values_at('dev', 'prod', 'default')

    auto_init_dev = dev['heapAutoInit']
    auto_init_dev = default['heapAutoInit'] if auto_init_dev.nil?
    auto_init_dev = true if auto_init_dev.nil?

    auto_init_prod = prod['heapAutoInit']
    auto_init_prod = default['heapAutoInit'] if auto_init_prod.nil?
    auto_init_prod = true if auto_init_prod.nil?

    app_id_dev = dev['heapAppId'] || default['heapAppId'] if auto_init_dev
    app_id_prod = prod['heapAppId'] || default['heapAppId'] if auto_init_prod
  else
    puts "Not auto-initializing Heap; couldn't find #{HEAP_CONFIG_FILENAME}."
  end

  perform_substitution __dir__, app_id_dev, app_id_prod
end

write_heap_settings