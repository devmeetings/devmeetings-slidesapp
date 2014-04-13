class MessageQueueConnection
  attr_accessor :connection, :channel, :queue, :exchange

  def initialize
    @connection = Bunny.new
    @connection.start

    @channel = @connection.create_channel
    @queue = @channel.queue('run_ruby')
    @exchange = @channel.default_exchange
  end

  def subscribe
    @queue.subscribe do |delivery_info, metadata, payload|
      yield(metadata, payload)
    end
  end

  def publish(response, params = {})
    @exchange.publish(response, params)
  end
end
