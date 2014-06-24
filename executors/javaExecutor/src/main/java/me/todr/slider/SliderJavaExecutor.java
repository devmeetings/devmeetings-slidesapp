package me.todr.slider;

import java.io.IOException;
import java.io.Serializable;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.text.MessageFormat;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Optional;
import com.google.common.base.Stopwatch;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
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

	private static final String QUEUE_NAME = "exec_java";
	private static final int MAXIMAL_EXECUTION_TIME_SECONDS = 7;

	public static void main(String[] args) throws IOException,
			ShutdownSignalException, ConsumerCancelledException,
			InterruptedException, ExecutionException, KeyManagementException,
			NoSuchAlgorithmException, URISyntaxException {
		ExecutorService exec = Executors.newCachedThreadPool();

		// Connect to queue
		ConnectionFactory factory = new ConnectionFactory();
		String host = Optional.of(System.getenv("RABBITMQ_HOST")).or(
				"localhost");
		factory.setUri("amqp://" + host);
		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();
		channel.queueDeclare(QUEUE_NAME, false, false, false, null);
		channel.basicQos(1);

		// Consume queue
		QueueingConsumer consumer = new QueueingConsumer(channel);
		channel.basicConsume(QUEUE_NAME, consumer);

		System.out.println("[*] Waiting for messages.");
		while (true) {
			Delivery delivery = consumer.nextDelivery();
			exec.submit(new ExecuteMessageWithTimeout(exec, delivery, channel));
		}

	}

	private static void answer(final Channel channel, final Delivery delivery,
			byte[] map) throws IOException {
		BasicProperties props = delivery.getProperties();
		BasicProperties replyProps = new BasicProperties.Builder()
				.correlationId(props.getCorrelationId()).build();
		channel.basicPublish("", props.getReplyTo(), replyProps, map);
		channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
	}

	private static final class ExecuteMessageWithTimeout implements
			Callable<Void> {
		private static final Map<String, Serializable> TOO_LONG_MAP = ImmutableMap
				.of("success", false, "errors", ImmutableList
						.of("Your code has taken to long to execute."));
		private static final ObjectMapper objectMapper = new ObjectMapper();

		private final ExecutorService exec;
		private final Delivery delivery;
		private final Channel channel;

		private ExecuteMessageWithTimeout(ExecutorService exec,
				Delivery delivery, Channel channel) {
			this.exec = exec;
			this.delivery = delivery;
			this.channel = channel;
		}

		@Override
		public Void call() throws Exception {
			Stopwatch watch = Stopwatch.createStarted();
			Future<byte[]> submit = exec.submit(new CompileAndRunMessage(
					delivery.getBody()));
			try {
				byte[] map = submit.get(MAXIMAL_EXECUTION_TIME_SECONDS,
						TimeUnit.SECONDS);
				answer(channel, delivery, map);
			} catch (ExecutionException e) {
				System.err.println("Execution exception...");
				answer(channel, delivery,
						objectMapper.writeValueAsBytes(exceptionMap(e)));
			} catch (TimeoutException e) {
				System.err.println("Canceling task...");
				submit.cancel(true);
				answer(channel, delivery,
						objectMapper.writeValueAsBytes(TOO_LONG_MAP));
			}
			watch.stop();
			System.out.println(MessageFormat.format("Total: {0}us",
					watch.elapsed(TimeUnit.MICROSECONDS)));
			return null;
		}

		private Map<String, Object> exceptionMap(ExecutionException e) {
			Map<String, Object> map = Maps.newHashMap();
			map.put("success", false);
			map.put("errors", e.getCause().getMessage());
			map.put("stacktrace", e.getCause().getStackTrace());
			return map;

		}
	}
}
