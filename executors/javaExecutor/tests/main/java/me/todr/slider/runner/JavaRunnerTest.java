package me.todr.slider.runner;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.InvocationTargetException;

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
		String string = getTestClass("");

		// when
		CompilerOutput clazz = cut.compile("Main", string);

		// then
		assertThat(clazz).isNotNull();
		assertThat(clazz.getClazz()).isNotNull();
	}

	@Test
	public void shouldRunCompiledClass() throws JavaRunnerException,
	JavaRunnerUsersException {
		// given
		String string = getTestClass("");
		CompilerOutput clazz = cut.compile("Main", string);

		// when
		String output = cut.run(clazz);

		// then
		assertThat(output).isEqualTo("xyz\nxyz\n");
	}

	@Test
	public void shouldHandleStandardMainMethod() throws JavaRunnerException,
	JavaRunnerUsersException {
		// given
		String classStr = getTestClass("String[] args");
		CompilerOutput clazz = cut.compile("Main", classStr);

		// when
		String output = cut.run(clazz);

		// then
		assertThat(output).isEqualTo("xyz\nxyz\n");
	}

	@Test
	public void shouldCompileInnerClasses() throws JavaRunnerException,
	JavaRunnerUsersException {
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

	@Test(expected = JavaRunnerUsersException.class)
	public void shouldThrowUsersCodeException() throws JavaRunnerException,
			JavaRunnerUsersException {
		// given
		StringBuilder code = new StringBuilder();
		code.append("public class Main {\n");
		code.append("public static void main() {\n");
		code.append("int x = 3 * 8; if (x == 3*8) { throw new RuntimeException(); }");
		code.append("}\n");
		code.append("}");
		String string = code.toString();
		CompilerOutput clazz = cut.compile("Main", string);
		System.out.println(clazz.getErrors());

		// when
		cut.run(clazz);

		// then
		assertThat(true).isEqualTo(false).as("Should throw Exception");
	}

	private String getTestClass(String args) {
		StringBuilder code = new StringBuilder();
		code.append("public class Main {\n");
		code.append("public static void main(" + args + ") {\n");
		code.append("System.out.println(\"xyz\");");
		code.append("System.err.println(\"xyz\");");
		code.append("}\n");
		code.append("}");
		String string = code.toString();
		return string;
	}

}
