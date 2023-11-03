#!/usr/bin/env ruby

require 'fileutils'
require 'json'

def perform_substitution(dir, json)

  puts "Writing settings to ${dir}"

  set_values_simple('EnableAutocapture', 'bool', dir, json, 'enableNativeTouchEventCapture', false)
  set_values_simple('CaptureBaseUrl', 'string', dir, json, 'captureBaseUrl', '')

  set_values('EnableDebugLogging', 'bool', dir, json) { |s, d, n|
    get_property('debug', n == 'dev', s, d)
  }
  
  set_values('AppId', 'string', dir, json) { |s, d, n|
    get_property('heapAutoInit', true, s, d) ? get_property('heapAppId', '', s, d) : ''
  }

end

def set_values_simple(key, type, dir, json, json_key, valueIfNil)
  set_values(key, type, dir, json) { |s, d, n| get_property(json_key, valueIfNil, s, d) }
end

def set_values(key, type, dir, json, &block)
  dev = json.fetch('dev', {})
  prod = json.fetch('prod', {})
  default = json.fetch('default', {})
  output_path = File.join dir, 'HeapSettings.plist'

  set_value(":Heap#{key}Dev", type, block.call(dev, default, 'dev'), output_path)
  set_value(":Heap#{key}Prod", type, block.call(prod, default, 'prod'), output_path)
end

def set_value(key, type, value, output_path)
  %x{/usr/libexec/PlistBuddy -c 'Delete #{key}' '#{output_path}' 2> /dev/null}
  %x{/usr/libexec/PlistBuddy -c 'Add #{key} #{type} "#{value}"' '#{output_path}'}
end

def perform_empty_substitution(dir)
  perform_substitution dir, JSON.parse("{}")
end

def get_property(name, valueIfNil, selectedConfig, defaultConfig)
  value = selectedConfig[name]
  value = defaultConfig[name] if value.nil?
  value = valueIfNil if value.nil?
  return value
end
