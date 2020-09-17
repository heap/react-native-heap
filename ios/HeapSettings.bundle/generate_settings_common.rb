#!/usr/bin/env ruby

require 'fileutils'

def perform_substitution(dir, json)
  dev = json.fetch('dev', {})
  prod = json.fetch('prod', {})
  default = json.fetch('default', {})

  template = File.read File.join(dir, 'HeapSettings.plist.template')
  output_path = File.join dir, 'HeapSettings.plist'

  settings = template
    .gsub('__HEAP_APP_ID_DEV__', get_app_id_for_config(dev, default) || '')
    .gsub('__HEAP_APP_ID_PROD__', get_app_id_for_config(prod, default) || '')
    .gsub('__HEAP_ENABLE_AUTOCAPTURE_DEV__', get_enable_autocapture_for_config(dev, default) ? 'true' : 'false')
    .gsub('__HEAP_ENABLE_AUTOCAPTURE_PROD__', get_enable_autocapture_for_config(prod, default) ? 'true' : 'false')

  IO.write output_path, settings
end

def perform_empty_substitution(dir)
  template = File.read File.join(dir, 'HeapSettings.plist.template')
  output_path = File.join dir, 'HeapSettings.plist'

  settings = template
    .gsub('__HEAP_APP_ID_DEV__', '')
    .gsub('__HEAP_APP_ID_PROD__', '')
    .gsub('__HEAP_ENABLE_AUTOCAPTURE_DEV__', 'false')
    .gsub('__HEAP_ENABLE_AUTOCAPTURE_PROD__', 'false')

  IO.write output_path, settings
end

def get_app_id_for_config(specified_config, default_config)
  is_auto_init = specified_config['heapAutoInit']
  is_auto_init = default_config['heapAutoInit'] if is_auto_init.nil?
  is_auto_init = true if is_auto_init.nil?

  return specified_config['heapAppId'] || default_config['heapAppId'] if is_auto_init
end

def get_enable_autocapture_for_config(specified_config, default_config)
  return specified_config['enableNativeTouchEventCapture'] || default_config['enableNativeTouchEventCapture']
end
