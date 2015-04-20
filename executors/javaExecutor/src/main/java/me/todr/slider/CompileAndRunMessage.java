package me.todr.slider;

import java.text.MessageFormat;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

import me.todr.slider.runner.CompilerOutput;
import me.todr.slider.runner.JavaRunner;
import me.todr.slider.runner.JavaRunnerException;
import me.todr.slider.runner.JavaRunnerUsersException;

import com.google.common.base.Function;
import com.google.common.base.Stopwatch;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;

final class CompileAndRunMessage implements Callable<Map<String, Object>> {
	private static final JavaRunner javaRunner = new JavaRunner();
	private final String code;

	CompileAndRunMessage(String code) {
		this.code = code;
	}

	@Override
	public Map<String, Object> call() throws Exception {
		Stopwatch watch = Stopwatch.createStarted();

		String name = "Main";

		// Compile code
		CompilerOutput compile = javaRunner.compile(name, code);
		Class<?> clazz = compile.getClazz();
		System.out.println(MessageFormat.format("  Compilation: {0}us", watch.elapsed(TimeUnit.MICROSECONDS)));

		// Something went wrong
		if (clazz == null) {
			return ImmutableMap.of("errors", compile.getErrors());
		}
		watch.reset().start();

		// Invoke method
		try {
			String output = javaRunner.run(compile);
			return ImmutableMap.of("success", true, "result", Arrays.asList(output.split("\n")));
		} catch (JavaRunnerException e) {
			return ImmutableMap.of("success", false, "errors", Arrays.asList(e.getCause().toString()));
		} catch (JavaRunnerUsersException e) {
			Throwable originalException = e.getCause();
			List<String> stack = getTrimmedStackTrace(originalException);
			return ImmutableMap.of(//
					"success", false,//
					"errors", Arrays.asList(originalException.toString()),//
					"stacktrace", stack);
		} catch (Exception e) {
			return ImmutableMap.of("success", false, "errors", Arrays.asList(e.toString()));
		} finally {
			System.out.println(MessageFormat.format("  Running: {0}us", watch.elapsed(TimeUnit.MICROSECONDS)));
		}
	}

	private List<String> getTrimmedStackTrace(Throwable originalException) {
		StackTraceElement[] stackTrace = originalException.getStackTrace();
		List<StackTraceElement> stack = Arrays.asList(stackTrace);
		List<StackTraceElement> stackFiltered = getFilteredStack(stack);
		return Lists.transform(stackFiltered, new Function<StackTraceElement, String>() {
			@Override
			public String apply(StackTraceElement input) {
				return input.toString();
			}
		});
	}

	private List<StackTraceElement> getFilteredStack(List<StackTraceElement> stack) {
		List<StackTraceElement> stackFiltered = Lists.newArrayList();
		for (StackTraceElement stackElement : stack) {
			if (stackElement.getClassName().equals("me.todr.slider.runner.JavaRunner")) {
				return stackFiltered.subList(0, stackFiltered.size() - 4);
			}
			stackFiltered.add(stackElement);
		}
		return stackFiltered;
	}
}