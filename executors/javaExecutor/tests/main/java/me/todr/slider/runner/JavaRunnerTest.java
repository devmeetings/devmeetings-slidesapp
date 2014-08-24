package me.todr.slider.runner;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.InvocationTargetException;

import me.todr.slider.runner.CompilerOutput;
import me.todr.slider.runner.JavaRunner;
import me.todr.slider.runner.JavaRunnerException;

import org.junit.Before;
import org.junit.Test;

public class JavaRunnerTest {

	private JavaRunner cut;

	@Before
	public void setUp() {
		cut = new JavaRunner();
	}

	@Test
	public void shouldCompileClassGivenAsString()
			throws IllegalAccessException, IllegalArgumentException,
			InvocationTargetException, NoSuchMethodException, SecurityException {
		// given
		String string = getTestClass();

		// when
		CompilerOutput clazz = cut.compile("Main", string);

		// then
		assertThat(clazz).isNotNull();
		assertThat(clazz.getClazz()).isNotNull();
	}

	@Test
	public void shouldRunCompiledClass() throws JavaRunnerException {
		// given
		String string = getTestClass();
		CompilerOutput clazz = cut.compile("Main", string);

		// when
		String output = cut.run(clazz);

		// then
		assertThat(output).isEqualTo("xyz\n");
	}

	@Test
	public void shouldCompileInnerClasses() throws JavaRunnerException {
		// given
		StringBuilder code = new StringBuilder();
		code.append("public class Main {\n");
		code.append("public static class Inner {\n");
		code.append("@java.lang.Override\n");
		code.append("public String toString() { return \"Hello\"; }\n");
		code.append("}\n");
		code.append("public static void main() {\n");
		code.append("System.out.println(\"xyz\");");
		code.append("System.out.println(new Inner());");
		code.append("}\n");
		code.append("}");
		String string = code.toString();
		CompilerOutput clazz = cut.compile("Main", string);

		// when
		String output = cut.run(clazz);

		// then
		assertThat(output).isEqualTo("xyz\nHello\n");
	}

	private String getTestClass() {
		StringBuilder code = new StringBuilder();
		code.append("public class Main {\n");
		code.append("public static void main() {\n");
		code.append("System.out.println(\"xyz\");");
		code.append("}\n");
		code.append("}");
		String string = code.toString();
		return string;
	}

}
