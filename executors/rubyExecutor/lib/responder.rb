class Responder
  attr_accessor :connection, :metadata, :result

  def initialize(connection, metadata, result)
    @connection = connection
    @metadata = metadata
    @result = result
  end

  def publish!
    reply_to = metadata[:reply_to]
    correlation_id = metadata[:correlation_id]

    connection.publish(result.to_json, {
      :routing_key => reply_to,
      :correlation_id => correlation_id
    })
  end
end
