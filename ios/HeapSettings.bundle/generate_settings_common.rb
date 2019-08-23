#!/usr/bin/env ruby

require 'fileutils'

def perform_substitution(dir, app_id_dev, app_id_prod)
  template = File.read File.join(dir, 'HeapSettings.plist.template')
  output_path = File.join dir, 'HeapSettings.plist'

  settings = template
    .gsub('__HEAP_APP_ID_DEV__', app_id_dev || '')
    .gsub('__HEAP_APP_ID_PROD__', app_id_prod || '')

  IO.write output_path, settings
end

def get_heap_settings_from_json(json)
  dev = json.fetch('dev', {})
  prod = json.fetch('prod', {})
  default = json.fetch('default', {})

  return get_app_id_for_config(dev, default), get_app_id_for_config(prod, default)
end

def get_app_id_for_config(specified_config, default_config)
  is_auto_init = specified_config['heapAutoInit']
  is_auto_init = default_config['heapAutoInit'] if is_auto_init.nil?
  is_auto_init = true if is_auto_init.nil?

  return specified_config['heapAppId'] || default_config['heapAppId'] if is_auto_init
end
