# encoding: utf-8
require 'rubygems'
require 'bunny'
require 'json'

require './lib/message_queue_connection'
require './lib/evaluator'
require './lib/responder'

connection = MessageQueueConnection.new

puts '[*] Waiting for messages.'

connection.subscribe do |metadata, payload|
  result = Evaluator.new(JSON.parse(payload)['code']).evaluate!
  Responder.new(connection, metadata, result).publish!

  puts result.inspect
end

while true
  sleep 1
end
