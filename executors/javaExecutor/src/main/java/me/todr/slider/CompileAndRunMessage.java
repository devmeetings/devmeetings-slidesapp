package me.todr.slider;

import java.text.MessageFormat;
import java.util.Collection;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

import me.todr.slider.runner.CompilerOutput;
import me.todr.slider.runner.JavaRunner;
import me.todr.slider.runner.JavaRunnerException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Stopwatch;

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
		String name = "TestClass";
		String code = readTree.get("code").asText();

		// Compile code
		CompilerOutput compile = javaRunner.compile(name, code);
		Class<?> clazz = compile.getClazz();
		System.out.println(MessageFormat.format("  Compilation: {0}us",
				watch.elapsed(TimeUnit.MICROSECONDS)));
		// Something went wrong
		if (clazz == null) {
			putErrors(map, compile.getErrors());
			return objectMapper.writeValueAsBytes(map);
		}
		watch.reset().start();
		// Invoke method
		try {
			String output = javaRunner.run(compile);

			map.put("success", true);
			map.put("result", output);
		} catch (JavaRunnerException e) {
			map.put("success", false);
			map.withArray("errors").add(e.getCause().toString());
		} catch (Exception e) {
			map.put("success", false);
			map.withArray("errors").add(e.toString());
		}
		System.out.println(MessageFormat.format("  Running: {0}us",
				watch.elapsed(TimeUnit.MICROSECONDS)));
		return objectMapper.writeValueAsBytes(map);
	}

	private static void putErrors(ObjectNode object, Collection<String> errors) {
		ArrayNode array = object.withArray("errors");
		for (String e : errors) {
			array.add(e);
		}
	}
}