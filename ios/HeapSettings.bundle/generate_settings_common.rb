#!/usr/bin/env ruby

require 'fileutils'
require 'json'

def perform_substitution(dir, json)
  dev = json.fetch('dev', {})
  prod = json.fetch('prod', {})
  default = json.fetch('default', {})
  output_path = File.join dir, 'HeapSettings.plist'
  
  %x{/usr/libexec/PlistBuddy -c 'Add :HeapAppIdDev string "#{get_app_id(dev, default)}"' '#{output_path}'}
  %x{/usr/libexec/PlistBuddy -c 'Add :HeapAppIdProd string "#{get_app_id(prod, default)}"' '#{output_path}'}
  %x{/usr/libexec/PlistBuddy -c 'Add :HeapEnableAutocaptureDev bool #{get_enable_autocapture(dev, default)}' '#{output_path}'}
  %x{/usr/libexec/PlistBuddy -c 'Add :HeapEnableAutocaptureProd bool #{get_enable_autocapture(prod, default)}' '#{output_path}'}
  %x{/usr/libexec/PlistBuddy -c 'Add :HeapCaptureBaseUrlDev string "#{get_capture_base_url(dev, default)}"' '#{output_path}'}
  %x{/usr/libexec/PlistBuddy -c 'Add :HeapCaptureBaseUrlProd string "#{get_capture_base_url(prod, default)}"' '#{output_path}'}
end

def perform_empty_substitution(dir)
  perform_substitution dir, JSON.parse("{}")
end

def get_app_id(selectedConfig, defaultConfig)
  return '' unless get_property('heapAutoInit', true, selectedConfig, defaultConfig)
  return get_property('heapAppId', '', selectedConfig, defaultConfig)
end

def get_enable_autocapture(selectedConfig, defaultConfig)
  return get_property('enableNativeTouchEventCapture', false, selectedConfig, defaultConfig)
end

def get_capture_base_url(selectedConfig, defaultConfig)
  return get_property('captureBaseUrl', false, selectedConfig, defaultConfig)
end

def get_property(name, valueIfNil, selectedConfig, defaultConfig)
  value = selectedConfig[name]
  value = defaultConfig[name] if value.nil?
  value = valueIfNil if value.nil?
  return value
end
