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
  dev, prod, default = json.values_at('dev', 'prod', 'default')

  auto_init_dev = dev['heapAutoInit']
  auto_init_dev = default['heapAutoInit'] if auto_init_dev.nil?
  auto_init_dev = true if auto_init_dev.nil?

  auto_init_prod = prod['heapAutoInit']
  auto_init_prod = default['heapAutoInit'] if auto_init_prod.nil?
  auto_init_prod = true if auto_init_prod.nil?

  app_id_dev = dev['heapAppId'] || default['heapAppId'] if auto_init_dev
  app_id_prod = prod['heapAppId'] || default['heapAppId'] if auto_init_prod

  return app_id_dev, app_id_prod
end
