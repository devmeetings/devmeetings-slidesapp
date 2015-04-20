package me.todr.slider;

import java.io.IOException;
import java.net.URI;
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

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Optional;
import com.google.common.base.Stopwatch;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;

public class SliderJavaExecutor {

	private static class Subscriber extends JedisPubSub {

		private final ExecutorService exec;
		private final Jedis publisher;

		public Subscriber(ExecutorService exec, Jedis publisher) {
			this.exec = exec;
			this.publisher = publisher;
		}

		@Override
		public void onMessage(String channel, String message) {
			exec.submit(new ExecuteMessageWithTimeout(exec, publisher, message));
		}

	}

	private static final String QUEUE_NAME = "exec_java";
	private static final int MAXIMAL_EXECUTION_TIME_SECONDS = 7;

	public static void main(String[] args) throws IOException, InterruptedException, ExecutionException,
			KeyManagementException, NoSuchAlgorithmException, URISyntaxException {
		ExecutorService exec = Executors.newCachedThreadPool();

		// Connect to queue
		String host = Optional.fromNullable(System.getenv("REDIS_HOST")).or("localhost:6379");
		Jedis publisher = new Jedis(URI.create("redis://" + host));
		Jedis redis = new Jedis(URI.create("redis://" + host));

		// Consume queue
		System.out.println("[*] Waiting for messages.");
		redis.subscribe(new Subscriber(exec, publisher), QUEUE_NAME);
		// closing
		redis.quit();
		publisher.quit();
		redis.close();
		publisher.close();

	}

	private static final class ExecuteMessageWithTimeout implements Callable<Void> {
		private static final Map<String, Object> TOO_LONG_MAP = ImmutableMap.of("success", false, "errors",
				ImmutableList.of("Your code has taken to long to execute."));
		private static final ObjectMapper objectMapper = new ObjectMapper();

		private final ExecutorService exec;
		private final String message;
		private final Jedis jedis;

		private ExecuteMessageWithTimeout(ExecutorService exec, Jedis jedis, String message) {
			this.exec = exec;
			this.jedis = jedis;
			this.message = message;
		}

		@Override
		public Void call() throws Exception {
			Stopwatch watch = Stopwatch.createStarted();
			// Read JSON
			JsonNode readTree = objectMapper.readTree(message);
			JsonNode properties = readTree.get("properties");
			String code = readTree.get("content").get("code").asText();

			Future<Map<String, Object>> submit = exec.submit(new CompileAndRunMessage(code));
			try {
				Map<String, Object> map = submit.get(MAXIMAL_EXECUTION_TIME_SECONDS, TimeUnit.SECONDS);
				answer(properties, map);
			} catch (ExecutionException e) {
				System.err.println("Execution exception...");
				answer(properties, exceptionMap(e));
			} catch (TimeoutException e) {
				System.err.println("Canceling task...");
				submit.cancel(true);
				answer(properties, TOO_LONG_MAP);
			}
			watch.stop();
			System.out.println(MessageFormat.format("Total: {0}us", watch.elapsed(TimeUnit.MICROSECONDS)));
			return null;
		}

		private void answer(JsonNode properties, Map<String, Object> map) throws JsonProcessingException {
			ImmutableMap<String, Object> newProps = ImmutableMap.of("correlationId", properties.get("correlationId")
					.asText());
			ImmutableMap<String, Object> toSend = ImmutableMap.of("content", map, "properties", newProps);
			jedis.publish(properties.get("replyTo").asText(), objectMapper.writeValueAsString(toSend));
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
