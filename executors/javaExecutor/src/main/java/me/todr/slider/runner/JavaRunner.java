package me.todr.slider.runner;

import java.text.MessageFormat;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaCompiler.CompilationTask;
import javax.tools.JavaFileObject;
import javax.tools.ToolProvider;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableList.Builder;

public class JavaRunner {

	public CompilerOutput compile(String name, String code) {
		JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
		ClassFileManager fileManager = new ClassFileManager(
				compiler.getStandardFileManager(null, null, null));

		DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<JavaFileObject>();

		JavaSourceFromString clazz = new JavaSourceFromString(name, code);
		CompilationTask task = compiler.getTask(null, fileManager, diagnostics,
				null, null, ImmutableList.of(clazz));
		boolean success = task.call();
		Builder<String> errors = ImmutableList.builder();
		for (Diagnostic<?> diagnostic : diagnostics.getDiagnostics()) {
			System.err.println(MessageFormat.format(
					"{0} {1} pos: {2} ({3}-{4}) in {5}: {6}",
					diagnostic.getCode(), diagnostic.getKind(),
					diagnostic.getPosition(), diagnostic.getStartPosition(),
					diagnostic.getEndPosition(), diagnostic.getSource(),
					diagnostic.getMessage(null)));
			errors.add(diagnostic.getMessage(null) + " in position "
					+ diagnostic.getPosition());

		}
		if (!fileManager.hasClass()) {
			errors.add("Cannot compile class. Is this really a class?");
			return new CompilerOutput(errors.build());
		}

		if (success) {
			try {
				Class<?> loadClass = fileManager.getClassLoader(null)
						.loadClass(name);
				return new CompilerOutput(loadClass);
			} catch (ClassNotFoundException e) {
				return new CompilerOutput(ImmutableList.of("Cannot load class"));
			}
		}
		return new CompilerOutput(errors.build());
	}
}
