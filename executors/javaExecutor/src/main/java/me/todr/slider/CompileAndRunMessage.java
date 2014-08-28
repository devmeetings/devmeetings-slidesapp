package me.todr.slider;

import java.text.MessageFormat;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

import me.todr.slider.runner.CompilerOutput;
import me.todr.slider.runner.JavaRunner;
import me.todr.slider.runner.JavaRunnerException;
import me.todr.slider.runner.JavaRunnerUsersException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Function;
import com.google.common.base.Stopwatch;
import com.google.common.collect.Lists;

final class CompileAndRunMessage implements Callable<byte[]> {
	private static final ObjectMapper objectMapper = new ObjectMapper();
	private static final JavaRunner javaRunner = new JavaRunner();
	private final byte[] message;

	CompileAndRunMessage(byte[] message) {
		this.message = message;
	}

	@Override
	public byte[] call() throws Exception {
		Stopwatch watch = Stopwatch.createStarted();

		ObjectNode map = objectMapper.createObjectNode();
		// Read JSON
		JsonNode readTree = objectMapper.readTree(message);
		String name = "Main";
		String code = readTree.get("code").asText();

		// Compile code
		CompilerOutput compile = javaRunner.compile(name, code);
		Class<?> clazz = compile.getClazz();
		System.out.println(MessageFormat.format("  Compilation: {0}us",
				watch.elapsed(TimeUnit.MICROSECONDS)));

		// Something went wrong
		if (clazz == null) {
			putArray("errors", map, compile.getErrors());
			return objectMapper.writeValueAsBytes(map);
		}
		watch.reset().start();

		// Invoke method
		try {
			String output = javaRunner.run(compile);
			map.put("success", true);
			putArray("result", map, Arrays.asList(output.split("\n")));
		} catch (JavaRunnerException e) {
			map.put("success", false);
			map.withArray("errors").add(e.getCause().toString());
		} catch (JavaRunnerUsersException e) {
			map.put("success", false);
			Throwable originalException = e.getCause();
			map.withArray("errors").add(originalException.toString());

			List<String> stack = getTrimmedStackTrace(originalException);
			putArray("stacktrace", map, stack);
		} catch (Exception e) {
			map.put("success", false);
			map.withArray("errors").add(e.toString());
		}
		System.out.println(MessageFormat.format("  Running: {0}us",
				watch.elapsed(TimeUnit.MICROSECONDS)));
		return objectMapper.writeValueAsBytes(map);
	}

	private List<String> getTrimmedStackTrace(Throwable originalException) {
		StackTraceElement[] stackTrace = originalException.getStackTrace();
		List<StackTraceElement> stack = Arrays.asList(stackTrace);
		List<StackTraceElement> stackFiltered = getFilteredStack(stack);
		return Lists.transform(stackFiltered,
				new Function<StackTraceElement, String>() {
					@Override
					public String apply(StackTraceElement input) {
						return input.toString();
					}
				});
	}

	private List<StackTraceElement> getFilteredStack(
			List<StackTraceElement> stack) {
		List<StackTraceElement> stackFiltered = Lists.newArrayList();
		for (StackTraceElement stackElement : stack) {
			if (stackElement.getClassName().equals(
					"me.todr.slider.runner.JavaRunner")) {
				return stackFiltered.subList(0, stackFiltered.size() - 4);
			}
			stackFiltered.add(stackElement);
		}
		return stackFiltered;
	}

	private static void putArray(String prop, ObjectNode object,
			Collection<String> errors) {
		ArrayNode array = object.withArray(prop);
		for (String e : errors) {
			array.add(e);
		}
	}
}