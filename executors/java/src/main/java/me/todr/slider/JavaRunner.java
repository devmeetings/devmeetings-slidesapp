package me.todr.slider;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.security.SecureClassLoader;
import java.util.List;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.JavaCompiler;
import javax.tools.JavaCompiler.CompilationTask;
import javax.tools.JavaFileObject;
import javax.tools.JavaFileObject.Kind;
import javax.tools.SimpleJavaFileObject;
import javax.tools.StandardJavaFileManager;
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
			System.out.println(diagnostic.getCode());
			System.out.println(diagnostic.getKind());
			System.out.println(diagnostic.getPosition());
			System.out.println(diagnostic.getStartPosition());
			System.out.println(diagnostic.getEndPosition());
			System.out.println(diagnostic.getSource());
			System.out.println(diagnostic.getMessage(null));
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

	public static class CompilerOutput {
		private final Class<?> clazz;
		private final List<String> errors;

		CompilerOutput(Class<?> clazz) {
			this.clazz = clazz;
			this.errors = ImmutableList.of();
		}

		CompilerOutput(List<String> errors) {
			this.clazz = null;
			this.errors = errors;
		}

		public List<String> getErrors() {
			return errors;
		}

		public Class<?> getClazz() {
			return clazz;
		}
	}

	private static class JavaSourceFromString extends SimpleJavaFileObject {
		final String code;

		JavaSourceFromString(String name, String code) {
			super(URI.create("string:///" + name.replace('.', '/')
					+ Kind.SOURCE.extension), Kind.SOURCE);
			this.code = code;
		}

		@Override
		public CharSequence getCharContent(boolean ignoreEncodingErrors) {
			return code;
		}
	}

	private static class JavaClassObject extends SimpleJavaFileObject {

		/**
		 * Byte code created by the compiler will be stored in this
		 * ByteArrayOutputStream so that we can later get the byte array out of
		 * it and put it in the memory as an instance of our class.
		 */
		protected final ByteArrayOutputStream bos = new ByteArrayOutputStream();

		/**
		 * Registers the compiled class object under URI containing the class
		 * full name
		 * 
		 * @param name
		 *            Full name of the compiled class
		 * @param kind
		 *            Kind of the data. It will be CLASS in our case
		 */
		public JavaClassObject(String name, Kind kind) {
			super(URI.create("string:///" + name.replace('.', '/')
					+ kind.extension), kind);
		}

		/**
		 * Will be used by our file manager to get the byte code that can be put
		 * into memory to instantiate our class
		 * 
		 * @return compiled byte code
		 */
		public byte[] getBytes() {
			return bos.toByteArray();
		}

		/**
		 * Will provide the compiler with an output stream that leads to our
		 * byte array. This way the compiler will write everything into the byte
		 * array that we will instantiate later
		 */
		@Override
		public OutputStream openOutputStream() throws IOException {
			return bos;
		}
	}

	private static class ClassFileManager extends
			ForwardingJavaFileManager<StandardJavaFileManager> {
		/**
		 * Instance of JavaClassObject that will store the compiled bytecode of
		 * our class
		 */
		private JavaClassObject jclassObject;

		/**
		 * Will initialize the manager with the specified standard java file
		 * manager
		 * 
		 * @param standardManger
		 */
		public ClassFileManager(StandardJavaFileManager standardManager) {
			super(standardManager);
		}

		/**
		 * Will be used by us to get the class loader for our compiled class. It
		 * creates an anonymous class extending the SecureClassLoader which uses
		 * the byte code created by the compiler and stored in the
		 * JavaClassObject, and returns the Class for it
		 */
		@Override
		public ClassLoader getClassLoader(Location location) {
			return new SecureClassLoader() {
				@Override
				protected Class<?> findClass(String name)
						throws ClassNotFoundException {
					byte[] b = jclassObject.getBytes();
					return super.defineClass(name, jclassObject.getBytes(), 0,
							b.length);
				}
			};
		}

		public boolean hasClass() {
			return jclassObject != null;
		}

		/**
		 * Gives the compiler an instance of the JavaClassObject so that the
		 * compiler can write the byte code into it.
		 */
		@Override
		public JavaFileObject getJavaFileForOutput(Location location,
				String className, Kind kind, FileObject sibling)
				throws IOException {
			jclassObject = new JavaClassObject(className, kind);
			return jclassObject;
		}
	}
}
