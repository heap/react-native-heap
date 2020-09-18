#!/usr/bin/env ruby

require "json"
require 'fileutils'

require_relative 'generate_settings_common'

# `HeapSettings` is a custom "resource bundle" that exists for the sole purpose of allowing runtime
# code to receive settings from the `heap.config.json` file. This script parses the JSON configuration
# file and generates a bundle containing a single `HeapSettings.plist` that runtime code can directly
# access. This doesn't _have_ to be in Ruby, but it's consistent because the `podspec` is in Ruby, and
# all `macOS` installs come with a Ruby installed at `/usr/bin/ruby`.

HEAP_CONFIG_FILENAME = 'heap.config.json'

def write_heap_settings
  # `pwd` is <client_app>/ios/Pods
  settings_filename = File.expand_path "../../../../#{HEAP_CONFIG_FILENAME}"

  if File.file?(settings_filename)
    json = JSON.parse File.read(settings_filename).strip

    perform_substitution __dir__, json
  else
    puts "Not auto-initializing Heap; couldn't find #{HEAP_CONFIG_FILENAME}."

    perform_empty_substitution __dir__
  end
end

write_heap_settings
