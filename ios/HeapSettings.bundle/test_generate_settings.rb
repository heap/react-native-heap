#!/usr/bin/env ruby

puts <<-end_explanation
test_generate_settings.rb

This this script tests the various JSON parameters that go into generating HeapSettings.plist.
When adding a new setting, it is prudent to write a test in case you royally mess things up. (Ask me how I know.)

end_explanation

require "json"
require 'fileutils'
require 'tmpdir'
require_relative 'generate_settings_common'

def assert_equal(expected, key, dir)
  path = File.join dir, 'HeapSettings.plist'
  value = %x{/usr/libexec/PlistBuddy -c 'Print #{key}' '#{path}'}.strip!
  raise "Test failed: Expected '#{expected}' at #{key}, got '#{value}'" unless value == expected
end

Dir.mktmpdir do |dir|

  #path = File.join dir, 'HeapSettings.plist'
  #puts %x{/usr/libexec/PlistBuddy -c 'Print' '#{path}'}

  puts "Testing default values"

  perform_substitution(dir, {})
  assert_equal('false', ':HeapEnableAutocaptureDev', dir)
  assert_equal('false', ':HeapEnableAutocaptureProd', dir)
  assert_equal('', ':HeapCaptureBaseUrlDev', dir)
  assert_equal('', ':HeapCaptureBaseUrlProd', dir)
  assert_equal('', ':HeapAppIdDev', dir)
  assert_equal('', ':HeapAppIdProd', dir)

  puts "Testing 'enableNativeTouchEventCapture'"

  perform_substitution(dir, { 'default' => { 'enableNativeTouchEventCapture' => true }})
  assert_equal('true', ':HeapEnableAutocaptureDev', dir)
  assert_equal('true', ':HeapEnableAutocaptureProd', dir)

  perform_substitution(dir, { 'default' => { 'enableNativeTouchEventCapture' => true }, 'dev' => { 'enableNativeTouchEventCapture' => false }})
  assert_equal('false', ':HeapEnableAutocaptureDev', dir)
  assert_equal('true', ':HeapEnableAutocaptureProd', dir)

  perform_substitution(dir, { 'default' => { 'enableNativeTouchEventCapture' => true }, 'prod' => { 'enableNativeTouchEventCapture' => false }})
  assert_equal('true', ':HeapEnableAutocaptureDev', dir)
  assert_equal('false', ':HeapEnableAutocaptureProd', dir)

  puts "Testing 'captureBaseUrl'"

  perform_substitution(dir, { 'default' => { 'captureBaseUrl' => 'a://b/' }})
  assert_equal('a://b/', ':HeapCaptureBaseUrlDev', dir)
  assert_equal('a://b/', ':HeapCaptureBaseUrlProd', dir)

  perform_substitution(dir, { 'default' => { 'captureBaseUrl' => 'a://b/' }, 'dev' => { 'captureBaseUrl' => 'x://y' }})
  assert_equal('x://y', ':HeapCaptureBaseUrlDev', dir)
  assert_equal('a://b/', ':HeapCaptureBaseUrlProd', dir)

  perform_substitution(dir, { 'default' => { 'captureBaseUrl' => 'a://b/' }, 'prod' => { 'captureBaseUrl' => 'x://y' }})
  assert_equal('a://b/', ':HeapCaptureBaseUrlDev', dir)
  assert_equal('x://y', ':HeapCaptureBaseUrlProd', dir)

  puts "Testing 'heapAppId'"

  perform_substitution(dir, { 'default' => { 'heapAppId' => '11' }})
  assert_equal('11', ':HeapAppIdDev', dir)
  assert_equal('11', ':HeapAppIdProd', dir)

  perform_substitution(dir, { 'default' => { 'heapAppId' => '11' }, 'dev' => { 'heapAppId' => '12' }})
  assert_equal('12', ':HeapAppIdDev', dir)
  assert_equal('11', ':HeapAppIdProd', dir)

  perform_substitution(dir, { 'default' => { 'heapAppId' => '11' }, 'prod' => { 'heapAppId' => '12' }})
  assert_equal('11', ':HeapAppIdDev', dir)
  assert_equal('12', ':HeapAppIdProd', dir)

  puts "Testing 'heapAutoInit'"

  perform_substitution(dir, { 'default' => { 'heapAppId' => '11', 'heapAutoInit' => false }})
  assert_equal('', ':HeapAppIdDev', dir)
  assert_equal('', ':HeapAppIdProd', dir)

  perform_substitution(dir, { 'default' => { 'heapAppId' => '11', 'heapAutoInit' => false }, 'dev' => { 'heapAutoInit' => true }})
  assert_equal('11', ':HeapAppIdDev', dir)
  assert_equal('', ':HeapAppIdProd', dir)

  perform_substitution(dir, { 'default' => { 'heapAppId' => '11', 'heapAutoInit' => false }, 'prod' => { 'heapAutoInit' => true }})
  assert_equal('', ':HeapAppIdDev', dir)
  assert_equal('11', ':HeapAppIdProd', dir)

  perform_substitution(dir, { 'default' => { 'heapAppId' => '11', 'heapAutoInit' => true }, 'dev' => { 'heapAutoInit' => false }})
  assert_equal('', ':HeapAppIdDev', dir)
  assert_equal('11', ':HeapAppIdProd', dir)

  perform_substitution(dir, { 'default' => { 'heapAppId' => '11', 'heapAutoInit' => true }, 'prod' => { 'heapAutoInit' => false }})
  assert_equal('11', ':HeapAppIdDev', dir)
  assert_equal('', ':HeapAppIdProd', dir)

  puts "All the tests passed!"

end

