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

# This script runs too late for us to modify `node_modules/@heap/react-native-heap/ios/HeapSettings`
# directly; it has already been copied to the build dir. We fix this by running this script on the
# build dir directly (BUNDLE_DIRECTORY). This works for the first run, but XCode caching prevents it
# from running again, since the XCode cache uses versions of these files _before_ the app ids
# are substituted, so the plist looks unchanged. This is fixed (hackily) for the second run onwards by
# modifying the post-copy version of the `HeapSettings` bundle directly (APP_DIRECTORY), before
# it's copied over to a device/simulator.
#
# WRAPPER_NAME is set when `use_frameworks!` is used, putting the bundle in the framework directory.
# If not using frameworks, '.' puts it in the app's directory.
CONFIGURATION_BUILD_DIR = ENV['CONFIGURATION_BUILD_DIR']
WRAPPER_NAME = ENV['WRAPPER_NAME'] || '.'
BUNDLE_DIRECTORY = File.join CONFIGURATION_BUILD_DIR, WRAPPER_NAME, 'HeapSettings.bundle'
APP_DIRECTORY = Dir.glob(File.join(ENV['PODS_CONFIGURATION_BUILD_DIR'], '*.app', WRAPPER_NAME, 'HeapSettings.bundle'))[0]

def write_heap_settings
  # `pwd` is <client_app>/ios/Pods
  settings_filename = File.expand_path "../../#{HEAP_CONFIG_FILENAME}"

  if File.file?(settings_filename)
    json = JSON.parse File.read(settings_filename).strip

    perform_substitution BUNDLE_DIRECTORY, json

    if APP_DIRECTORY && File.directory?(APP_DIRECTORY)
      perform_substitution APP_DIRECTORY, json
    end
  else
    puts "Not auto-initializing Heap; couldn't find #{HEAP_CONFIG_FILENAME}."

    perform_empty_substitution BUNDLE_DIRECTORY

    if APP_DIRECTORY && File.directory?(APP_DIRECTORY)
      perform_empty_substitution APP_DIRECTORY
    end
  end
end

write_heap_settings
