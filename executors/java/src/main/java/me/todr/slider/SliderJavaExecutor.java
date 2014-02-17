package me.todr.slider;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Map;

import me.todr.slider.JavaRunner.CompilerOutput;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import com.rabbitmq.client.AMQP.BasicProperties;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.ConsumerCancelledException;
import com.rabbitmq.client.QueueingConsumer;
import com.rabbitmq.client.QueueingConsumer.Delivery;
import com.rabbitmq.client.ShutdownSignalException;

public class SliderJavaExecutor {

	private static final String QUEUE_NAME = "run";

	public static void main(String[] args) throws IOException,
			ShutdownSignalException, ConsumerCancelledException,
			InterruptedException, IllegalAccessException,
			IllegalArgumentException, InvocationTargetException,
			NoSuchMethodException, SecurityException {
		ObjectMapper objectMapper = new ObjectMapper();
		// Connect to queue
		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("localhost");
		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();
		channel.queueDeclare(QUEUE_NAME, false, false, false, null);
		channel.basicQos(1);

		// Consume queue
		QueueingConsumer consumer = new QueueingConsumer(channel);
		channel.basicConsume(QUEUE_NAME, consumer);

		JavaRunner javaRunner = new JavaRunner();
		Map<String, Object> map = Maps.newHashMap();
		while (true) {
			map.clear();
			System.out.println("[*] Waiting for messages.");
			Delivery delivery = consumer.nextDelivery();
			BasicProperties props = delivery.getProperties();
			BasicProperties replyProps = new BasicProperties.Builder()
					.correlationId(props.getCorrelationId()).build();
			// Read JSON
			JsonNode readTree = objectMapper.readTree(delivery.getBody());
			// Run code
			CompilerOutput compile = javaRunner.compile(readTree.get("name")
					.asText(), readTree.get("code").asText());
			Class<?> clazz = compile.getClazz();
			if (clazz != null) {
				byte[] bytes = clazz.getMethod("main").invoke(null).toString()
						.getBytes();
				map.put("result", new String(bytes));
			} else {
				map.put("errors", compile.getErrors());
			}

			channel.basicPublish("", props.getReplyTo(), replyProps,
					objectMapper.writeValueAsBytes(map));
			channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
		}

	}
}
